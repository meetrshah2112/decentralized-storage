import requests

from config import (
    BACKEND_URL,
    NODE_UUID,
    NODE_TOKEN,
    get_agent_public_url,
)

from utils import get_system_info


def send_heartbeat():

    url = f"{BACKEND_URL}/api/heartbeat/"

    agent_public_url = get_agent_public_url()

    payload = {
        "node_uuid": NODE_UUID,
        "node_token": NODE_TOKEN,
        "agent_api_url": agent_public_url,
        **get_system_info(),
    }

    print()
    print("=" * 60)
    print("Sending heartbeat")
    print("=" * 60)
    print(f"Node UUID     : {NODE_UUID}")
    print(f"Agent URL     : {agent_public_url}")
    print(f"Backend       : {BACKEND_URL}")

    try:

        response = requests.post(
            url,
            data=payload,
            timeout=10,
        )

        print(f"Status Code   : {response.status_code}")

        try:
            print(
                "Response      :",
                response.json(),
            )

        except ValueError:
            print(
                "Response      :",
                response.text,
            )

    except requests.exceptions.RequestException as error:

        print("Heartbeat Failed")
        print(error)