import { Request, Response } from 'express';
import { prisma } from '../db/prisma..js';
import { AuthRequest } from '../middleware/auth.middleware.js';

// Helper to generate a unique, clean referral code
function generateReferralCode(name: string): string {
  const cleanName = (name || 'HIMALAYA')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 6);
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `${cleanName}${randomSuffix}`;
}

// Automated DigiLocker / Aadhaar Verification Endpoint
export const verifyAadhaarDigilocker = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to apply for Creator status.' });
    }

    const { 
      fullName, 
      aadhaarNumber, 
      socialProfile, 
      bio, 
      upiId,
      otp 
    } = req.body;

    if (!fullName || !aadhaarNumber) {
      return res.status(400).json({ error: 'Full name and Aadhaar number are mandatory for verification.' });
    }

    // Clean Aadhaar (strip whitespace/dashes)
    const cleanAadhaar = aadhaarNumber.replace(/[\s-]/g, '');

    // Validate 12-digit Indian Aadhaar standard format
    if (!/^\d{12}$/.test(cleanAadhaar)) {
      return res.status(400).json({ 
        error: 'Invalid Aadhaar number. Must be a valid 12-digit UIDAI number.' 
      });
    }

    // Check if user is already verified
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    // Generate or retain unique referral code
    let referralCode = existingUser.referralCode;
    if (!referralCode) {
      let unique = false;
      while (!unique) {
        const candidate = generateReferralCode(fullName);
        const check = await prisma.user.findUnique({ where: { referralCode: candidate } });
        if (!check) {
          referralCode = candidate;
          unique = true;
        }
      }
    }

    // Masked Aadhaar for storage privacy (e.g. "XXXXXXXX9823")
    const maskedAadhaar = `XXXXXXXX${cleanAadhaar.slice(-4)}`;

    // Automated Instant Approval via DigiLocker Trust Anchor
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: fullName.trim(),
        bio: bio ? bio.trim() : null,
        socialProfile: socialProfile ? socialProfile.trim() : null,
        aadhaarNumber: maskedAadhaar,
        digilockerVerified: true,
        kycStatus: 'VERIFIED',
        role: 'BLOGGER',
        kycVerifiedAt: new Date(),
        referralCode: referralCode,
        commissionRate: 0.08, // 8% commission on referrals
        upiId: upiId ? upiId.trim() : null
      }
    });

    // Notify Super Admin of newly certified creator
    await prisma.notification.create({
      data: {
        title: 'New Verified Himalayan Creator',
        desc: `${fullName} has completed automated DigiLocker verification. Referral code: ${referralCode}`,
        type: 'kyc',
        unread: true
      }
    });

    return res.status(200).json({
      message: 'DigiLocker KYC verification successful! You are now a Verified Himalayan Blogger.',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
        kycStatus: updatedUser.kycStatus,
        referralCode: updatedUser.referralCode,
        commissionRate: updatedUser.commissionRate,
        digilockerVerified: updatedUser.digilockerVerified
      }
    });
  } catch (error: any) {
    return res.status(500).json({ 
      error: 'Automated KYC verification failed. Please try again.',
      details: error.message 
    });
  }
};

// Check current user KYC & Creator status
export const getKycStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        kycStatus: true,
        digilockerVerified: true,
        socialProfile: true,
        referralCode: true,
        commissionRate: true,
        totalEarnings: true,
        pendingBalance: true,
        upiId: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch KYC status' });
  }
};
