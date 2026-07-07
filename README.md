# Decentralized Storage Platform

> A production-oriented decentralized cloud storage platform built using Django, IPFS, and a custom Node Agent.

---

## 📌 Project Vision

The goal of this project is to build a decentralized cloud storage platform where users can securely upload encrypted files while independent storage providers contribute disk space to the network.

Unlike traditional cloud storage, this platform separates the control plane (backend) from the storage plane (provider nodes).

---

## 🚀 Current Status

🚧 Active Development

Current Milestone: **v0.1.0 – Project Initialization**

---

## 🏗 Planned Architecture

```
                Django Backend
                     │
        REST API / Authentication
                     │
        ┌────────────┴────────────┐
        │                         │
   Consumer Client          Provider Node Agent
                                     │
                                     ▼
                                  IPFS Node
```

---

## 📂 Repository Structure

```
DecentralizedStorage/
├── backend/
├── frontend/
├── node_agent/
├── docs/
└── README.md
```

---

## 📅 Roadmap

- [ ] Project Initialization
- [ ] Django Backend
- [ ] IPFS Integration
- [ ] Authentication
- [ ] Consumer Dashboard
- [ ] Provider Dashboard
- [ ] Node Agent
- [ ] Chunk Management
- [ ] Encryption
- [ ] Distributed Storage Scheduler

---

## 👨‍💻 Author

Meet Shah
