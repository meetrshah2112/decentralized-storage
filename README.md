# Shardize — Decentralized Storage System

> A secure, provider-driven decentralized storage platform built with **Django, Django REST Framework, React, IPFS/Kubo, and a provider-side Node Agent**.

Shardize is a Final Year Information Technology project that explores how unused storage capacity on computers can be contributed to a distributed storage network.

Instead of keeping uploaded files only on a centralized application server, the system separates **control-plane responsibilities** from **file-storage responsibilities**:

- **Django** manages users, roles, metadata, provider nodes, scheduling, authentication, and APIs.
- **React** provides the modern client interface.
- **Node Agent** runs on provider computers and acts as the bridge between Django and the provider's local IPFS node.
- **Kubo/IPFS** stores the actual file content and identifies it using CIDs.
- **AES-256-GCM** encrypts files before they are sent to provider storage.

The current implementation is primarily designed and tested for **PC-to-PC communication over a local network (LAN)**. Multi-node chunking and replication are planned next.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [How the System Works](#how-the-system-works)
- [Security and Encryption](#security-and-encryption)
- [Provider Selection](#provider-selection)
- [Node Identity and Heartbeat](#node-identity-and-heartbeat)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Clone the Repository](#1-clone-the-repository)
  - [Backend Setup](#2-backend-setup)
  - [IPFS/Kubo Setup](#3-ipfskubo-setup)
  - [Node Agent Setup](#4-node-agent-setup)
  - [React Frontend Setup](#5-react-frontend-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Project](#running-the-project)
- [PC-to-PC LAN Setup](#pc-to-pc-lan-setup)
- [Application URLs](#application-urls)
- [REST API](#rest-api)
- [Node Agent API](#node-agent-api)
- [Database Models](#database-models)
- [Testing](#testing)
- [Git Workflow](#git-workflow)
- [Current Implementation Status](#current-implementation-status)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Academic Project Scope](#academic-project-scope)

---

# Project Overview

Shardize is designed around a simple idea:

> **Allow computers with unused disk space to contribute that storage to a distributed network.**

A user can act as a **Consumer** and upload files to the network. Another user can act as a **Provider** by contributing storage from their computer.

The provider computer runs a Node Agent. The Node Agent communicates with its local Kubo/IPFS daemon and exposes a controlled HTTP interface to the Django backend.

### High-level flow

```text
                 SHARDIZE DECENTRALIZED STORAGE

                         Consumer
                            |
                            v
                  +-------------------+
                  | React Frontend    |
                  +---------+---------+
                            |
                            | REST API
                            v
                  +-------------------+
                  | Django Backend    |
                  | Control Plane     |
                  +---------+---------+
                            |
                            | Select provider
                            v
                  +-------------------+
                  | Provider Node     |
                  | Node Agent        |
                  +---------+---------+
                            |
                            | Local IPFS API
                            v
                  +-------------------+
                  | Kubo / IPFS       |
                  | Content Storage   |
                  +-------------------+
```

---

# Problem Statement

Traditional cloud storage generally depends on centralized infrastructure.

This project investigates an alternative model in which:

1. Individuals can contribute unused storage.
2. Storage is provided by multiple independent computers.
3. A control plane manages users and storage metadata.
4. IPFS provides content-addressed storage.
5. Files are encrypted before being stored on provider infrastructure.
6. Provider health and available capacity are continuously monitored.

The project therefore combines concepts from:

- Distributed systems
- Peer-to-peer storage
- Content-addressable storage
- Cryptography
- REST APIs
- Network communication
- Resource scheduling

---

# Objectives

The main objectives are:

- Build a decentralized storage prototype using IPFS.
- Allow users to register as storage consumers or providers.
- Allow providers to contribute disk capacity.
- Monitor provider node health.
- Automatically select a suitable provider for an uploaded file.
- Encrypt files before provider storage.
- Store encrypted file content in IPFS.
- Retrieve and decrypt files through the application.
- Provide both web and REST API interfaces.
- Build a foundation for future chunking, replication, and fault tolerance.

---

# Key Features

## Authentication

- User registration
- User login
- User logout
- Token-based REST API authentication
- User profile management
- Consumer/provider roles

## Consumer

- Upload files
- View files
- Download files
- Delete files
- View file metadata
- Track storage usage

## Provider

- Become a storage provider
- Register a storage node
- Specify allocated storage
- Monitor storage usage
- Monitor available storage
- View operating system information
- View IPFS status
- View IPFS Peer ID
- View IPFS version
- View Node Agent URL
- Monitor heartbeat/online status

## Distributed Storage

- Provider-side storage
- IPFS/Kubo integration
- CID-based file identification
- Provider selection based on capacity and node health
- PC-to-PC LAN storage

## Security

- AES-256-GCM file encryption
- Unique encryption key per file
- Protected file encryption keys
- Authenticated encryption/integrity checking
- Encrypted content stored in IPFS

## REST API

- Authentication APIs
- File APIs
- Provider APIs
- Network statistics
- Admin statistics
- Authenticated binary download/view endpoints

## Frontend

The current React client provides:

- Landing page
- Registration
- Login
- Consumer dashboard
- Provider dashboard
- File upload
- File view/download
- File deletion
- Provider registration
- Network information

The frontend is currently branded **Shardize**.

---

# Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 |
| Frontend Build Tool | Vite |
| UI | Mantine + custom CSS |
| Backend | Django 5.2 |
| API | Django REST Framework |
| Authentication | Django Token Authentication |
| Database | SQLite (development) |
| Storage Protocol | IPFS |
| IPFS Implementation | Kubo |
| Provider Bridge | Python Node Agent |
| Encryption | AES-256-GCM |
| Cryptography Library | Python `cryptography` |
| System Monitoring | `psutil` |
| HTTP Communication | Python `requests` |
| Frontend HTTP | Browser Fetch API |
| Configuration | `.env` / Vite environment variables |

---

# System Architecture

Shardize separates the system into three major layers.

## 1. Control Plane — Django

Django is responsible for:

- Authentication
- User roles
- Provider registration
- Storage-node metadata
- File metadata
- Provider selection
- REST API
- Heartbeat processing
- Storage accounting
- Frontend/web views

Django does **not** need to run the provider's local IPFS daemon.

---

## 2. Provider Plane — Node Agent

Every provider computer can run a Node Agent.

The Node Agent:

- Communicates with Django
- Sends periodic heartbeats
- Detects the provider's LAN IP
- Collects system information
- Checks local IPFS
- Uploads files to local IPFS
- Downloads files from local IPFS

It acts as a controlled bridge:

```text
Django
  |
  | HTTP
  v
Node Agent
  |
  | HTTP
  v
Local Kubo API
```

---

## 3. Storage Layer — IPFS/Kubo

Kubo is the IPFS implementation running on provider computers.

IPFS:

- Stores file content
- Generates a CID
- Provides content-addressed retrieval
- Can pin content
- Allows files to be retrieved through the IPFS API/gateway

The application stores the CID as file metadata.

---

# How the System Works

## User Registration

```text
User
 ↓
React / Django Web
 ↓
Django
 ↓
User + UserProfile
 ↓
Consumer dashboard
```

A user initially has a consumer role.

A user can later become a provider.

---

## Provider Registration

```text
User
 ↓
Become Provider
 ↓
Register Storage Node
 ↓
Django creates StorageNode
 ↓
Node UUID + Node Token generated
 ↓
Provider Node Agent starts
 ↓
Heartbeat sent to Django
 ↓
Node becomes available
```

---

# File Upload Flow

The current encrypted upload flow is:

```text
User selects file
       |
       v
React / Django
       |
       v
Django receives original file
       |
       v
AES-256-GCM encryption
       |
       v
Encrypted file
       |
       v
Provider Selection
       |
       v
Selected Node Agent
       |
       v
Provider's Kubo/IPFS
       |
       v
CID
       |
       v
Django stores metadata
```

The important security property is:

> **The provider's IPFS stores encrypted file content rather than the original plaintext content.**

---

# File Download Flow

```text
User requests file
       |
       v
Django
       |
       v
Selected provider Node Agent
       |
       v
Provider's IPFS
       |
       v
Encrypted file content
       |
       v
Django
       |
       v
AES-256-GCM decryption
       |
       v
Original file
       |
       v
User
```

Both the web interface and REST API now support decrypted retrieval.

---

# File View Flow

```text
IPFS
 ↓
Encrypted content
 ↓
Node Agent
 ↓
Django
 ↓
Decrypt
 ↓
HTTP inline response
 ↓
Browser / frontend
```

For compatible file types such as images, PDFs, and text, the browser can display the decrypted content.

---

# Security and Encryption

Shardize currently uses **AES-256-GCM**.

## Encryption Process

For every uploaded file:

```text
Original File
     |
     | AES-256-GCM
     v
Encrypted File
```

A new random 256-bit file key is generated for every file.

A random nonce is also generated.

Conceptually:

```text
File A → Key A → Nonce A
File B → Key B → Nonce B
File C → Key C → Nonce C
```

This avoids using one file key for every stored file.

---

## Protected File Key

The raw file encryption key is not stored directly in the database.

Instead:

```text
Random File Key
      |
      v
Protected using Master Key
      |
      v
Encrypted Key + Key Nonce
      |
      v
Database
```

The current development implementation derives the master key from Django's `SECRET_KEY`.

### Important production note

For production, a dedicated stable encryption master secret should be used instead of deriving the encryption key from `SECRET_KEY`.

Changing the master key would make previously protected file keys impossible to recover.

---

## Encryption Proof

The project has been tested by retrieving the CID directly from the provider's IPFS node:

```powershell
ipfs cat <CID>
```

The result is binary/random-looking data rather than the original readable plaintext.

This demonstrates:

```text
Original File
      ↓
Encryption
      ↓
Encrypted Content
      ↓
IPFS
```

The web download and view paths have also been tested successfully:

```text
IPFS encrypted data
      ↓
Django
      ↓
Decrypt
      ↓
Original content
```

---

# Provider Selection

When a consumer uploads a file, Django calls:

```python
select_best_provider_node(file_size)
```

The provider selection system checks:

- Recent heartbeat
- IPFS status
- Agent API URL
- Allocated storage remaining
- Physical available storage

A node is rejected if it cannot safely accommodate the file.

---

## Provider Scoring

The current scoring model considers:

```text
40%  Available physical storage
35%  Remaining allocated storage
15%  Provider reputation
-10% Current storage load
```

Conceptually:

```text
Provider Score
     |
     +--> Available storage
     |
     +--> Allocated capacity remaining
     |
     +--> Reputation
     |
     +--> Current load
```

The highest-scoring eligible provider is selected.

This is an initial scheduling strategy and can be improved as the distributed system grows.

---

# Node Identity and Heartbeat

Every provider node has a persistent UUID.

The Node Agent stores it in:

```text
node_agent/node_identity.json
```

On first startup:

```text
No identity file
      ↓
Generate UUID
      ↓
Save UUID
```

On later startups:

```text
identity file exists
      ↓
Load existing UUID
      ↓
Reuse UUID
```

This prevents the same computer from receiving a different identity every time the Node Agent restarts.

---

## Heartbeat

The Node Agent periodically sends information to:

```text
POST /api/heartbeat/
```

The heartbeat can contain:

- Node UUID
- Node token
- Node Agent URL
- Available storage
- Total storage
- Operating system
- Agent version
- IPFS status
- IPFS Peer ID
- IPFS version

Django uses the heartbeat timestamp to determine whether a node is active.

---

# Project Structure

```text
decentralized-storage/
│
├── backend/
│   │
│   ├── manage.py
│   ├── requirements.txt
│   ├── db.sqlite3
│   │
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── storage/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── api_views.py
│   │   ├── api_urls.py
│   │   ├── urls.py
│   │   ├── serializers.py
│   │   ├── forms.py
│   │   ├── encryption.py
│   │   ├── ipfs_client.py
│   │   ├── provider_agent_client.py
│   │   ├── provider_selection.py
│   │   ├── signals.py
│   │   ├── tests.py
│   │   └── migrations/
│   │
│   ├── templates/
│   │   ├── base.html
│   │   ├── home.html
│   │   ├── registration/
│   │   └── storage/
│   │
│   └── static/
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
│   └── shardize-landing-main/
│       ├── package.json
│       ├── package-lock.json
│       ├── vite.config.js
│       ├── index.html
│       └── src/
│           ├── App.jsx
│           ├── main.jsx
│           ├── components/
│           ├── context/
│           ├── constants/
│           ├── lib/
│           ├── pages/
│           └── styles/
│
├── docs/
│   ├── Architecture.md
│   ├── CHANGELOG.md
│   ├── Roadmap.md
│   ├── Setup.md
│   └── encryption-test.txt
│
├── .gitignore
└── README.md
```

---

# Prerequisites

Install the following before starting:

- Windows 10/11 for the current PC-to-PC development environment
- Python 3.11+
- Git
- Node.js and npm
- IPFS Kubo
- A modern browser
- Two computers for LAN testing
- Both computers connected to the same local network for PC-to-PC testing

Verify:

```powershell
python --version
git --version
node --version
npm --version
ipfs version
```

---

# Installation

## 1. Clone the Repository

```powershell
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd decentralized-storage
```

If you are already working from the project directory, simply open the project in VS Code.

---

# 2. Backend Setup

Go to the backend:

```powershell
cd backend
```

Create a virtual environment:

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Run migrations:

```powershell
python manage.py migrate
```

Create an administrator:

```powershell
python manage.py createsuperuser
```

Check the project:

```powershell
python manage.py check
```

Start Django:

```powershell
python manage.py runserver 0.0.0.0:8000
```

---

# 3. IPFS/Kubo Setup

Install Kubo on every provider computer.

Verify:

```powershell
ipfs version
```

Initialize IPFS if it has not already been initialized:

```powershell
ipfs init
```

Start the daemon:

```powershell
ipfs daemon
```

The default Kubo endpoints are:

```text
IPFS API:
http://127.0.0.1:5001

IPFS Gateway:
http://127.0.0.1:8080
```

Test:

```powershell
ipfs id
```

You should receive information about the local IPFS peer.

Test a small file:

```powershell
"Hello IPFS" | Out-File -FilePath hello.txt -Encoding utf8
ipfs add hello.txt
```

Then:

```powershell
ipfs cat <CID>
```

---

# 4. Node Agent Setup

Open another PowerShell window on the provider computer.

```powershell
cd node_agent
```

Create a virtual environment:

```powershell
python -m venv venv
```

Activate:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Create a `.env` file.

Example:

```env
BACKEND_URL=http://192.168.0.102:8000
NODE_TOKEN=YOUR_NODE_TOKEN
HEARTBEAT_INTERVAL=30
AGENT_HOST=0.0.0.0
AGENT_PORT=9001
```

Replace:

```text
192.168.0.102
```

with the LAN IP address of the Django/backend computer.

Replace:

```text
YOUR_NODE_TOKEN
```

with the token belonging to the provider's registered `StorageNode`.

Start the Node Agent:

```powershell
python agent.py
```

The Node Agent automatically detects its local LAN IP and reports its Agent URL to Django.

---

# 5. React Frontend Setup

Open another PowerShell window.

```powershell
cd frontend\shardize-landing-main
```

Install packages:

```powershell
npm install
```

Create:

```text
.env
```

Example:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

For a frontend running from another computer on the LAN:

```env
VITE_API_URL=http://192.168.0.102:8000/api
```

Start Vite:

```powershell
npm run dev
```

Build for production testing:

```powershell
npm run build
```

Run lint:

```powershell
npm run lint
```

---

# Environment Configuration

## Django

Development configuration is located in:

```text
backend/config/settings.py
```

Important settings include:

```text
ALLOWED_HOSTS
CSRF_TRUSTED_ORIGINS
CORS
REST_FRAMEWORK
DATABASES
STATIC
MEDIA
```

For production, these values should be tightened.

---

## Node Agent

The Node Agent uses:

```text
node_agent/.env
```

Example:

```env
BACKEND_URL=http://192.168.0.102:8000
NODE_TOKEN=YOUR_NODE_TOKEN
HEARTBEAT_INTERVAL=30
AGENT_HOST=0.0.0.0
AGENT_PORT=9001
```

Do not commit `.env`.

---

## React

The frontend uses:

```text
frontend/shardize-landing-main/.env
```

Example:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

For LAN testing:

```env
VITE_API_URL=http://<DJANGO-LAN-IP>:8000/api
```

---

# Running the Project

For a two-computer LAN test:

## Laptop 1 — Django + Consumer

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver 0.0.0.0:8000
```

Example IP:

```text
192.168.0.102
```

The React frontend can also run here.

---

## Laptop 2 — Provider

Start Kubo:

```powershell
ipfs daemon
```

In another PowerShell:

```powershell
cd node_agent
.\venv\Scripts\Activate.ps1
python agent.py
```

Example provider IP:

```text
192.168.0.103
```

The Node Agent may therefore advertise:

```text
http://192.168.0.103:9001
```

---

# PC-to-PC LAN Setup

Both computers must be connected to the same network.

Example:

```text
Laptop 1
Django
192.168.0.102
Port 8000

        |
        | LAN
        |
        v

Laptop 2
Node Agent
192.168.0.103
Port 9001

        |
        v

Local Kubo
127.0.0.1:5001
```

Test the provider Agent from the Django computer:

```powershell
Test-NetConnection 192.168.0.103 -Port 9001
```

Expected:

```text
TcpTestSucceeded : True
```

Test the Agent health endpoint:

```text
http://192.168.0.103:9001/health/
```

---

# Application URLs

## Django Web Application

```text
Home:
http://127.0.0.1:8000/

Login:
http://127.0.0.1:8000/accounts/login/

Register:
http://127.0.0.1:8000/register/

Consumer Dashboard:
http://127.0.0.1:8000/consumer/dashboard/

Provider Dashboard:
http://127.0.0.1:8000/provider/dashboard/

Register Storage Node:
http://127.0.0.1:8000/provider/register-node/

Django Admin:
http://127.0.0.1:8000/admin/
```

---

## React Frontend

The Vite development server normally starts on a localhost port shown by Vite in the terminal.

Typical development command:

```powershell
npm run dev
```

---

## IPFS

```text
IPFS API:
http://127.0.0.1:5001

IPFS Gateway:
http://127.0.0.1:8080/ipfs/<CID>
```

---

# REST API

Base URL:

```text
/api/
```

Authentication uses Django REST Framework Token Authentication.

Include:

```http
Authorization: Token YOUR_TOKEN
```

---

## Authentication Endpoints

### Register

```http
POST /api/auth/register/
```

Request:

```json
{
  "username": "meet",
  "email": "meet@example.com",
  "password": "your-password",
  "password2": "your-password"
}
```

---

### Login

```http
POST /api/auth/login/
```

Request:

```json
{
  "username": "meet",
  "password": "your-password"
}
```

The response returns an authentication token.

---

### Logout

```http
POST /api/auth/logout/
```

Authentication required.

---

### Current User

```http
GET /api/auth/me/
```

Authentication required.

---

# File Endpoints

## List Files

```http
GET /api/files/
```

Authentication required.

---

## Upload File

```http
POST /api/files/upload/
```

Authentication required.

Content type:

```text
multipart/form-data
```

Form field:

```text
file
```

The upload pipeline is:

```text
Multipart file
     ↓
AES-256-GCM
     ↓
Provider selection
     ↓
Node Agent
     ↓
IPFS
     ↓
CID
```

---

## File Details

```http
GET /api/files/<id>/
```

Authentication required.

Returns metadata for a file owned by the authenticated user.

---

## Download File

```http
GET /api/files/<id>/download/
```

Authentication required.

The endpoint retrieves encrypted content from the provider and decrypts it before returning the original file.

---

## View File

```http
GET /api/files/<id>/view/
```

Authentication required.

The endpoint decrypts the file and returns it with an inline content disposition.

---

## Delete File

```http
DELETE /api/files/<id>/delete/
```

Authentication required.

The current implementation removes the application's file metadata and updates storage accounting.

IPFS unpinning/lifecycle cleanup is planned for a future version.

---

# Provider Endpoints

## Become Provider

```http
POST /api/become-provider/
```

Authentication required.

---

## Get Provider Node

```http
GET /api/provider/node/
```

Authentication required.

---

## Register Provider Node

```http
POST /api/provider/node/register/
```

Authentication required.

Example:

```json
{
  "display_name": "Meet Laptop",
  "allocated_storage_gb": 20
}
```

---

# Network Endpoints

## Network Statistics

```http
GET /api/network/stats/
```

Authentication required.

Provides information such as:

- Total nodes
- Online nodes
- Offline nodes
- IPFS-connected nodes
- Total files
- Total storage used

---

# Admin Endpoints

## Admin Statistics

```http
GET /api/admin/stats/
```

Requires administrator permissions.

---

# Complete REST API Table

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| POST | `/api/auth/register/` | No | Register user |
| POST | `/api/auth/login/` | No | Login and obtain token |
| POST | `/api/auth/logout/` | Yes | Logout |
| GET | `/api/auth/me/` | Yes | Current user |
| GET | `/api/files/` | Yes | List user's files |
| POST | `/api/files/upload/` | Yes | Encrypt and upload file |
| GET | `/api/files/<id>/` | Yes | File metadata |
| GET | `/api/files/<id>/download/` | Yes | Decrypt and download |
| GET | `/api/files/<id>/view/` | Yes | Decrypt and view |
| DELETE | `/api/files/<id>/delete/` | Yes | Delete file record |
| POST | `/api/become-provider/` | Yes | Become provider |
| GET | `/api/provider/node/` | Yes | Get provider node |
| POST | `/api/provider/node/register/` | Yes | Register node |
| GET | `/api/network/stats/` | Yes | Network statistics |
| GET | `/api/admin/stats/` | Admin | Admin statistics |

---

# Node Agent API

The Node Agent runs on a provider computer.

Default port:

```text
9001
```

## Health

```http
GET /health/
```

Used to verify that the Node Agent and local IPFS connection are available.

---

## Upload

```http
POST /upload/
```

Form:

```text
file=<file>
```

The Node Agent sends the received file to its local Kubo/IPFS API.

Response contains the generated CID.

---

## Download

```http
GET /download/?cid=<CID>
```

Retrieves the requested CID from the provider's local IPFS node.

---

# Database Models

## UserProfile

Extends Django's built-in `User`.

Important fields:

```text
user
role
storage_used
storage_contributed
reputation
is_verified_provider
created_at
updated_at
```

---

## StorageNode

Represents a provider computer.

Important fields:

```text
owner
display_name
node_uuid
node_token
allocated_storage
storage_used
last_heartbeat
is_online
available_storage
total_storage
operating_system
agent_version
ipfs_status
ipfs_peer_id
ipfs_version
agent_api_url
status
created_at
updated_at
```

---

## UploadedFile

Represents a file stored through the application.

Important fields:

```text
owner
provider_node
original_filename
cid
file_size
content_type
encrypted_key
key_nonce
file_nonce
is_encrypted
uploaded_at
```

The database stores the CID and encryption metadata rather than the original file contents.

---

# Testing

## 1. Django Check

```powershell
python manage.py check
```

Expected:

```text
System check identified no issues.
```

---

## 2. IPFS Test

```powershell
ipfs id
```

Then:

```powershell
ipfs add test.txt
```

Then:

```powershell
ipfs cat <CID>
```

---

## 3. Node Agent Test

From another computer:

```powershell
Test-NetConnection <PROVIDER-IP> -Port 9001
```

Expected:

```text
TcpTestSucceeded : True
```

Then open:

```text
http://<PROVIDER-IP>:9001/health/
```

---

## 4. Encryption Test

Upload a test file containing readable text:

```text
THIS FILE SHOULD BE ENCRYPTED BEFORE IPFS
```

After upload, take the CID and run on the provider:

```powershell
ipfs cat <CID>
```

The output should not be the original readable plaintext.

This demonstrates that encrypted content reached IPFS.

---

## 5. Web Decryption Test

Use:

```text
Download
View
```

The returned/displayed content should match the original file.

---

## 6. REST API Test

Authenticate:

```http
POST /api/auth/login/
```

Upload:

```http
POST /api/files/upload/
```

Verify the CID on the provider:

```powershell
ipfs cat <CID>
```

Then retrieve:

```http
GET /api/files/<id>/download/
```

and:

```http
GET /api/files/<id>/view/
```

The API should return the original decrypted content.

---

# Git Workflow

The project is designed to support feature branches.

Check the current branch:

```powershell
git branch
```

Create a feature branch:

```powershell
git checkout -b feature-name
```

Check changes:

```powershell
git status
```

Add:

```powershell
git add .
```

Commit:

```powershell
git commit -m "Add encryption support"
```

Push:

```powershell
git push -u origin feature-name
```

On another computer:

```powershell
git fetch origin
```

View remote branches:

```powershell
git branch -r
```

Switch to the feature branch:

```powershell
git checkout feature-name
```

If the branch is not available locally:

```powershell
git checkout -b feature-name origin/feature-name
```

Pull the latest content:

```powershell
git pull origin feature-name
```

This workflow allows development to continue on a dedicated branch without requiring an immediate merge into `main`.

---

# Current Implementation Status

## Completed

| Component / Feature | Status |
|---|---:|
| Django backend | ✅ |
| SQLite development database | ✅ |
| User registration | ✅ |
| User login/logout | ✅ |
| Consumer role | ✅ |
| Provider role | ✅ |
| Provider registration | ✅ |
| Storage node model | ✅ |
| Node UUID | ✅ |
| Persistent Node Agent identity | ✅ |
| Node Token | ✅ |
| Node Agent | ✅ |
| Heartbeat monitoring | ✅ |
| LAN IP auto-detection | ✅ |
| Kubo/IPFS integration | ✅ |
| Provider Agent upload | ✅ |
| Provider Agent download | ✅ |
| Provider selection | ✅ |
| Storage accounting | ✅ |
| Web upload | ✅ |
| Web download | ✅ |
| Web view | ✅ |
| AES-256-GCM encryption | ✅ |
| Encrypted content in IPFS | ✅ |
| Web download decryption | ✅ |
| Web view decryption | ✅ |
| REST API authentication | ✅ |
| REST API file upload encryption | ✅ |
| REST API download decryption | ✅ |
| REST API view decryption | ✅ |
| React frontend | ✅ |
| Consumer frontend dashboard | ✅ |
| Provider frontend dashboard | ✅ |
| PC-to-PC LAN testing | ✅ |

---

# Known Limitations

The current system is a working development/MVP implementation rather than a production cloud-storage service.

## 1. Chunking

Large files are currently processed as a complete encrypted object.

Planned:

```text
File
 ↓
Encrypt
 ↓
4 MB chunks
 ↓
Chunk CIDs
```

---

## 2. Replication

Multi-node replication is not yet implemented.

Planned initial replication factor:

```text
R = 2
```

Example:

```text
Chunk 1 → Node A + Node B
Chunk 2 → Node B + Node C
Chunk 3 → Node A + Node C
```

---

## 3. Fault Tolerance

Automatic recovery when a provider goes offline is planned.

Future behavior:

```text
Node failure
    ↓
Detect offline node
    ↓
Locate missing chunks
    ↓
Select replacement provider
    ↓
Re-replicate
```

---

## 4. Node Agent Security

The current provider upload/download endpoints are intended for controlled development/LAN testing.

Before public deployment they should have:

- Strong authentication
- Request authorization
- HTTPS
- Token validation
- Rate limiting
- Input validation
- Access controls

---

## 5. Production Database

SQLite is currently used for development.

A production deployment should use a database such as PostgreSQL.

---

## 6. Public Provider Networking

A hosted Django server cannot normally initiate requests directly to a provider laptop's private LAN address such as:

```text
192.168.x.x
```

A production architecture should use a secure outbound connection, VPN, tunnel, message queue, or provider polling architecture.

---

## 7. IPFS Garbage Collection

Deleting a database record does not currently perform complete IPFS pin/unpin lifecycle management.

Future versions should coordinate:

```text
Database deletion
       +
IPFS unpinning
       +
Storage accounting
```

---

## 8. Whole-File Memory Usage

The current encryption implementation reads the entire file into memory.

This is acceptable for initial development and testing, but large files should use streaming/chunk-based processing.

Chunking is planned specifically to address this limitation.

---

# Roadmap

## Phase 1 — Foundation

- [x] Django backend
- [x] Database models
- [x] Authentication
- [x] Consumer/provider roles

## Phase 2 — Provider Network

- [x] Storage node registration
- [x] Node Agent
- [x] Node UUID
- [x] Node Token
- [x] Heartbeat
- [x] LAN communication
- [x] IPFS integration

## Phase 3 — Storage

- [x] Provider selection
- [x] File upload
- [x] CID storage
- [x] File download
- [x] File view
- [x] Storage accounting

## Phase 4 — Security

- [x] AES-256-GCM encryption
- [x] Per-file encryption keys
- [x] Protected encryption keys
- [x] Web decryption
- [x] REST API decryption
- [ ] Dedicated production encryption master secret
- [ ] Strong Node Agent authentication
- [ ] Key rotation strategy

## Phase 5 — Distributed Storage

- [ ] File chunking
- [ ] Chunk metadata
- [ ] Chunk-level CIDs
- [ ] Replication factor
- [ ] Multi-provider storage
- [ ] Fault detection
- [ ] Re-replication

## Phase 6 — Production Hardening

- [ ] PostgreSQL
- [ ] HTTPS
- [ ] Secure provider networking
- [ ] Background workers
- [ ] Rate limiting
- [ ] Monitoring
- [ ] Logging
- [ ] Automated recovery

## Phase 7 — Client Expansion

- [x] React client foundation
- [ ] Complete production frontend integration
- [ ] Flutter mobile client
- [ ] Desktop client
- [ ] Provider onboarding automation

---

# Security Considerations

For development, the following files must never be committed:

```text
.env
venv/
__pycache__/
*.pyc
node_identity.json
db.sqlite3
```

The `.gitignore` files should protect these resources.

### Never commit

```text
NODE_TOKEN
Django SECRET_KEY
Production encryption keys
API credentials
Private certificates
```

### Production checklist

Before public deployment:

```text
[ ] HTTPS
[ ] Secure SECRET_KEY
[ ] Dedicated encryption master key
[ ] Secure Node Agent authentication
[ ] Token rotation
[ ] PostgreSQL
[ ] Restricted CORS
[ ] Restricted ALLOWED_HOSTS
[ ] Secure CSRF configuration
[ ] Rate limiting
[ ] File size limits
[ ] Malware/content validation where appropriate
[ ] Logging and monitoring
[ ] Backup/recovery strategy
```

---

# Troubleshooting

## Django cannot start

Run:

```powershell
python manage.py check
```

Then:

```powershell
python manage.py migrate
```

---

## Node Agent cannot reach Django

Check the configured:

```env
BACKEND_URL=
```

Then from the provider computer test:

```powershell
Test-NetConnection <DJANGO-IP> -Port 8000
```

---

## Django cannot reach Node Agent

From the Django computer:

```powershell
Test-NetConnection <PROVIDER-IP> -Port 9001
```

Expected:

```text
TcpTestSucceeded : True
```

---

## IPFS is not connected

Check:

```powershell
ipfs id
```

If the daemon is not running:

```powershell
ipfs daemon
```

---

## Node is offline

Check:

- Node Agent is running
- Kubo is running
- `BACKEND_URL` is correct
- `NODE_TOKEN` is correct
- Provider and backend are on a reachable network
- Port `9001` is accessible
- Windows Firewall is not blocking the Agent

---

## File upload says no provider is available

Check the provider dashboard.

The provider must have:

```text
IPFS connected
+
recent heartbeat
+
Agent API URL
+
enough available storage
+
enough allocated storage
```

---

## File is encrypted but cannot be decrypted

Do not change the encryption fields manually.

Verify:

```text
encrypted_key
key_nonce
file_nonce
is_encrypted
```

Also ensure the Django encryption master secret has not changed.

---

# Academic Project Scope

This project demonstrates practical implementation of several important computer science concepts.

## Distributed Systems

- Multiple storage providers
- Node health monitoring
- Provider selection
- Distributed storage architecture

## Networking

- LAN communication
- HTTP APIs
- Provider-to-backend communication
- Node Agent architecture

## Cryptography

- AES-256-GCM
- Per-file keys
- Nonces
- Authenticated encryption
- Protected key storage

## Blockchain/Web3-Adjacent Concepts

Although the current storage layer is based on IPFS rather than a blockchain ledger, the project uses concepts commonly associated with decentralized systems:

- Content addressing
- Peer-to-peer storage
- Distributed resources
- Node identities
- Decentralized file content

## Software Engineering

- REST API design
- Frontend/backend separation
- Modular architecture
- Git feature branches
- Environment-based configuration
- Database migrations
- Provider scheduling

---

# Example End-to-End Scenario

Suppose a consumer uploads:

```text
college-project.pdf
```

The system performs:

```text
1. Consumer selects college-project.pdf
                ↓
2. Django receives the file
                ↓
3. AES-256-GCM generates a unique file key
                ↓
4. File is encrypted
                ↓
5. Django selects the best provider
                ↓
6. Encrypted file is sent to Provider Node Agent
                ↓
7. Node Agent sends it to local Kubo
                ↓
8. IPFS generates a CID
                ↓
9. Django stores:
      - filename
      - CID
      - owner
      - provider node
      - file size
      - encryption metadata
                ↓
10. Provider stores encrypted content
```

When the consumer downloads:

```text
1. Consumer requests college-project.pdf
                ↓
2. Django finds provider + CID
                ↓
3. Provider Node Agent retrieves encrypted content
                ↓
4. Django receives encrypted bytes
                ↓
5. Django recovers the protected file key
                ↓
6. AES-256-GCM decrypts the file
                ↓
7. Original college-project.pdf is returned
```

---

# Future Distributed Architecture

The intended future architecture is:

```text
                         Consumer
                            |
                            v
                    +---------------+
                    | Django        |
                    | Control Plane |
                    +-------+-------+
                            |
                 Provider Selection
                            |
              +-------------+-------------+
              |             |             |
              v             v             v
          Provider A    Provider B    Provider C
          Node Agent    Node Agent    Node Agent
              |             |             |
              v             v             v
             IPFS          IPFS          IPFS
```

After chunking and replication:

```text
                         Encrypted File
                               |
                               v
                         Split into chunks
                               |
          +--------------------+--------------------+
          |                    |                    |
          v                    v                    v
       Chunk 1              Chunk 2              Chunk 3
       CID-1                CID-2                CID-3
          |                    |                    |
       +--+--+              +--+--+              +--+--+
       |     |              |     |              |     |
       v     v              v     v              v     v
     Node A Node B        Node B Node C        Node A Node C
```

This provides the foundation for fault-tolerant distributed storage.

---

# Conclusion

Shardize demonstrates a practical architecture for decentralized storage by combining:

```text
React
  +
Django
  +
REST API
  +
Node Agent
  +
Kubo/IPFS
  +
AES-256-GCM
```

The current system already demonstrates:

- User and provider management
- Provider node registration
- LAN-based node communication
- IPFS storage
- Provider selection
- Encrypted storage
- Decrypted file retrieval
- REST API integration
- React frontend integration

The next major milestone is **chunking followed by replication**, which will move the project from a provider-based IPFS storage prototype toward a more complete distributed storage system.

---

## Project Status

**Current stage:** Functional decentralized-storage prototype / Final Year Project

**Current deployment model:** PC-to-PC LAN

**Storage:** IPFS/Kubo

**Encryption:** AES-256-GCM

**Backend:** Django + Django REST Framework

**Frontend:** React + Vite

**Provider bridge:** Python Node Agent

**Next major milestone:** File chunking → replication → fault tolerance
