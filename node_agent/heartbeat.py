import requests

from utils import get_system_info

from config import (
    BACKEND_URL,
    NODE_UUID,
    get_agent_public_url,
)


def send_heartbeat():

    url = f"{BACKEND_URL}/api/heartbeat/"

    agent_public_url = get_agent_public_url()

    payload = {
        "node_uuid": NODE_UUID,
        "agent_api_url": agent_public_url,
        **get_system_info(),
    }

    print()
    print("=" * 50)
    print("Sending heartbeat")
    print(f"Node UUID       : {NODE_UUID}")
    print(f"Agent API URL   : {agent_public_url}")
    print("=" * 50)

    try:

        response = requests.post(
            url,
            data=payload,
            timeout=10,
        )

        print(f"Status Code     : {response.status_code}")

        try:
            print(response.json())

        except ValueError:
            print(response.text)

    except requests.exceptions.RequestException as error:

        print("Heartbeat Failed")
        print(error)