import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all recipients
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const recipients = await prisma.recipient.findMany({
      where: { userId: req.userId },
      orderBy: [
        { isFavorite: 'desc' },
        { name: 'asc' }
      ]
    });

    res.json(recipients);
  } catch (error) {
    console.error('Error fetching recipients:', error);
    res.status(500).json({ error: 'Failed to fetch recipients' });
  }
});

// Create recipient
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  const { name, iban, swiftBic, bankName, country, currency, isFavorite } = req.body;

  try {
    const recipient = await prisma.recipient.create({
      data: {
        userId: req.userId!,
        name,
        iban,
        swiftBic,
        bankName,
        country,
        currency,
        isFavorite: isFavorite || false
      }
    });

    res.status(201).json(recipient);
  } catch (error) {
    console.error('Error creating recipient:', error);
    res.status(500).json({ error: 'Failed to create recipient' });
  }
});

// Update recipient
router.patch('/:id', authenticateToken, async (req: AuthRequest, res) => {
  const { name, iban, swiftBic, bankName, country, currency, isFavorite } = req.body;

  try {
    const recipient = await prisma.recipient.updateMany({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      data: { name, iban, swiftBic, bankName, country, currency, isFavorite }
    });

    if (recipient.count === 0) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const updated = await prisma.recipient.findUnique({
      where: { id: req.params.id }
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating recipient:', error);
    res.status(500).json({ error: 'Failed to update recipient' });
  }
});

// Delete recipient
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const result = await prisma.recipient.deleteMany({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    res.json({ message: 'Recipient deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipient:', error);
    res.status(500).json({ error: 'Failed to delete recipient' });
  }
});

export default router;
