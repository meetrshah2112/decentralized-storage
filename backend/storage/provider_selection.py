from datetime import timedelta

from django.utils import timezone

from .models import StorageNode


def get_active_provider_nodes(file_size):
    active_since = timezone.now() - timedelta(seconds=60)

    nodes = StorageNode.objects.filter(
        ipfs_status=True,
        last_heartbeat__gte=active_since,
    ).exclude(agent_api_url="")

    eligible_nodes = []

    for node in nodes:
        allocated_remaining = node.allocated_storage - node.storage_used

        if allocated_remaining < file_size:
            continue

        if node.available_storage < file_size:
            continue

        eligible_nodes.append(node)

    return eligible_nodes


def calculate_provider_score(node):
    allocated_storage = max(node.allocated_storage, 1)
    total_storage = max(node.total_storage, 1)

    allocated_remaining = max(
        node.allocated_storage - node.storage_used,
        0,
    )

    available_storage_score = node.available_storage / total_storage
    allocated_remaining_score = allocated_remaining / allocated_storage
    reputation_score = (
        node.owner.profile.reputation / 100 if node.owner.profile.reputation else 0
    )
    load_score = node.storage_used / allocated_storage

    score = (
        0.40 * available_storage_score
        + 0.35 * allocated_remaining_score
        + 0.15 * reputation_score
        - 0.10 * load_score
    )

    return score


def select_best_provider_node(file_size):
    eligible_nodes = get_active_provider_nodes(file_size)

    if not eligible_nodes:
        return None

    return max(
        eligible_nodes,
        key=calculate_provider_score,
    )
