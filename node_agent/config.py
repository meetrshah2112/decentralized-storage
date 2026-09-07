from dotenv import load_dotenv
import os
import socket

load_dotenv()


BACKEND_URL = os.getenv("BACKEND_URL")
NODE_UUID = os.getenv("NODE_UUID")

HEARTBEAT_INTERVAL = int(
    os.getenv("HEARTBEAT_INTERVAL", 30)
)

AGENT_HOST = os.getenv(
    "AGENT_HOST",
    "0.0.0.0"
)

AGENT_PORT = int(
    os.getenv(
        "AGENT_PORT",
        9000
    )
)


def get_local_ip():
    """
    Detect the machine's LAN IP address automatically.

    Example:
        192.168.1.25
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
    Build the Node Agent URL automatically
    using the machine's current LAN IP.
    """

    local_ip = get_local_ip()

    return f"http://{local_ip}:{AGENT_PORT}"
    