from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid
from datetime import timedelta


class UserProfile(models.Model):

    ROLE_CHOICES = [
        ("consumer", "Storage Consumer"),
        ("provider", "Storage Provider"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="consumer",
    )

    storage_used = models.BigIntegerField(default=0)

    storage_contributed = models.BigIntegerField(default=0)

    reputation = models.IntegerField(default=0)

    is_verified_provider = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class StorageNode(models.Model):

    STATUS_CHOICES = [
        ("created", "Created"),
        ("configured", "Configured"),
        ("active", "Active"),
        ("offline", "Offline"),
        ("maintenance", "Maintenance"),
    ]

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="storage_nodes",
    )

    display_name = models.CharField(
        max_length=100,
    )

    node_uuid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )

    allocated_storage = models.BigIntegerField(
        default=0,
    )

    storage_used = models.BigIntegerField(
        default=0,
    )

    last_heartbeat = models.DateTimeField(
        null=True,
        blank=True,
    )

    is_online = models.BooleanField(
        default=False,
    )

    available_storage = models.BigIntegerField(default=0)

    total_storage = models.BigIntegerField(default=0)

    operating_system = models.CharField(
        max_length=100,
        blank=True,
    )

    agent_version = models.CharField(
        max_length=20,
        default="0.1.0",
    )

    ipfs_status = models.BooleanField(default=False)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="created",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"{self.display_name} ({self.owner.username})"

    @property
    def online(self):
        if not self.last_heartbeat:
            return False

        return (timezone.now() - self.last_heartbeat) < timedelta(seconds=60)

    @property
    def available_storage_gb(self):
        return round(
            self.available_storage / (1024**3),
            2,
        )

    @property
    def total_storage_gb(self):
        return round(
            self.total_storage / (1024**3),
            2,
        )

    @property
    def allocated_storage_gb(self):
        return round(
            self.allocated_storage / (1024**3),
            2,
        )

    @property
    def storage_used_gb(self):
        return round(
            self.storage_used / (1024**3),
            2,
        )
