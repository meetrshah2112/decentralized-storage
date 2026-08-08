from datetime import timedelta
import json
from .provider_selection import select_best_provider_node
from .provider_agent_client import upload_file_to_provider
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse_lazy
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.db import transaction
from django.db.models import F
from .provider_agent_client import upload_file_to_provider, download_file_from_provider


from .forms import (
    RegistrationForm,
    StorageNodeForm,
    FileUploadForm,
)
from .ipfs_client import add_file_to_ipfs, get_file_from_ipfs
from .models import StorageNode, UploadedFile


class CustomLoginView(LoginView):
    template_name = "registration/login.html"
    redirect_authenticated_user = True

    def get_success_url(self):
        profile = self.request.user.profile

        if profile.role == "provider":
            return reverse_lazy("provider_dashboard")

        return reverse_lazy("consumer_dashboard")


@login_required
def download_file(request, file_id):
    uploaded_file = get_object_or_404(
        UploadedFile,
        id=file_id,
        owner=request.user,
    )

    if not uploaded_file.provider_node:
        messages.error(
            request,
            "Provider node information is missing for this file.",
        )
        return redirect("consumer_dashboard")

    try:
        file_content = download_file_from_provider(
            provider_node=uploaded_file.provider_node,
            cid=uploaded_file.cid,
        )

        response = HttpResponse(
            file_content,
            content_type=uploaded_file.content_type or "application/octet-stream",
        )

        response["Content-Disposition"] = (
            f'attachment; filename="{uploaded_file.original_filename}"'
        )

        return response

    except Exception as error:
        messages.error(
            request,
            f"File download failed: {error}",
        )
        return redirect("consumer_dashboard")


@login_required
def view_file(request, file_id):
    uploaded_file = get_object_or_404(
        UploadedFile,
        id=file_id,
        owner=request.user,
    )

    if not uploaded_file.provider_node:
        messages.error(
            request,
            "Provider node information is missing for this file.",
        )
        return redirect("consumer_dashboard")

    try:
        file_content = download_file_from_provider(
            provider_node=uploaded_file.provider_node,
            cid=uploaded_file.cid,
        )

        response = HttpResponse(
            file_content,
            content_type=uploaded_file.content_type or "application/octet-stream",
        )

        response["Content-Disposition"] = (
            f'inline; filename="{uploaded_file.original_filename}"'
        )

        return response

    except Exception as error:
        messages.error(
            request,
            f"File view failed: {error}",
        )
        return redirect("consumer_dashboard")


@login_required
def become_provider(request):

    profile = request.user.profile

    if profile.role == "provider":
        return redirect("provider_dashboard")

    if request.method == "POST":
        profile.role = "provider"
        profile.save(
            update_fields=[
                "role",
                "updated_at",
            ]
        )

        messages.success(
            request,
            "You are now registered as a storage provider. Please register your storage node.",
        )

        return redirect("register_storage_node")

    return redirect("consumer_dashboard")


def register(request):

    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":
        form = RegistrationForm(request.POST)

        if form.is_valid():
            form.save()

            messages.success(
                request, "Account created successfully. You can now log in."
            )

            return redirect("login")

    else:
        form = RegistrationForm()

    return render(
        request,
        "registration/register.html",
        {"form": form},
    )


@login_required
def home(request):

    if request.user.profile.role == "provider":
        return redirect("provider_dashboard")

    return redirect("consumer_dashboard")


@csrf_exempt
@require_POST
def heartbeat(request):

    node_uuid = request.POST.get("node_uuid")

    try:
        node = StorageNode.objects.get(node_uuid=node_uuid)

        node.last_heartbeat = timezone.now()
        node.is_online = True
        node.available_storage = int(request.POST.get("available_storage", 0))
        node.total_storage = int(request.POST.get("total_storage", 0))
        node.operating_system = request.POST.get("operating_system", "")
        node.agent_version = request.POST.get("agent_version", "0.1.0")
        node.ipfs_status = request.POST.get("ipfs_status") == "True"
        node.ipfs_peer_id = request.POST.get("ipfs_peer_id", "")
        node.ipfs_version = request.POST.get("ipfs_version", "")
        node.agent_api_url = request.POST.get("agent_api_url", "")

        node.save()

        return JsonResponse(
            {
                "success": True,
                "message": "Heartbeat received.",
            }
        )

    except StorageNode.DoesNotExist:

        return JsonResponse(
            {
                "success": False,
                "message": "Node not found.",
            },
            status=404,
        )


@login_required
def consumer_dashboard(request):
    if request.method == "POST":
        form = FileUploadForm(request.POST, request.FILES)

        if form.is_valid():
            uploaded_file = request.FILES["file"]

            # 2. Select active provider node ONCE before uploading
            provider_node = select_best_provider_node(uploaded_file.size)

            if not provider_node:
                messages.error(
                    request,
                    "No active provider node with enough storage is available. Please check node agent status.",
                )
                return redirect("consumer_dashboard")

            try:
                # 3. Perform IPFS Upload using the locked provider node
                provider_result = upload_file_to_provider(
                    provider_node=provider_node,
                    file_obj=uploaded_file,
                    filename=uploaded_file.name,
                )

                cid = provider_result["cid"]

                # 4. Atomic Database Updates
                with transaction.atomic():
                    # Create upload record bound to the correct provider_node
                    UploadedFile.objects.create(
                        owner=request.user,
                        provider_node=provider_node,
                        original_filename=uploaded_file.name,
                        cid=cid,
                        file_size=uploaded_file.size,
                        content_type=uploaded_file.content_type or "",
                    )

                    profile = request.user.profile

                    # Update consumer usage atomically (prevents race conditions)
                    profile.storage_used = F("storage_used") + uploaded_file.size
                    profile.save(update_fields=["storage_used", "updated_at"])

                    # Update provider node storage usage atomically
                    provider_node.storage_used = F("storage_used") + uploaded_file.size
                    provider_node.save(update_fields=["storage_used", "updated_at"])

                    # Update provider user's contributed storage atomically
                    provider_profile = provider_node.owner.profile
                    provider_profile.storage_contributed = (
                        F("storage_contributed") + uploaded_file.size
                    )
                    provider_profile.save(
                        update_fields=["storage_contributed", "updated_at"]
                    )

                messages.success(request, "File uploaded to IPFS successfully.")
                return redirect("consumer_dashboard")

            except Exception as error:
                messages.error(request, f"IPFS upload failed: {error}")

    else:
        form = FileUploadForm()

    uploaded_files = UploadedFile.objects.filter(owner=request.user).order_by(
        "-uploaded_at"
    )

    return render(
        request,
        "storage/consumer_dashboard.html",
        {
            "form": form,
            "uploaded_files": uploaded_files,
        },
    )


@login_required
def provider_dashboard(request):

    node = StorageNode.objects.filter(owner=request.user).first()

    return render(
        request,
        "storage/provider_dashboard.html",
        {
            "node": node,
        },
    )


@login_required
def register_storage_node(request):

    profile = request.user.profile

    if profile.role != "provider":
        messages.error(request, "Only providers can register storage nodes.")
        return redirect("consumer_dashboard")

    if StorageNode.objects.filter(owner=request.user).exists():
        messages.info(request, "You have already registered a storage node.")
        return redirect("provider_dashboard")

    if request.method == "POST":

        form = StorageNodeForm(request.POST)

        if form.is_valid():

            node = form.save(commit=False)
            node.owner = request.user
            node.save()

            messages.success(request, "Storage node registered successfully.")

            return redirect("provider_dashboard")

    else:

        form = StorageNodeForm()

    return render(
        request,
        "storage/register_storage_node.html",
        {
            "form": form,
        },
    )
