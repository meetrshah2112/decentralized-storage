import threading
import time

from heartbeat import send_heartbeat
from config import (
    HEARTBEAT_INTERVAL,
    AGENT_PUBLIC_URL,
)
from ipfs_client import (
    ipfs_available,
    get_peer_id,
    get_version,
)
from upload_server import run_upload_server


def heartbeat_loop():
    while True:
        send_heartbeat()
        print("-" * 50)
        time.sleep(HEARTBEAT_INTERVAL)


def main():

    print("=" * 50)
    print("Decentralized Storage Node Agent")
    print("=" * 50)

    print(f"Heartbeat every {HEARTBEAT_INTERVAL} seconds")
    print(f"Agent API URL : {AGENT_PUBLIC_URL}")

    print(f"IPFS Running  : {ipfs_available()}")
    print(f"Peer ID       : {get_peer_id()}")
    print(f"IPFS Version  : {get_version()}")
    print()

    server_thread = threading.Thread(
        target=run_upload_server,
        daemon=True,
    )
    server_thread.start()

    heartbeat_loop()


if __name__ == "__main__":
    main()
