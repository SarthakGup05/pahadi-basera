import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { 
  getDashboardStats, 
  getAllProperties, 
  togglePropertyActive, 
  getAllBookings, 
  updateBookingStatus 
} from '../controllers/admin.controller.js';

const router = Router();

// Secure all endpoints to ADMIN only
router.use(requireAuth, requireRole(['ADMIN']));

router.get('/stats', getDashboardStats);
router.get('/properties', getAllProperties);
router.put('/properties/:id/toggle-active', togglePropertyActive);
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

export default router;
