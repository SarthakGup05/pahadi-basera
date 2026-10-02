import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { 
  getDashboardStats, 
  getAllProperties, 
  togglePropertyActive, 
  getAllBookings, 
  updateBookingStatus,
  getPendingCreators,
  getOnboardedCreators,
  approveCreatorOnboarding,
  rejectCreatorOnboarding,
  toggleCreatorRole,
  getAllCreatorDispatches,
  deleteCreatorDispatch,
  toggleDispatchVerification
} from '../controllers/admin.controller.js';

const router = Router();

// Secure all endpoints to ADMIN only
router.use(requireAuth, requireRole(['ADMIN']));

router.get('/stats', getDashboardStats);
router.get('/properties', getAllProperties);
router.put('/properties/:id/toggle-active', togglePropertyActive);
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

// Dedicated Super Admin Creator Panel & Moderation
router.get('/creators/pending', getPendingCreators);
router.get('/creators/onboarded', getOnboardedCreators);
router.post('/creators/:id/approve', approveCreatorOnboarding);
router.post('/creators/:id/reject', rejectCreatorOnboarding);
router.put('/creators/:id/role', toggleCreatorRole);
router.get('/creators/content', getAllCreatorDispatches);
router.delete('/creators/content/:id', deleteCreatorDispatch);
router.put('/creators/content/:id/toggle-verified', toggleDispatchVerification);

export default router;
