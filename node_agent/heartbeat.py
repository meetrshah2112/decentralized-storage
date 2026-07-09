import requests
from utils import get_system_info

from config import (
    BACKEND_URL,
    NODE_UUID,
)


def send_heartbeat():

    url = f"{BACKEND_URL}/api/heartbeat/"

    payload = {
        "node_uuid": NODE_UUID,
        **get_system_info(),
    }

    try:

        response = requests.post(
            url,
            data=payload,
            timeout=10,
        )

        print(f"Status Code : {response.status_code}")

        try:
            print(response.json())
        except ValueError:
            print(response.text)

    except requests.exceptions.RequestException as error:

        print("Heartbeat Failed")
        print(error)
