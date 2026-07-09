import platform
import psutil

from ipfs_client import (
    ipfs_available,
    get_peer_id,
    get_version,
)


def get_system_info():
    disk = psutil.disk_usage("C:\\")

    is_ipfs_running = ipfs_available()

    return {
        "available_storage": disk.free,
        "total_storage": disk.total,
        "operating_system": platform.system(),
        "agent_version": "0.1.0",
        "ipfs_status": is_ipfs_running,
        "ipfs_peer_id": get_peer_id() if is_ipfs_running else "",
        "ipfs_version": get_version() if is_ipfs_running else "",
    }
