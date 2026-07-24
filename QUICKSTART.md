# Quick Start Guide

## ✅ What's Done

Your AgriBank Express application is now ready with:

- ✅ **Express.js Backend** - Complete REST API with authentication
- ✅ **PostgreSQL Database** - Using Prisma ORM for type-safety
- ✅ **JWT Authentication** - Secure auth with access & refresh tokens
- ✅ **All API Endpoints** - Accounts, Transactions, Profile, Recipients, KYC, Crypto
- ✅ **Render Deployment Config** - One-click deployment setup
- ✅ **Code Pushed to GitHub** - https://github.com/derick44666y/agri-bank.git

## 🚀 Deploy to Render (5 Minutes)

### Step 1: Go to Render
Visit: https://dashboard.render.com/

### Step 2: Deploy with Blueprint
1. Click **"New"** → **"Blueprint"**
2. Connect GitHub: Select `derick44666y/agri-bank`
3. Render detects `render.yaml` automatically
4. Click **"Apply"**

### Step 3: Wait for Deployment
Render will create:
- PostgreSQL database
- Backend API (Node.js service)
- Frontend (Static site)

First deployment takes ~5-7 minutes.

### Step 4: Get Your URLs
After deployment completes:
- **Frontend**: `https://agribank-frontend.onrender.com`
- **Backend**: `https://agribank-backend.onrender.com`

### Step 5: Update Frontend URL in Backend
1. Go to Backend service → **Environment**
2. Find `FRONTEND_URL` variable
3. Update to your actual frontend URL
4. Save (triggers redeploy ~1 minute)

## ✨ That's It!

Your app is now live on Render!

- Register a new account
- Login and explore
- Create accounts, make transfers
- Everything works!

## 💻 Local Development (Optional)

Want to run locally?

### Backend
```bash
cd backend
npm install

# Create .env file
echo 'DATABASE_URL=postgresql://localhost:5432/agribank
JWT_SECRET=your-local-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173' > .env

# Setup database
npm run prisma:generate
npm run prisma:migrate

# Start server
npm run dev
```

### Frontend
```bash
npm install

# Create .env file
echo 'VITE_API_URL=http://localhost:3001' > .env

# Start dev server
npm run dev
```

Open http://localhost:5173

## 📝 Next Steps

### Remove Supabase Dependencies (Optional)

Your frontend still has Supabase code. To fully migrate:

1. Replace Supabase imports with the new API client:
```typescript
// Old
import { supabase } from '@/integrations/supabase/client';

// New
import { api } from '@/lib/api';
```

2. Update auth hooks to use new API
3. Remove `@supabase/supabase-js` from package.json
4. Delete `src/integrations/supabase/` folder

### Custom Domain

1. In Render Dashboard → Frontend service → **Settings**
2. Add your domain
3. Update DNS records
4. Update backend `FRONTEND_URL` env var

### Environment Secrets

Generate strong secrets for production:

```bash
# macOS/Linux
openssl rand -hex 32

# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

Add these to Render environment variables.

## 🆘 Need Help?

- **Logs**: Render Dashboard → Service → Logs tab
- **Database**: Connect with provided credentials
- **Health Check**: Visit `/health` endpoint on backend

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [backend/README.md](./backend/README.md) - API documentation
- [README.md](./README.md) - Project overview

---

**Repository**: https://github.com/derick44666y/agri-bank.git

Everything is set up and ready to deploy! 🚀
