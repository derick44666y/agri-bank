import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all transactions for authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  const { accountId, limit = '50' } = req.query;

  try {
    const where: any = { userId: req.userId };
    if (accountId) {
      where.accountId = accountId as string;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      include: {
        account: {
          select: {
            name: true,
            type: true,
            currency: true
          }
        }
      }
    });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get single transaction
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      include: {
        account: true
      }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// Create transfer
router.post('/transfer', authenticateToken, async (req: AuthRequest, res) => {
  const {
    accountId,
    recipientIban,
    recipientName,
    amountCents,
    description,
    network = 'sepa'
  } = req.body;

  try {
    // Verify account ownership and balance
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: req.userId
      }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (account.balanceCents < amountCents) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create debit transaction and update balance
    const result = await prisma.$transaction(async (tx) => {
      // Deduct from sender
      await tx.account.update({
        where: { id: accountId },
        data: { balanceCents: { decrement: amountCents } }
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId: req.userId!,
          accountId,
          direction: 'debit',
          amountCents,
          currency: account.currency,
          description,
          counterpartyName: recipientName,
          counterpartyIban: recipientIban,
          network,
          status: 'completed'
        }
      });

      return transaction;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating transfer:', error);
    res.status(500).json({ error: 'Transfer failed' });
  }
});

export default router;
