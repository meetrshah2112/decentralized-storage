import requests

IPFS_API = "http://127.0.0.1:5001/api/v0"


def ipfs_available():
    try:
        response = requests.post(
            f"{IPFS_API}/version",
            timeout=5,
        )

        return response.status_code == 200

    except requests.RequestException:
        return False


def get_peer_id():
    try:
        response = requests.post(
            f"{IPFS_API}/id",
            timeout=5,
        )

        if response.status_code != 200:
            return None

        return response.json()["ID"]

    except requests.RequestException:
        return None


def get_version():
    try:
        response = requests.post(
            f"{IPFS_API}/version",
            timeout=5,
        )

        if response.status_code != 200:
            return None

        return response.json()["Version"]

    except requests.RequestException:
        return None
