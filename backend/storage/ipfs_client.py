import requests
from django.conf import settings

IPFS_API_URL = "http://127.0.0.1:5001/api/v0"


def add_file_to_ipfs(file_obj, filename):
    """
    Upload a file object to the local IPFS daemon.
    Returns IPFS response data containing CID.
    """

    url = f"{IPFS_API_URL}/add"

    try:
        files = {
            "file": (
                filename,
                file_obj,
            )
        }

        response = requests.post(
            url,
            files=files,
            timeout=30,
        )

        response.raise_for_status()

        return response.json()

    except requests.RequestException as error:
        raise Exception(f"IPFS upload failed: {error}")


def check_ipfs_connection():
    """
    Check whether local IPFS daemon is running.
    """

    try:
        response = requests.post(
            f"{IPFS_API_URL}/version",
            timeout=5,
        )

        return response.status_code == 200

    except requests.RequestException:
        return False


def get_file_from_ipfs(cid):
    """
    Download file content from local IPFS daemon using CID.
    """

    url = f"{IPFS_API_URL}/cat"

    try:
        response = requests.post(
            url,
            params={
                "arg": cid,
            },
            timeout=60,
        )

        response.raise_for_status()

        return response.content

    except requests.RequestException as error:
        raise Exception(f"IPFS download failed: {error}")
