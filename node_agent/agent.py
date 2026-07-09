import time
from heartbeat import send_heartbeat
from config import HEARTBEAT_INTERVAL
from ipfs_client import (
    ipfs_available,
    get_peer_id,
    get_version,
)


def main():

    print("=" * 50)
    print("Decentralized Storage Node Agent")
    print("=" * 50)

    print(f"Heartbeat every {HEARTBEAT_INTERVAL} seconds")

    print(f"IPFS Running : {ipfs_available()}")
    print(f"Peer ID      : {get_peer_id()}")
    print(f"IPFS Version : {get_version()}")
    print()

    while True:

        send_heartbeat()

        print("-" * 50)

        time.sleep(HEARTBEAT_INTERVAL)


if __name__ == "__main__":
    main()
