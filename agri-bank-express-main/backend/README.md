# AgriBank Express Backend

Express.js + PostgreSQL + Prisma backend for AgriBank.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Generate Prisma client:
```bash
npm run prisma:generate
```

4. Run migrations:
```bash
npm run prisma:migrate
```

5. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Accounts
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get single account
- `POST /api/accounts` - Create account
- `PATCH /api/accounts/:id` - Update account

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions/transfer` - Create transfer

### Profile
- `GET /api/profile` - Get profile
- `PATCH /api/profile` - Update profile

### Recipients
- `GET /api/recipients` - Get all recipients
- `POST /api/recipients` - Create recipient
- `PATCH /api/recipients/:id` - Update recipient
- `DELETE /api/recipients/:id` - Delete recipient

### KYC
- `GET /api/kyc` - Get KYC verifications
- `POST /api/kyc` - Submit KYC

### Crypto
- `GET /api/crypto` - Get crypto holdings
- `POST /api/crypto` - Add/update holding
- `DELETE /api/crypto/:id` - Delete holding

## Deployment to Render

The project includes a `render.yaml` file in the root directory. Simply connect your GitHub repository to Render and it will automatically deploy both frontend and backend.
