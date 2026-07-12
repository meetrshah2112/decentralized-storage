# Decentralized Storage System

A decentralized storage platform using Django, IPFS, and a provider node agent.

This project allows users to upload files to IPFS, store the returned CID in Django, view/download files using IPFS, and register storage provider nodes that report live system and IPFS status through a Node Agent.

---

## Current Features

- User registration and login
- Role-based dashboards
  - Consumer Dashboard
  - Provider Dashboard
- Become a Storage Provider flow
- Provider storage node registration
- Node Agent heartbeat system
- Live provider node status
- Live IPFS connection status
- IPFS peer ID and version tracking
- File upload to IPFS
- CID storage in Django database
- File view through IPFS gateway
- File download through Django
- Provider storage usage tracking

---

## Tech Stack

### Backend

- Python 3.11
- Django 5.2
- SQLite
- Bootstrap
- Requests

### Decentralized Storage

- IPFS / Kubo
- Local IPFS daemon
- IPFS HTTP API

### Node Agent

- Python
- Requests
- python-dotenv
- psutil

---

## Project Structure

```text
DecentralizedStorage/
├── backend/
│   ├── manage.py
│   ├── config/
│   ├── storage/
│   ├── templates/
│   ├── static/
│   ├── media/
│   ├── requirements.txt
│   └── venv/
│
├── node_agent/
│   ├── agent.py
│   ├── config.py
│   ├── heartbeat.py
│   ├── ipfs_client.py
│   ├── utils.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
├── docs/
├── README.md
└── .gitignore
```

---

## Requirements

Before running the project, install:

- Python 3.11+
- Git
- IPFS Kubo
- VS Code or any code editor

Check Python:

```powershell
python --version
```

Check Git:

```powershell
git --version
```

Check IPFS:

```powershell
ipfs version
```

---

## Setup Instructions

### 1. Clone the Repository

```powershell
git clone https://github.com/YOUR_USERNAME/decentralized-storage.git
cd decentralized-storage
```

---

## Backend Setup

### 2. Create Backend Virtual Environment

```powershell
cd backend

python -m venv venv

.\venv\Scripts\activate
```

---

### 3. Install Backend Dependencies

```powershell
pip install -r requirements.txt
```

---

### 4. Run Database Migrations

```powershell
python manage.py migrate
```

---

### 5. Start Django Backend

```powershell
python manage.py runserver
```

Backend will run at:

```text
http://127.0.0.1:8000/
```

---

## IPFS Setup

### 6. Initialize IPFS

Run this only once:

```powershell
ipfs init
```

If IPFS is already initialized, skip this step.

---

### 7. Start IPFS Daemon

Open a new terminal and run:

```powershell
ipfs daemon
```

You should see:

```text
Daemon is ready
```

IPFS services:

```text
IPFS API:     http://127.0.0.1:5001
IPFS Web UI:  http://127.0.0.1:5001/webui
IPFS Gateway: http://127.0.0.1:8080
```

Keep this terminal running.

---

## Node Agent Setup

The Node Agent runs on the provider machine. It sends heartbeat, storage information, and IPFS status to Django.

### 8. Setup Node Agent Virtual Environment

Open a new terminal:

```powershell
cd node_agent

python -m venv venv

.\venv\Scripts\activate
```

---

### 9. Install Node Agent Dependencies

```powershell
pip install -r requirements.txt
```

---

### 10. Create Node Agent `.env`

Inside `node_agent/`, create a file named:

```text
.env
```

Add:

```env
BACKEND_URL=http://127.0.0.1:8000
NODE_UUID=PASTE_PROVIDER_NODE_UUID_HERE
HEARTBEAT_INTERVAL=5
```

Important:

- `NODE_UUID` is generated after registering a storage node from the Provider Dashboard.
- Copy the UUID from the Provider Dashboard and paste it into `.env`.
- Restart the Node Agent after changing `.env`.

Example:

```env
BACKEND_URL=http://127.0.0.1:8000
NODE_UUID=ca4bf2bd-5c24-46be-af1b-5ac132f9a83b
HEARTBEAT_INTERVAL=5
```

---

### 11. Start Node Agent

```powershell
python agent.py
```

Expected output:

```text
Decentralized Storage Node Agent
Heartbeat every 5 seconds
IPFS Running : True
Peer ID      : 12D3Koo...
IPFS Version : 0.42.0
Status Code : 200
```

---

## How to Use the Application

### Consumer Flow

1. Register a new user.
2. Login.
3. Open Consumer Dashboard.
4. Upload a file.
5. Django sends the file to IPFS.
6. IPFS returns a CID.
7. Django stores the CID.
8. User can view or download the file.

Consumer Dashboard:

```text
http://127.0.0.1:8000/consumer/dashboard/
```

---

### Provider Flow

1. Register or login as a user.
2. Open Consumer Dashboard.
3. Click **Become Provider**.
4. Register a storage node.
5. Copy the generated Node UUID.
6. Paste it into `node_agent/.env`.
7. Start IPFS daemon.
8. Start Node Agent.
9. Open Provider Dashboard.

Provider Dashboard:

```text
http://127.0.0.1:8000/provider/dashboard/
```

---

## Running the Full System

To run the complete project, open 3 terminals.

### Terminal 1: IPFS

```powershell
ipfs daemon
```

### Terminal 2: Django Backend

```powershell
cd backend
.\venv\Scripts\activate
python manage.py runserver
```

### Terminal 3: Node Agent

```powershell
cd node_agent
.\venv\Scripts\activate
python agent.py
```

---

## Important URLs

```text
Home:
http://127.0.0.1:8000/

Consumer Dashboard:
http://127.0.0.1:8000/consumer/dashboard/

Provider Dashboard:
http://127.0.0.1:8000/provider/dashboard/

IPFS Web UI:
http://127.0.0.1:5001/webui

IPFS Gateway:
http://127.0.0.1:8080/ipfs/<CID>
```

---

## Current Internal API Endpoints

These endpoints are currently used internally.

### Node Agent Heartbeat

```http
POST /api/heartbeat/
```

Used by the Node Agent to send:

```text
node_uuid
available_storage
total_storage
operating_system
agent_version
ipfs_status
ipfs_peer_id
ipfs_version
```

---

### File Download

```http
GET /files/<file_id>/download/
```

Downloads a file from IPFS through Django.

---

## REST API Plan

REST API support will be added for frontend development.

Planned endpoints:

```http
GET     /api/files/
POST    /api/files/upload/
GET     /api/files/<id>/
DELETE  /api/files/<id>/

GET     /api/provider/node/
POST    /api/provider/register-node/
POST    /api/become-provider/

GET     /api/network/nodes/
```

The project will support both:

```text
1. Server-side rendered Django HTML pages
2. REST API endpoints for frontend/mobile clients
```

---

## Git Milestones

```text
v0.1.0  Project foundation
v0.2.0  Authentication system
v0.3.0  Provider node registration
v0.4.0  Node Agent heartbeat and monitoring
v0.5.0  IPFS node status monitoring
v0.6.0  IPFS file upload and download
```

---

## Development Notes

### Do Not Commit

The following should not be committed:

```text
.env
venv/
__pycache__/
db.sqlite3
media/
ipfs_test.txt
```

---

## Current Manual Step

Currently, the provider must manually copy the `NODE_UUID` from the Provider Dashboard into:

```text
node_agent/.env
```

This is temporary for development.

Future improvement:

```text
Download Agent Config
or
Pairing Code Based Agent Setup
```

---

## Future Work

- REST API for frontend developers
- Delete file record
- IPFS pin/unpin support
- Provider selection algorithm
- Multi-provider replication
- Node reputation system
- Automatic Node Agent configuration
- Background offline node checker
- Mobile/web frontend
- Production deployment
