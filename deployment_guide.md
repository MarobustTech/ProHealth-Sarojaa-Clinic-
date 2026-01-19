# Deployment Guide for Hospital System

This guide outlines the recommended steps to deploy your full-stack application (Backend, Bot, Frontend, and Database) using **Railway**. Railway is chosen for its ease of use with multi-service applications and built-in PostgreSQL support.

## Prerequisites
1.  **GitHub Account**: Your code should be pushed to a GitHub repository (one repository containing `backend`, `frontend`, and `bot` folders).
2.  **Railway Account**: Sign up at [railway.app](https://railway.app).

---

## Step 1: Create Project & Database
1.  On Railway, click **"New Project"**.
2.  Select **"Provision PostgreSQL"**. This will create your database service.
3.  Once created, click on the **PostgreSQL** card -> `Variables` tab.
4.  Copy the `DATABASE_URL` (you will need this for the backend).

## Step 2: Deploy Backend (FastAPI)
1.  In the same project, click **"New"** -> **"GitHub Repo"** -> Select your repository.
2.  Click on the new service card -> `Settings`.
3.  **Root Directory**: Set to `/backend`.
4.  **Build Command**: Leave empty (Railway detects Python).
5.  **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6.  Go to `Variables` tab:
    - Add `DATABASE_URL`: Paste the value from Step 1.
    - Add `PORT`: `8000` (optional/default).
7.  Go to `Settings` -> `Networking` -> **Generate Domain**. Copy this domain (e.g., `backend-production.up.railway.app`).

## Step 3: Deploy Telegram Bot
1.  Click **"New"** -> **"GitHub Repo"** -> Select the same repository again.
2.  Click on the new service card -> `Settings`.
3.  **Root Directory**: Set to `/bot`.
4.  **Start Command**: `python bot.py`
5.  Go to `Variables` tab:
    - Add `BOT_TOKEN`: Your Telegram Bot Token.
    - Add `API_BASE`: `https://<YOUR-BACKEND-DOMAIN>` (The domain you generated in Step 2, e.g., `https://backend-production.up.railway.app`).
    - *Note: Don't add a trailing slash to the API URL if your code appends paths like `/api/...`*.

## Step 4: Deploy Frontend (Next.js)
1.  Click **"New"** -> **"GitHub Repo"** -> Select your repository.
2.  Click on the new service card -> `Settings`.
3.  **Root Directory**: Set to `/frontend`.
4.  **Build Command**: `npm run build`
5.  **Start Command**: `npm run start`
6.  Go to `Variables` tab:
    - Add `NEXT_PUBLIC_API_URL`: `https://<YOUR-BACKEND-DOMAIN>` (Same as Bot's API_BASE).
7.  Go to `Settings` -> `Networking` -> **Generate Domain**. This is your website URL!

---

## Troubleshooting
- **Bot Clashing**: Ensure you stop your local bot (`Ctrl+C`) before the deployed bot starts, or they will conflict.
- **Database**: The deployed backend will use the Railway Postgres DB. It will be empty appropriately. You may need to run initialization scripts if your code doesn't auto-create tables (your `setup_db.py` logic helps here, or ensure `main.py` calls `models.Base.metadata.create_all(bind=engine)`).
- **CORS**: If the frontend fails to call the backend, check CORS settings in `backend/main.py`. You might need to add your Frontend Domain to the allowed origins.

## Summary of Services
| Service | Root Dir | Env Vars Needed |
| :--- | :--- | :--- |
| **Postgres** | N/A | (Provides DATABASE_URL) |
| **Backend** | `/backend` | `DATABASE_URL` |
| **Bot** | `/bot` | `BOT_TOKEN`, `API_BASE` |
| **Frontend** | `/frontend` | `NEXT_PUBLIC_API_URL` |
