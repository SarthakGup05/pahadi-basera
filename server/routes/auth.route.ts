import { Router } from 'express';
import { 
  register, 
  loginWithPassword, 
  logout,
  getMe
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Standard Auth
router.post('/register', register);
router.post('/login', loginWithPassword);
router.get('/me', requireAuth, getMe);
router.post('/logout', requireAuth, logout);

export default router;