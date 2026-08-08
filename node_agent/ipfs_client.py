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


def add_file_to_ipfs(file_storage):
    try:
        response = requests.post(
            f"{IPFS_API}/add",
            files={
                "file": (
                    file_storage.filename,
                    file_storage.stream,
                )
            },
            timeout=120,
        )

        response.raise_for_status()

        return response.json()

    except requests.RequestException as error:
        raise Exception(f"IPFS add failed: {error}")


def get_file_from_ipfs(cid):
    try:
        response = requests.post(
            f"{IPFS_API}/cat",
            params={
                "arg": cid,
            },
            timeout=120,
        )

        response.raise_for_status()

        return response.content

    except requests.RequestException as error:
        raise Exception(f"IPFS cat failed: {error}")
