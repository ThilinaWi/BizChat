# BizChat - Run Backend and Frontend

This workspace has two projects:
- `bizchat-backend-main` (Node.js + Express + TypeScript API)
- `bizchat-web-main` (React + Vite frontend)

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm 9+
- MongoDB connection string (local or cloud)

## 1) Run the Backend (`bizchat-backend-main`)

### Install dependencies

```powershell
cd bizchat-backend-main
npm install
```

### Create `.env`

Create a file named `.env` in `bizchat-backend-main` with at least:

```env
MONGO_URI=mongodb:
PORT=4500
NODE_ENV=development

JWT_ACCESS_SECRET=replace_with_a_long_secret
JWT_REFRESH_SECRET=replace_with_another_long_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
```

Optional variables (only if you use these features):

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

LOG_LEVEL=info
```

### Start backend (dev mode)

```powershell
npm run dev
```

Backend runs at:
- API base: `http://localhost:4500/api`
- Health check: `http://localhost:4500/health`

## 2) Run the Frontend (`bizchat-web-main`)

Open a second terminal.

### Install dependencies

```powershell
cd bizchat-web-main
npm install
```

### Create `.env`

Create `.env` in `bizchat-web-main`:

```env
VITE_API_URL=http://localhost:4500/api
```

### Start frontend (dev mode)

```powershell
npm run dev
```

Frontend usually runs at:
- `http://localhost:5173`

## Run both quickly (two terminals)

Terminal 1:

```powershell
cd bizchat-backend-main
npm install
npm run dev
```

Terminal 2:

```powershell
cd bizchat-web-main
npm install
npm run dev
```

## Production build commands

Backend:

```powershell
cd bizchat-backend-main
npm run build
npm start
```

Frontend:

```powershell
cd bizchat-web-main
npm run build
npm run preview
```

## Common issues

- `CORS blocked`: ensure frontend URL is `http://localhost:5173` and backend is running on `4500`.
- `MONGO_URI missing`: check backend `.env` exists and is in `bizchat-backend-main`.
- `JWT_* missing`: backend auth will fail unless JWT secrets are set.
- Frontend cannot reach API: verify `VITE_API_URL=http://localhost:4500/api`.
