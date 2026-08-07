from dotenv import load_dotenv
import os

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL")
NODE_UUID = os.getenv("NODE_UUID")

HEARTBEAT_INTERVAL = int(os.getenv("HEARTBEAT_INTERVAL", 30))

AGENT_HOST = os.getenv("AGENT_HOST", "0.0.0.0")
AGENT_PORT = int(os.getenv("AGENT_PORT", 9000))
AGENT_PUBLIC_URL = os.getenv("AGENT_PUBLIC_URL")
