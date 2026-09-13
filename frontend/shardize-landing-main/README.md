# Shardize — Landing Page

A standalone marketing/explainer landing page for Shardize, a decentralized
cloud storage platform built on IPFS. This page explains the project's idea,
problem it solves, how it works, and its core features to a general audience —
built separately from the main web app (Shardize-Client) and the backend.

---

## What This Project Is

This is a single-page, purely front-end explainer site. It does not connect to
any backend or API — it's meant for presentations, demos, and giving people an
overview of what Shardize does before they try the actual app.

Includes a toggle to switch the messaging between:
- **Storage users** — people who want to upload and store encrypted files
- **Node operators** — people who want to host storage nodes and earn rewards

---

## Tech Stack

- React 18
- Vite
- Mantine UI (`@mantine/core`)

---

## Project Structure

```text
shardize-landing/
├── public/
├── src/
│   ├── components/
│   │   ├── NetworkDiagramPreview.jsx
│   │   ├── NodeDashboardPreview.jsx
│   │   ├── CentralizedServerInfographic.jsx
│   │   ├── WastedHardwareInfographic.jsx
│   │   └── StepGraphic.jsx
│   ├── constants/
│   │   └── landingContent.jsx
│   ├── pages/
│   │   └── Landing.jsx
│   ├── styles/
│   │   ├── theme.css
│   │   └── landing.css
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

---

## Setup Instructions

### 1. Clone the Repository

```powershell
git clone https://github.com/07Ishika/shardize-landing.git
cd shardize-landing
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Run the Dev Server

```powershell
npm run dev
```

The page will run at:

```text
http://localhost:5173/
```

---

## Notes

- This project has no backend connection — all content is static/hardcoded in
  `src/constants/landingContent.jsx`.
- The "Try it" and role-based CTA buttons link out to the main Shardize web
  app (Shardize-Client repo), currently pointing at `http://localhost:5173/login`
  and `/register` for local development. Update these once the main app is
  deployed.

---

## Related Repositories

- **Shardize-Client** — the actual web app (register, login, upload, dashboard)
- **decentralized-storage** — Django backend + IPFS + node agent

---

## Future Work

- Update CTA links once Shardize-Client is deployed to a real URL
- Add responsive polish for smaller screens
- Possibly merge into Shardize-Client as a `/` route once both are stable


---

## Backend integration (added)

This frontend is now wired up to the Django REST backend
(`decentralized-storage-encryption-decryption/backend`).

### Setup

```bash
npm install
cp .env.example .env   # edit VITE_API_URL to point at your Django server
npm run dev
```

`VITE_API_URL` defaults to `http://127.0.0.1:8000/api`. If your Django
server runs on a LAN IP (e.g. for testing from a phone), set it to
something like `http://192.168.29.121:8000/api` and make sure that
host is in Django's `CSRF_TRUSTED_ORIGINS` / `ALLOWED_HOSTS` and that
`CORS_ALLOW_ALL_ORIGINS = True` (already the case in the provided
backend settings).

### What was added

- `src/lib/api.js` — fetch-based API client (auth, files, provider, network endpoints) using DRF token auth (`Authorization: Token <key>`), stored in `localStorage`.
- `src/context/AuthContext.jsx` — global session state (`user`, `login`, `register`, `logout`, `refreshUser`).
- `src/components/ProtectedRoute.jsx`, `src/components/AppTopbar.jsx`
- `src/pages/Login.jsx`, `src/pages/Register.jsx` — auth screens styled to match the landing page (same fonts, colors, glass cards, pill buttons).
- `src/pages/Dashboard.jsx` — consumer view: storage stats, drag-and-drop encrypted upload, file list with view/download/delete, "become a provider" upgrade.
- `src/pages/ProviderDashboard.jsx` — provider view: network stats, node registration form, live node status.
- Routing via `react-router-dom`: `/`, `/login`, `/register`, `/dashboard`, `/provider`.
- The landing page's "Try it" dropdown and nav now route into real signup/login/dashboard flows instead of showing the "under maintenance" toast.

### Note

The backend's file view/download endpoints require the DRF token
header, so they're fetched as authenticated blobs in-app (opened in
a new tab / triggered as a download) rather than plain `<a href>`
links to the API.
