from dotenv import load_dotenv
import os

load_dotenv()


BACKEND_URL = os.getenv("BACKEND_URL")

NODE_UUID = os.getenv("NODE_UUID")

HEARTBEAT_INTERVAL = int(os.getenv("HEARTBEAT_INTERVAL", 30))
