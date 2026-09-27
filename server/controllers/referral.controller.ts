import { Request, Response } from 'express';
import { prisma } from '../db/prisma..js';
import { AuthRequest } from '../middleware/auth.middleware.js';

// Get current blogger referral stats & earnings
export const getMyReferralStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        referralEarnings: {
          orderBy: { createdAt: 'desc' },
          include: {
            booking: {
              include: {
                property: {
                  select: { title: true, location: true }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    if (user.role !== 'BLOGGER' && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Referral portal is exclusive to Verified Creators.' });
    }

    const totalReferralsCount = user.referralEarnings.length;
    const confirmedCount = user.referralEarnings.filter(r => r.status === 'CONFIRMED' || r.status === 'PAID').length;
    const totalEarned = user.referralEarnings
      .filter(r => r.status === 'CONFIRMED' || r.status === 'PAID')
      .reduce((sum, r) => sum + r.commissionAmount, 0);

    const pendingEarned = user.referralEarnings
      .filter(r => r.status === 'PENDING')
      .reduce((sum, r) => sum + r.commissionAmount, 0);

    return res.status(200).json({
      referralCode: user.referralCode,
      commissionRate: user.commissionRate,
      guestDiscount: 0.05, // 5% discount for guests
      totalEarned,
      pendingEarned,
      totalReferralsCount,
      confirmedCount,
      earnings: user.referralEarnings
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch referral stats', details: error.message });
  }
};

// Validate referral code (Public endpoint used during stay checkout)
export const validateReferralCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ error: 'Referral code is required' });
    }

    const blogger = await prisma.user.findUnique({
      where: { referralCode: code.toUpperCase().trim() },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        socialProfile: true,
        role: true,
        kycStatus: true,
        commissionRate: true
      }
    });

    if (!blogger || blogger.kycStatus !== 'VERIFIED') {
      return res.status(404).json({ 
        valid: false, 
        error: 'Invalid or inactive creator referral code.' 
      });
    }

    return res.status(200).json({
      valid: true,
      code: code.toUpperCase().trim(),
      creatorName: blogger.fullName || 'Himalayan Creator',
      discountRate: 0.05, // 5% Guest Discount
      discountPercentage: 5,
      message: `Verified Creator discount of 5% applied via ${blogger.fullName || 'Creator'}!`
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to validate referral code' });
  }
};
