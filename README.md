# Decentralized Storage System

A decentralized storage platform built with **Django, IPFS/Kubo, and a provider-side Node Agent**.

The system separates the **control plane** from the **storage layer**. Django manages users, file metadata, provider nodes, scheduling, and APIs, while each provider computer runs a Node Agent that communicates with its local IPFS/Kubo instance.

The current implementation is designed for **PC-to-PC storage over a local network (LAN)** and can later be extended to multiple provider nodes and production deployment.

---

## Architecture

```text
                         DECENTRALIZED STORAGE SYSTEM

        Consumer / Client PC
                |
                v
        +-------------------+
        | Django Backend    |
        | Control Plane     |
        | Port 8000         |
        +---------+---------+
                  |
                  | HTTP
                  v
        +-------------------+
        | Provider Node     |
        | Node Agent        |
        | Port 9001         |
        +---------+---------+
                  |
                  | Local HTTP API
                  v
        +-------------------+
        | Kubo / IPFS       |
        | API Port 5001     |
        | Gateway Port 8080 |
        +-------------------+
```

### Main responsibilities

| Component | Responsibility |
|---|---|
| Django | Authentication, dashboards, metadata, provider selection, REST API, node monitoring |
| Node Agent | Provider-side bridge between Django and local IPFS, heartbeat, system information |
| Kubo / IPFS | Stores file content and returns CIDs |
| SQLite | Development database for users, files, and provider-node metadata |

---

## Current Features

### Authentication and users

- User registration and login
- Logout
- Automatic `UserProfile` creation
- Consumer and provider roles
- Role-based dashboard routing
- Token authentication for REST APIs

### Consumer features

- Consumer dashboard
- Upload files
- View file metadata
- Download files
- Delete file records
- Storage usage tracking
- File ownership protection

### Provider features

- Become a storage provider
- Provider dashboard
- Register a storage node
- Configure allocated storage
- Track storage usage
- View node operating-system information
- View total and available disk space
- View IPFS status
- View IPFS peer ID
- View IPFS version
- View Node Agent URL
- Live heartbeat/online status

### Intelligent provider selection

Django automatically selects an eligible provider node for an uploaded file.

A provider must:

- Have a recent heartbeat
- Have IPFS available
- Have a registered Node Agent URL
- Have enough allocated storage remaining
- Have enough physical available storage

The current provider score considers:

```text
40%  available physical storage
35%  remaining allocated storage
15%  provider reputation
-10% current storage load
```

The highest-scoring eligible provider is selected.

### Node Agent

The Node Agent currently provides:

- Background heartbeat service
- Automatic LAN IP detection
- Local IPFS health checks
- IPFS peer ID detection
- IPFS version detection
- Provider-side file upload endpoint
- Provider-side file download endpoint
- Local system and storage information

### Automatic Node Identity

The Node Agent no longer needs a manually entered UUID.

On first startup it generates a UUID and stores it locally in:

```text
node_agent/node_identity.json
```

Example:

```json
{
    "node_uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

On future restarts, the same UUID is reused.

The provider node is paired with Django using a **Node Token**. The token is stored in the provider's `.env`, while the machine UUID is managed automatically by the Node Agent.

This produces the following identity flow:

```text
First startup
    |
    +--> Generate UUID
    |
    +--> Save node_identity.json
    |
    +--> Send UUID + Node Token + Agent URL
    |
    +--> Django identifies the registered StorageNode

Future startup
    |
    +--> Read existing UUID
    |
    +--> Reuse same UUID
    |
    +--> Continue heartbeat
```

---

## File Upload Flow

The current upload architecture is provider-node based.

```text
Consumer
   |
   v
Django Backend
   |
   | select_best_provider_node()
   v
Selected Provider Node Agent
   |
   v
Provider's local Kubo / IPFS
   |
   v
CID returned
   |
   v
Django stores file metadata + CID + provider node
```

Django does **not** need direct access to the provider's local IPFS API. The Node Agent acts as the provider-side bridge.

---

## File Download Flow

```text
Consumer
   |
   v
Django
   |
   v
Provider Node Agent
   |
   v
Provider Kubo / IPFS
   |
   v
File content
   |
   v
Django
   |
   v
Consumer
```

This allows the provider's IPFS daemon to remain local to the provider computer.

---

## Project Structure

```text
DecentralizedStorage/
├── backend/
│   ├── manage.py
│   ├── config/
│   ├── storage/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── api_views.py
│   │   ├── serializers.py
│   │   ├── forms.py
│   │   ├── provider_selection.py
│   │   ├── provider_agent_client.py
│   │   ├── ipfs_client.py
│   │   ├── urls.py
│   │   ├── api_urls.py
│   │   └── migrations/
│   ├── templates/
│   ├── static/
│   ├── media/
│   └── requirements.txt
│
├── node_agent/
│   ├── agent.py
│   ├── config.py
│   ├── heartbeat.py
│   ├── ipfs_client.py
│   ├── upload_server.py
│   ├── utils.py
│   ├── requirements.txt
│   ├── .env
│   └── node_identity.json
│
├── frontend/
├── docs/
├── README.md
└── .gitignore
```

---

## Requirements

For the current PC-to-PC implementation:

- Windows 10/11 or another supported desktop OS
- Python 3.11+
- Git
- Django 5.2.x
- IPFS Kubo
- Internet/network connectivity for LAN testing
- VS Code or another code editor

Check installations:

```powershell
python --version
git --version
ipfs version
```

---

# Backend Setup

## 1. Clone the repository

```powershell
git clone https://github.com/YOUR_USERNAME/decentralized-storage.git
cd decentralized-storage
```

## 2. Create the backend virtual environment

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
```

## 3. Install dependencies

```powershell
pip install -r requirements.txt
```

## 4. Create/update database tables

```powershell
python manage.py makemigrations
python manage.py migrate
```

## 5. Check the Django project

```powershell
python manage.py check
```

Expected:

```text
System check identified no issues (0 silenced).
```

## 6. Start Django

For local testing:

```powershell
python manage.py runserver
```

For PC-to-PC LAN testing:

```powershell
python manage.py runserver 0.0.0.0:8000
```

Find the backend PC's LAN IP with:

```powershell
ipconfig
```

Example:

```text
192.168.0.102
```

The provider laptop will then use:

```text
http://192.168.0.102:8000
```

---

# IPFS / Kubo Setup

## 1. Initialize IPFS

Run once per provider machine:

```powershell
ipfs init
```

If the node has already been initialized, skip this step.

## 2. Start the IPFS daemon

Open another terminal:

```powershell
ipfs daemon
```

Wait for:

```text
Daemon is ready
```

Default services:

```text
IPFS API:      http://127.0.0.1:5001
IPFS Web UI:   http://127.0.0.1:5001/webui
IPFS Gateway:  http://127.0.0.1:8080
```

Keep the daemon running while the Node Agent is running.

---

# Provider Node Agent Setup

The Node Agent runs on the **provider computer**.

## 1. Create the Node Agent virtual environment

```powershell
cd node_agent
python -m venv venv
.\venv\Scripts\activate
```

## 2. Install dependencies

```powershell
pip install -r requirements.txt
```

## 3. Register a storage node in Django

Using the Provider Dashboard or REST API:

```text
Become Provider
        ↓
Register Storage Node
        ↓
Set display name
        ↓
Set allocated storage
```

Django creates the storage node and generates its unique **Node Token**.

The Node UUID is managed automatically by the Node Agent and does not need to be copied into `.env`.

---

## 4. Create the Node Agent `.env`

Create:

```text
node_agent/.env
```

For testing on the same computer as Django:

```env
BACKEND_URL=http://127.0.0.1:8000
NODE_TOKEN=PASTE_NODE_TOKEN_HERE
HEARTBEAT_INTERVAL=30
AGENT_HOST=0.0.0.0
AGENT_PORT=9001
```

For the final PC-to-PC test, replace `127.0.0.1` with the **Django laptop's LAN IP**:

```env
BACKEND_URL=http://192.168.0.102:8000
NODE_TOKEN=PASTE_NODE_TOKEN_HERE
HEARTBEAT_INTERVAL=30
AGENT_HOST=0.0.0.0
AGENT_PORT=9001
```

### Important

Do **not** add:

```env
NODE_UUID=...
```

The Node Agent generates and persists the UUID automatically.

---

## 5. Start the Node Agent

```powershell
python agent.py
```

Typical output includes:

```text
==================================================
Decentralized Storage Node Agent
==================================================
Heartbeat every 30 seconds
Agent API URL : http://192.168.0.xxx:9001
IPFS Running  : True
Peer ID       : 12D3Koo...
IPFS Version  : 0.42.0
```

Heartbeat output should also show:

```text
Sending heartbeat
Node UUID     : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Agent URL     : http://192.168.0.xxx:9001
Backend       : http://192.168.0.102:8000
Status Code   : 200
```

---

# PC-to-PC Setup

The intended distributed test uses two computers on the same LAN.

### Laptop 1 — Consumer / Backend

Runs:

```text
Django
Port 8000
```

Example:

```text
192.168.0.102
```

Start with:

```powershell
python manage.py runserver 0.0.0.0:8000
```

### Laptop 2 — Provider

Runs:

```text
Kubo / IPFS
Node Agent
Port 9001
```

The Node Agent automatically detects the provider laptop's LAN IP and reports its URL to Django.

Example:

```text
http://192.168.0.103:9001
```

The provider `.env` should point to Laptop 1:

```env
BACKEND_URL=http://192.168.0.102:8000
```

---

# Recommended PC-to-PC Testing Order

## 1. Verify Django

On Laptop 1:

```powershell
python manage.py check
```

## 2. Verify network connectivity

From Laptop 1:

```powershell
Test-NetConnection 192.168.0.103 -Port 9001
```

Expected:

```text
TcpTestSucceeded : True
```

## 3. Verify Node Agent

Open from Laptop 1:

```text
http://192.168.0.103:9001/health/
```

## 4. Verify heartbeat

Check the provider dashboard and confirm:

- Node is online
- IPFS is connected
- Agent URL is present
- IPFS peer ID is present
- IPFS version is present
- Storage values are updated

## 5. Verify provider upload

Upload a small test file through the Node Agent or Django application.

## 6. Verify CID on the provider computer

```powershell
ipfs pin ls
ipfs cat <CID>
```

## 7. Verify application download

Download the same file through Django and confirm the content matches.

---

# Node Agent API

The provider Node Agent currently exposes these endpoints.

## Health

```http
GET /health/
```

Returns Node Agent and IPFS status.

## Upload

```http
POST /upload/
```

Form-data:

```text
file=<file>
```

The Node Agent uploads the file to its local Kubo instance and returns the CID.

## Download

```http
GET /download/?cid=<CID>
```

The Node Agent retrieves the file from local IPFS.

---

# Django REST API

Base path:

```text
/api/
```

## Authentication

```http
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/logout/
GET  /api/auth/me/
```

## Files

```http
GET    /api/files/
POST   /api/files/upload/
GET    /api/files/<id>/
DELETE /api/files/<id>/delete/
```

## Provider

```http
POST /api/become-provider/
GET  /api/provider/node/
POST /api/provider/node/register/
```

## Network

```http
GET /api/network/stats/
```

## Admin

```http
GET /api/admin/stats/
```

---

# Important Application URLs

Local development:

```text
Home:
http://127.0.0.1:8000/

Consumer Dashboard:
http://127.0.0.1:8000/consumer/dashboard/

Provider Dashboard:
http://127.0.0.1:8000/provider/dashboard/

Register Storage Node:
http://127.0.0.1:8000/provider/register-node/

IPFS Web UI:
http://127.0.0.1:5001/webui

IPFS Gateway:
http://127.0.0.1:8080/ipfs/<CID>
```

During PC-to-PC testing, use the Django laptop's LAN IP instead of `127.0.0.1` for URLs accessed from the provider laptop.

---

# Node Identity and Pairing

Each provider computer has two important identifiers:

### Node UUID

Generated automatically by the Node Agent:

```text
node_agent/node_identity.json
```

It remains stable across Node Agent restarts on the same installation.

### Node Token

Generated by Django when the storage node is registered.

The token is used to pair the Node Agent with the correct Django `StorageNode`.

### Identity flow

```text
Provider registers node
          |
          v
Django generates Node Token
          |
          v
Provider places token in .env
          |
          v
Node Agent starts
          |
          v
Node Agent generates/loads UUID
          |
          v
Heartbeat sends UUID + Token + Agent URL
          |
          v
Django updates the registered StorageNode
```

---

# Database Models

The main models are:

### `UserProfile`

Stores:

- role
- consumer storage usage
- provider storage contribution
- reputation
- provider verification state

### `StorageNode`

Stores:

- owner
- display name
- node UUID
- node token
- allocated storage
- storage used
- total/available storage
- heartbeat timestamp
- online status
- operating system
- Node Agent version
- Agent API URL
- IPFS status
- IPFS peer ID
- IPFS version
- node status

### `UploadedFile`

Stores file metadata such as:

- owner
- provider node
- original filename
- CID
- file size
- content type
- upload timestamp

---

# Security Notes

The current project is a development/MVP implementation.

Do not commit:

```text
.env
venv/
__pycache__/
*.pyc
node_identity.json
db.sqlite3
media/
```

The Node Token should be treated as a private credential.

For production deployment, the following should be added before exposing provider nodes to the public internet:

- HTTPS/TLS
- secure secret management
- authenticated Node Agent requests
- token rotation/revocation
- PostgreSQL or another production database
- stronger API validation and rate limiting
- background job processing
- proper public/reachable provider networking

---

# Current Limitations

The current version is focused on the **core provider-node storage workflow**.

Not yet implemented as part of the current core version:

- Application-level file chunking
- Multi-node file replication
- AES-256-GCM client-side encryption
- Automated failed-node recovery and re-replication
- Full production deployment to Render with publicly reachable provider nodes
- Complete Flutter client integration
- Background worker for automatic offline-node cleanup

These are planned extensions rather than requirements for the current basic PC-to-PC implementation.

---

# Development Workflow

Recommended development cycle:

```text
Implement feature
      ↓
Test on one computer
      ↓
Fix errors
      ↓
Test Node Agent + Kubo locally
      ↓
Test Django integration
      ↓
Test PC-to-PC LAN communication
      ↓
Commit working version
```

For Git development:

```powershell
git status
git add .
git commit -m "Update decentralized storage system"
git push origin <your-branch>
```

On another computer:

```powershell
git fetch origin
git checkout <your-branch>
git pull origin <your-branch>
```

---

# Project Status

### Current status: Core PC-to-PC storage workflow implemented

Working areas include:

- Django backend
- User authentication
- Consumer/provider roles
- Provider registration
- Storage node management
- Node heartbeat
- Automatic Node Agent LAN IP detection
- Automatic persistent Node UUID generation
- Node Token based pairing
- Provider selection
- Node Agent upload/download bridge
- Kubo/IPFS integration
- CID-based file metadata
- Consumer file operations
- Provider storage accounting
- REST API support
- Network statistics

The next development stages are focused on stronger security, deletion/IPFS lifecycle management, replication, chunking, encryption, recovery, frontend integration, testing, and production deployment.

---

## License

Add your project license here before public release.
