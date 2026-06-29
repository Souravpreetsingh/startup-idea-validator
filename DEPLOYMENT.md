# Deployment Guide

## Frontend (Vercel)

1. Push the `frontend/` directory to a GitHub repo
2. In Vercel, import the repo and set:
   - **Root Directory:** `frontend`
   - **Framework:** Next.js
   - **Build Command:** `npm run build`
   - **Output Dir:** `.next`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`
4. Deploy

## Backend (Render)

1. Push the `backend/` directory to a GitHub repo
2. In Render, create a **New Web Service**
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add environment variables:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — strong random secret
   - `GEMINI_API_KEY` — your Gemini API key
   - `JWT_EXPIRES_IN=7d`
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-frontend.vercel.app`
5. Deploy

## Database (MongoDB Atlas)

Already configured. Ensure Network Access allows Render's IPs
(use `0.0.0.0/0` for development).

## Post-Deployment

1. Update `NEXT_PUBLIC_API_URL` in Vercel to point to your Render backend
2. Update `CLIENT_URL` in Render to point to your Vercel frontend
3. Test health check: `GET https://your-backend.onrender.com/api/health`
