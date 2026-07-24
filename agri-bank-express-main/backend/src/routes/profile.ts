import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get profile
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.userId }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.patch('/', authenticateToken, async (req: AuthRequest, res) => {
  const {
    fullName,
    phone,
    dateOfBirth,
    country,
    city,
    addressLine,
    postalCode,
    twoFaEnabled
  } = req.body;

  try {
    const profile = await prisma.profile.update({
      where: { userId: req.userId },
      data: {
        fullName,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        country,
        city,
        addressLine,
        postalCode,
        twoFaEnabled
      }
    });

    res.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
