from datetime import timedelta
from django.contrib.auth.models import User
from django.utils import timezone
from django.contrib.auth import login, logout
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .provider_selection import select_best_provider_node
from .provider_agent_client import upload_file_to_provider

from .ipfs_client import add_file_to_ipfs, get_file_from_ipfs
from .models import StorageNode, UploadedFile, UserProfile
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    UploadedFileSerializer,
    FileUploadSerializer,
    StorageNodeSerializer,
)


@api_view(["POST"])
@permission_classes([AllowAny])
def api_register(request):

    serializer = RegisterSerializer(
        data=request.data,
    )

    if not serializer.is_valid():
        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = serializer.save()

    token, created = Token.objects.get_or_create(
        user=user,
    )

    user_serializer = UserSerializer(user)

    return Response(
        {
            "success": True,
            "message": "User registered successfully.",
            "token": token.key,
            "user": user_serializer.data,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def api_login(request):

    serializer = LoginSerializer(
        data=request.data,
    )

    if not serializer.is_valid():
        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = serializer.validated_data["user"]

    login(
        request,
        user,
    )

    token, created = Token.objects.get_or_create(
        user=user,
    )

    user_serializer = UserSerializer(user)

    return Response(
        {
            "success": True,
            "message": "Login successful.",
            "token": token.key,
            "user": user_serializer.data,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_logout(request):

    Token.objects.filter(
        user=request.user,
    ).delete()

    logout(request)

    return Response(
        {
            "success": True,
            "message": "Logged out successfully.",
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_me(request):

    serializer = UserSerializer(
        request.user,
    )

    return Response(
        {
            "success": True,
            "user": serializer.data,
        }
    )


def get_active_provider_node():
    active_since = timezone.now() - timedelta(seconds=60)

    return (
        StorageNode.objects.filter(
            ipfs_status=True,
            last_heartbeat__gte=active_since,
        )
        .order_by(
            "-last_heartbeat",
        )
        .first()
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_file_list(request):

    files = UploadedFile.objects.filter(
        owner=request.user,
    ).order_by("-uploaded_at")

    serializer = UploadedFileSerializer(
        files,
        many=True,
    )

    return Response(
        {
            "success": True,
            "count": files.count(),
            "files": serializer.data,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_file_upload(request):

    serializer = FileUploadSerializer(
        data=request.data,
    )

    if not serializer.is_valid():
        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    uploaded_file = serializer.validated_data["file"]

    provider_node = select_best_provider_node(uploaded_file.size)

    if not provider_node:
        return Response(
            {
                "success": False,
                "message": "No active provider node available. Please try again later.",
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    try:

        provider_result = upload_file_to_provider(
            provider_node=provider_node,
            file_obj=uploaded_file,
            filename=uploaded_file.name,
        )

        cid = provider_result["cid"]

        saved_file = UploadedFile.objects.create(
            owner=request.user,
            provider_node=provider_node,
            original_filename=uploaded_file.name,
            cid=cid,
            file_size=uploaded_file.size,
            content_type=uploaded_file.content_type or "",
        )

        profile = request.user.profile
        profile.storage_used += uploaded_file.size
        profile.save(
            update_fields=[
                "storage_used",
                "updated_at",
            ]
        )

        provider_node.storage_used += uploaded_file.size
        provider_node.save(
            update_fields=[
                "storage_used",
                "updated_at",
            ]
        )

        provider_profile = provider_node.owner.profile
        provider_profile.storage_contributed += uploaded_file.size
        provider_profile.save(
            update_fields=[
                "storage_contributed",
                "updated_at",
            ]
        )

        response_serializer = UploadedFileSerializer(saved_file)

        return Response(
            {
                "success": True,
                "message": "File uploaded successfully to selected provider node.",
                "file": response_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as error:
        return Response(
            {
                "success": False,
                "message": f"IPFS upload failed: {error}",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_file_detail(request, file_id):

    try:
        uploaded_file = UploadedFile.objects.get(
            id=file_id,
            owner=request.user,
        )

    except UploadedFile.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "File not found.",
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = UploadedFileSerializer(uploaded_file)

    return Response(
        {
            "success": True,
            "file": serializer.data,
        }
    )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def api_file_delete(request, file_id):

    try:
        uploaded_file = UploadedFile.objects.get(
            id=file_id,
            owner=request.user,
        )

    except UploadedFile.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "File not found.",
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    file_size = uploaded_file.file_size
    provider_node = uploaded_file.provider_node

    profile = request.user.profile
    profile.storage_used = max(
        0,
        profile.storage_used - file_size,
    )
    profile.save(
        update_fields=[
            "storage_used",
            "updated_at",
        ]
    )

    if provider_node:
        provider_node.storage_used = max(
            0,
            provider_node.storage_used - file_size,
        )
        provider_node.save(
            update_fields=[
                "storage_used",
                "updated_at",
            ]
        )

    uploaded_file.delete()

    return Response(
        {
            "success": True,
            "message": "File record deleted successfully.",
        }
    )


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def api_become_provider(request):

#     profile = request.user.profile

#     if profile.role == "provider":
#         return Response(
#             {
#                 "success": True,
#                 "message": "User is already a provider.",
#             }
#         )

#     profile.role = "provider"
#     profile.save(
#         update_fields=[
#             "role",
#             "updated_at",
#         ]
#     )

#     return Response(
#         {
#             "success": True,
#             "message": "User upgraded to storage provider.",
#         }
#     )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_become_provider(request):

    profile = request.user.profile

    if profile.role == "provider":
        serializer = UserSerializer(request.user)

        return Response(
            {
                "success": True,
                "message": "User is already a provider.",
                "user": serializer.data,
            }
        )

    profile.role = "provider"
    profile.save(
        update_fields=[
            "role",
            "updated_at",
        ]
    )

    serializer = UserSerializer(request.user)

    return Response(
        {
            "success": True,
            "message": "User upgraded to storage provider.",
            "user": serializer.data,
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_provider_node(request):

    node = StorageNode.objects.filter(
        owner=request.user,
    ).first()

    if not node:
        return Response(
            {
                "success": False,
                "message": "No storage node registered.",
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = StorageNodeSerializer(node)

    return Response(
        {
            "success": True,
            "node": serializer.data,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_provider_node_register(request):

    profile = request.user.profile

    if profile.role != "provider":
        return Response(
            {
                "success": False,
                "message": "Only providers can register a storage node.",
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    existing_node = StorageNode.objects.filter(
        owner=request.user,
    ).first()

    if existing_node:
        serializer = StorageNodeSerializer(existing_node)

        return Response(
            {
                "success": True,
                "message": "Storage node already exists.",
                "node": serializer.data,
            }
        )

    display_name = request.data.get("display_name")
    allocated_storage_gb = request.data.get("allocated_storage_gb")

    if not display_name:
        return Response(
            {
                "success": False,
                "message": "Display name is required.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        allocated_storage_gb = float(allocated_storage_gb)

        if allocated_storage_gb <= 0:
            raise ValueError

    except (TypeError, ValueError):
        return Response(
            {
                "success": False,
                "message": "Allocated storage must be a positive number in GB.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    allocated_storage_bytes = int(allocated_storage_gb * 1024 * 1024 * 1024)

    node = StorageNode.objects.create(
        owner=request.user,
        display_name=display_name,
        allocated_storage=allocated_storage_bytes,
    )

    serializer = StorageNodeSerializer(node)

    return Response(
        {
            "success": True,
            "message": "Storage node registered successfully.",
            "node": serializer.data,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_network_stats(request):

    active_since = timezone.now() - timedelta(seconds=60)

    total_nodes = StorageNode.objects.count()

    online_nodes = StorageNode.objects.filter(
        last_heartbeat__gte=active_since,
    ).count()

    ipfs_connected_nodes = StorageNode.objects.filter(
        ipfs_status=True,
        last_heartbeat__gte=active_since,
    ).count()

    total_files = UploadedFile.objects.count()

    total_storage_used = sum(file.file_size for file in UploadedFile.objects.all())

    return Response(
        {
            "success": True,
            "stats": {
                "total_nodes": total_nodes,
                "online_nodes": online_nodes,
                "offline_nodes": total_nodes - online_nodes,
                "ipfs_connected_nodes": ipfs_connected_nodes,
                "total_files": total_files,
                "total_storage_used": total_storage_used,
                "total_storage_used_bytes": total_storage_used,
                "total_storage_used_mb": round(
                    total_storage_used / (1024 * 1024),
                    2,
                ),
            },
        }
    )


@api_view(["GET"])
@permission_classes([IsAdminUser])
def api_admin_stats(request):

    total_users = User.objects.count()

    total_consumers = UserProfile.objects.filter(
        role="consumer",
    ).count()

    total_providers = UserProfile.objects.filter(
        role="provider",
    ).count()

    total_nodes = StorageNode.objects.count()
    total_files = UploadedFile.objects.count()

    total_storage_used = sum(file.file_size for file in UploadedFile.objects.all())

    return Response(
        {
            "success": True,
            "stats": {
                "total_users": total_users,
                "total_consumers": total_consumers,
                "total_providers": total_providers,
                "total_nodes": total_nodes,
                "total_files": total_files,
                "total_storage_used_bytes": total_storage_used,
                "total_storage_used_mb": round(
                    total_storage_used / (1024 * 1024),
                    2,
                ),
            },
        }
    )
