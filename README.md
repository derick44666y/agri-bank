# AgriBank Express

Modern banking application with React frontend and Express.js backend.

## Project Structure

```
├── backend/              # Express.js + PostgreSQL + Prisma
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Authentication middleware
│   │   └── server.ts    # Express server
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
├── src/                 # React frontend
├── render.yaml          # Render deployment config
└── DEPLOYMENT.md        # Deployment guide
```

## Features

- 🔐 JWT-based authentication with refresh tokens
- 💰 Multi-currency accounts (EUR, GBP, USD, CHF, PLN)
- 💸 Transfers (SEPA, SWIFT, Internal)
- 📊 Transaction history
- 👥 Recipients management
- ✅ KYC verification
- 🪙 Crypto holdings tracking
- 🎨 Modern UI with shadcn/ui
- 📱 Responsive design

## Quick Start - Local Development

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Backend will run on http://localhost:3001

### Frontend Setup

```bash
npm install
npm run dev
```

Frontend will run on http://localhost:5173

## Deployment to Render

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

**Quick Deploy:**
1. Push code to GitHub
2. Connect repository to Render
3. Render will auto-detect `render.yaml` and deploy everything

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TanStack Query
- React Router
- shadcn/ui (Radix UI)
- Tailwind CSS

### Backend
- Express.js
- PostgreSQL
- Prisma ORM
- JWT authentication
- bcrypt for password hashing

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/agribank
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

## Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run migrations

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests

## API Documentation

See [backend/README.md](./backend/README.md) for complete API documentation.

## License

MIT
