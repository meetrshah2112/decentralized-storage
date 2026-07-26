from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UploadedFile, StorageNode


class UserSerializer(serializers.ModelSerializer):

    role = serializers.SerializerMethodField()
    storage_used = serializers.SerializerMethodField()
    storage_contributed = serializers.SerializerMethodField()
    reputation = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
            "storage_used",
            "storage_contributed",
            "reputation",
        ]

    def get_role(self, obj):
        return obj.profile.role

    def get_storage_used(self, obj):
        return obj.profile.storage_used

    def get_storage_contributed(self, obj):
        return obj.profile.storage_contributed

    def get_reputation(self, obj):
        return obj.profile.reputation


class RegisterSerializer(serializers.Serializer):

    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        if len(data["password"]) < 8:
            raise serializers.ValidationError(
                {"password": "Password must be at least 8 characters long."}
            )

        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        return user


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data["username"],
            password=data["password"],
        )

        if not user:
            raise serializers.ValidationError("Invalid username or password.")

        data["user"] = user

        return data


class UploadedFileSerializer(serializers.ModelSerializer):

    file_size_mb = serializers.ReadOnlyField()
    gateway_url = serializers.ReadOnlyField()
    provider_node_name = serializers.SerializerMethodField()

    class Meta:
        model = UploadedFile
        fields = [
            "id",
            "original_filename",
            "cid",
            "file_size",
            "file_size_mb",
            "content_type",
            "gateway_url",
            "provider_node",
            "provider_node_name",
            "uploaded_at",
        ]

    def get_provider_node_name(self, obj):
        if obj.provider_node:
            return obj.provider_node.display_name
        return None


class FileUploadSerializer(serializers.Serializer):

    file = serializers.FileField()


class StorageNodeSerializer(serializers.ModelSerializer):

    online = serializers.ReadOnlyField()
    available_storage_gb = serializers.ReadOnlyField()
    total_storage_gb = serializers.ReadOnlyField()
    allocated_storage_gb = serializers.ReadOnlyField()
    storage_used_gb = serializers.ReadOnlyField()
    storage_used_display = serializers.ReadOnlyField()
    owner_username = serializers.SerializerMethodField()

    class Meta:
        model = StorageNode
        fields = [
            "id",
            "owner_username",
            "display_name",
            "node_uuid",
            "allocated_storage",
            "allocated_storage_gb",
            "storage_used",
            "storage_used_gb",
            "storage_used_display",
            "available_storage",
            "available_storage_gb",
            "total_storage",
            "total_storage_gb",
            "operating_system",
            "agent_version",
            "ipfs_status",
            "ipfs_peer_id",
            "ipfs_version",
            "last_heartbeat",
            "online",
            "status",
            "created_at",
            "updated_at",
        ]

    def get_owner_username(self, obj):
        return obj.owner.username
