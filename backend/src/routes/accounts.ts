import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all accounts for authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: req.userId },
      orderBy: { isPrimary: 'desc' }
    });

    res.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// Get single account
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json(account);
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

// Create new account
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  const { name, type, currency } = req.body;

  try {
    const account = await prisma.account.create({
      data: {
        userId: req.userId!,
        name,
        type,
        currency,
        iban: `DE89${Math.floor(Math.random() * 100000000000000).toString().padStart(14, '0')}`,
        balanceCents: 0,
        isPrimary: false
      }
    });

    res.status(201).json(account);
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Update account
router.patch('/:id', authenticateToken, async (req: AuthRequest, res) => {
  const { name, isPrimary } = req.body;

  try {
    // If setting as primary, unset others first
    if (isPrimary) {
      await prisma.account.updateMany({
        where: { userId: req.userId, isPrimary: true },
        data: { isPrimary: false }
      });
    }

    const account = await prisma.account.updateMany({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      data: { name, isPrimary }
    });

    if (account.count === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const updated = await prisma.account.findUnique({
      where: { id: req.params.id }
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ error: 'Failed to update account' });
  }
});

export default router;
