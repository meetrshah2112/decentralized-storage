from dotenv import load_dotenv
import json
import os
import socket
import uuid

load_dotenv()


BACKEND_URL = os.getenv("BACKEND_URL")

NODE_TOKEN = os.getenv("NODE_TOKEN")

HEARTBEAT_INTERVAL = int(
    os.getenv("HEARTBEAT_INTERVAL", 30)
)

AGENT_HOST = os.getenv(
    "AGENT_HOST",
    "0.0.0.0",
)

AGENT_PORT = int(
    os.getenv(
        "AGENT_PORT",
        9000,
    )
)


IDENTITY_FILE = os.path.join(
    os.path.dirname(__file__),
    "node_identity.json",
)


def get_or_create_node_uuid():
    """
    Generate the node UUID only once.

    The UUID is stored locally so it remains
    the same after restarting the Node Agent.
    """

    if os.path.exists(IDENTITY_FILE):

        try:
            with open(
                IDENTITY_FILE,
                "r",
                encoding="utf-8",
            ) as file:

                data = json.load(file)

            saved_uuid = data.get("node_uuid")

            if saved_uuid:
                return saved_uuid

        except (
            OSError,
            json.JSONDecodeError,
        ):
            pass

    new_uuid = str(uuid.uuid4())

    with open(
        IDENTITY_FILE,
        "w",
        encoding="utf-8",
    ) as file:

        json.dump(
            {
                "node_uuid": new_uuid,
            },
            file,
            indent=4,
        )

    return new_uuid


NODE_UUID = get_or_create_node_uuid()


def get_local_ip():
    """
    Automatically detect the computer's LAN IP.
    """

    sock = socket.socket(
        socket.AF_INET,
        socket.SOCK_DGRAM,
    )

    try:
        sock.connect(
            ("8.8.8.8", 80)
        )

        local_ip = sock.getsockname()[0]

    except Exception:
        local_ip = "127.0.0.1"

    finally:
        sock.close()

    return local_ip


def get_agent_public_url():
    """
    Build the Node Agent URL using
    the computer's current LAN IP.
    """

    local_ip = get_local_ip()

    return f"http://{local_ip}:{AGENT_PORT}"