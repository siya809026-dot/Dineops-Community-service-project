# DineOps

Food demand prediction and waste-tracking platform for Pindi Junction (Faridabad).
**Stack:** React + Vite + Tailwind (client) · Node + Express (server) · MongoDB Atlas · Deployed on Vercel + Render.

```
Dineops/
├── client/          React app  -> Vercel
│   ├── src/config/api.js   single place for the backend URL
│   └── vercel.json
├── server/          Express API -> Render
│   ├── server.js
│   └── src/{config,controllers,middleware,models,routes,services,scripts}
├── render.yaml      optional Render blueprint
└── README.md
```

## Deployment checklist

### 1. MongoDB Atlas
- **Network Access** -> add `0.0.0.0/0` (Render IPs change).
- Copy the connection string (replace `<password>`; URL-encode special characters).

### 2. Backend on Render
- New Web Service -> repo `Dineops` -> **Root Directory:** `server`
- **Build:** `npm install` · **Start:** `npm start` · **Health check path:** `/health`
- Environment variables:

| Key | Value |
|---|---|
| `MONGO_URI` | your Atlas connection string |
| `JWT_SECRET` | long random string |
| `CLIENT_URL` | `https://dineops-phi.vercel.app` (no trailing slash) |

- Open `https://<your-service>.onrender.com/health` — it must return `{"success":true,"status":"ok"}`.

### 3. Frontend on Vercel
- Import repo -> **Root Directory:** `client` (Framework: Vite)
- Environment variable: `VITE_API_URL` = `https://<your-service>.onrender.com/api`
- **Redeploy** after adding/changing it (Vite bakes env vars at build time).

### 4. Create the first Owner user
Run once locally with `server/.env` filled in:
```bash
cd server
npm install
npm run create:owner
```

## Local development
```bash
# terminal 1
cd server && cp .env.example .env && npm install && npm run dev
# terminal 2
cd client && cp .env.example .env && npm install && npm run dev
```

## Troubleshooting
| Symptom | Cause |
|---|---|
| "Network Error" on login | `VITE_API_URL` wrong/missing, backend asleep (Render free tier, wait ~60s), or `CLIENT_URL` mismatch |
| Browser console: *blocked by CORS policy* | Check `CLIENT_URL` on Render (exact URL, no `/` at the end) |
| Render logs: `MongoDB Connection Failed` | Atlas Network Access or wrong `MONGO_URI` |
| 404 on page refresh (Vercel) | `client/vercel.json` rewrite must be present |
