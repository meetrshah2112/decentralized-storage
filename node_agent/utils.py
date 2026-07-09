import platform

import psutil


def get_system_info():

    disk = psutil.disk_usage("C:\\")

    return {
        "available_storage": disk.free,
        "total_storage": disk.total,
        "operating_system": platform.system(),
        "agent_version": "0.1.0",
        "ipfs_status": False,
    }
