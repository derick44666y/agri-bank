import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get KYC status
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const kycVerifications = await prisma.kycVerification.findMany({
      where: { userId: req.userId },
      orderBy: { submittedAt: 'desc' }
    });

    res.json(kycVerifications);
  } catch (error) {
    console.error('Error fetching KYC:', error);
    res.status(500).json({ error: 'Failed to fetch KYC status' });
  }
});

// Submit KYC
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  const {
    documentType,
    documentNumber,
    documentCountry,
    selfieTaken,
    addressLine,
    city,
    postalCode,
    country
  } = req.body;

  try {
    const kyc = await prisma.kycVerification.create({
      data: {
        userId: req.userId!,
        documentType,
        documentNumber,
        documentCountry,
        selfieTaken: selfieTaken || false,
        addressLine,
        city,
        postalCode,
        country,
        status: 'pending'
      }
    });

    // Update profile KYC status
    await prisma.profile.update({
      where: { userId: req.userId },
      data: { kycStatus: 'pending' }
    });

    res.status(201).json(kyc);
  } catch (error) {
    console.error('Error submitting KYC:', error);
    res.status(500).json({ error: 'Failed to submit KYC' });
  }
});

export default router;
