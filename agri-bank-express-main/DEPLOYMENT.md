# Deployment Guide - Render

This guide will help you deploy both the frontend and backend to Render.

## Prerequisites

- GitHub account with this repository pushed
- Render account (free tier works fine)

## Step 1: Push to GitHub

Your code is already on GitHub at: https://github.com/derick44666y/agri-bank.git

Make sure all recent changes are committed and pushed:
```bash
git add .
git commit -m "Add Express backend and Render deployment config"
git push origin main
```

## Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended - One-Click Deploy)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository: `derick44666y/agri-bank`
4. Render will automatically detect `render.yaml` and create:
   - PostgreSQL database (`agribank-db`)
   - Backend web service (`agribank-backend`)
   - Frontend static site (`agribank-frontend`)
5. Click **"Apply"** to deploy everything

### Option B: Manual Setup

#### 1. Create PostgreSQL Database

1. Click **"New"** → **"PostgreSQL"**
2. Name: `agribank-db`
3. Database: `agribank`
4. User: `agribank`
5. Region: Choose closest to you
6. Plan: **Free**
7. Click **"Create Database"**
8. Copy the **Internal Database URL** (starts with `postgresql://`)

#### 2. Deploy Backend

1. Click **"New"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `agribank-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run prisma:migrate && npm start`
4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `DATABASE_URL` = *paste the Internal Database URL from step 1*
   - `JWT_SECRET` = *generate a random 64-character string*
   - `JWT_REFRESH_SECRET` = *generate another random 64-character string*
   - `FRONTEND_URL` = `https://agribank-frontend.onrender.com` (update after deploying frontend)
5. Click **"Create Web Service"**
6. Wait for deployment (first deploy takes ~5 minutes)
7. Copy your backend URL (e.g., `https://agribank-backend.onrender.com`)

#### 3. Deploy Frontend

1. Click **"New"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `agribank-frontend`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = *paste your backend URL from step 2*
5. Add Rewrite Rule (for React Router):
   - Source: `/*`
   - Destination: `/index.html`
   - Action: **Rewrite**
6. Click **"Create Static Site"**
7. Wait for deployment (~3 minutes)

## Step 3: Update Backend FRONTEND_URL

After frontend is deployed:

1. Go to your backend service on Render
2. Navigate to **Environment**
3. Update `FRONTEND_URL` to your actual frontend URL
4. Save changes (backend will redeploy)

## Step 4: Test Your Deployment

1. Open your frontend URL (e.g., `https://agribank-frontend.onrender.com`)
2. Try registering a new account
3. Login and check that everything works

## Important Notes

### Free Tier Limitations

- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free (enough for continuous running)
- Database has 90-day retention

### Environment Variables Security

Never commit these to Git:
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `DATABASE_URL`

Generate secrets using:
```bash
# On macOS/Linux
openssl rand -hex 32

# On Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

### Database Migrations

Prisma migrations run automatically on deployment via the start command.

To run migrations manually:
```bash
cd backend
npm run prisma:migrate
```

### Monitoring

- Check logs in Render Dashboard → your service → **Logs**
- Backend health check: `https://your-backend.onrender.com/health`

## Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with local PostgreSQL credentials
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Frontend
```bash
npm install
# Create .env with VITE_API_URL=http://localhost:3001
npm run dev
```

## Troubleshooting

### Backend won't start
- Check DATABASE_URL is correct
- Verify all environment variables are set
- Check logs for Prisma migration errors

### Frontend can't connect to backend
- Verify VITE_API_URL is set correctly
- Check CORS settings in backend (FRONTEND_URL)
- Clear browser cache

### Database connection issues
- Ensure backend and database are in same region
- Use **Internal Database URL** not External
- Check database is running

## Custom Domain (Optional)

1. Go to your frontend service → **Settings**
2. Add custom domain
3. Update DNS records as instructed
4. Update backend FRONTEND_URL environment variable
