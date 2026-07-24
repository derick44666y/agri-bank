import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all crypto holdings
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const holdings = await prisma.cryptoHolding.findMany({
      where: { userId: req.userId },
      orderBy: { symbol: 'asc' }
    });

    res.json(holdings);
  } catch (error) {
    console.error('Error fetching crypto holdings:', error);
    res.status(500).json({ error: 'Failed to fetch crypto holdings' });
  }
});

// Add or update crypto holding
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  const { symbol, name, amount, avgBuyPriceEur } = req.body;

  try {
    const holding = await prisma.cryptoHolding.upsert({
      where: {
        userId_symbol: {
          userId: req.userId!,
          symbol
        }
      },
      update: {
        amount,
        avgBuyPriceEur
      },
      create: {
        userId: req.userId!,
        symbol,
        name,
        amount,
        avgBuyPriceEur
      }
    });

    res.json(holding);
  } catch (error) {
    console.error('Error updating crypto holding:', error);
    res.status(500).json({ error: 'Failed to update crypto holding' });
  }
});

// Delete crypto holding
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const result = await prisma.cryptoHolding.deleteMany({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Crypto holding not found' });
    }

    res.json({ message: 'Crypto holding deleted successfully' });
  } catch (error) {
    console.error('Error deleting crypto holding:', error);
    res.status(500).json({ error: 'Failed to delete crypto holding' });
  }
});

export default router;
