import { Router } from 'express';
import { 
  getNotifications, 
  markAllAsRead, 
  markSingleAsRead, 
  createNotification 
} from '../controllers/notification.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all notification routes to ADMIN only
router.use(requireAuth, requireRole(['ADMIN']));

router.get('/', getNotifications);
router.put('/mark-read', markAllAsRead);
router.put('/:id/mark-read', markSingleAsRead);
router.post('/create', createNotification);

export default router;
