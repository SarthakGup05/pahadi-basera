import { Router } from 'express';
import { getMyReferralStats, validateReferralCode } from '../controllers/referral.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Blogger protected referral analytics
router.get('/my-stats', requireAuth, getMyReferralStats);

// Public referral code verification during booking/checkout
router.get('/validate/:code', validateReferralCode);

export default router;
