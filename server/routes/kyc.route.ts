import { Router } from 'express';
import { verifyAadhaarDigilocker, getKycStatus } from '../controllers/kyc.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/verify-aadhaar', requireAuth, verifyAadhaarDigilocker);
router.get('/status', requireAuth, getKycStatus);

export default router;
