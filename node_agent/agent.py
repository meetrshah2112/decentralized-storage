import time

from heartbeat import send_heartbeat
from config import HEARTBEAT_INTERVAL


def main():

    print("=" * 50)
    print("Decentralized Storage Node Agent")
    print("=" * 50)

    print(f"Heartbeat every {HEARTBEAT_INTERVAL} seconds")
    print()

    while True:

        send_heartbeat()

        print("-" * 50)

        time.sleep(HEARTBEAT_INTERVAL)


if __name__ == "__main__":
    main()
