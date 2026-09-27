import { Router } from 'express';
import { 
  getPackages, 
  getAdminPackages,
  getPackageById, 
  createPackage, 
  updatePackage, 
  togglePackageActive, 
  deletePackage 
} from '../controllers/package.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// --- Public Routes ---
router.get('/get-all-packages', getPackages);
router.get('/get-package/:id', getPackageById);

// --- Protected Admin Routes ---
router.get('/admin/all', requireAuth, requireRole(['ADMIN']), getAdminPackages);
router.post('/create-package', requireAuth, requireRole(['ADMIN']), createPackage);
router.put('/update-package/:id', requireAuth, requireRole(['ADMIN']), updatePackage);
router.put('/toggle-active/:id', requireAuth, requireRole(['ADMIN']), togglePackageActive);
router.delete('/delete-package/:id', requireAuth, requireRole(['ADMIN']), deletePackage);

export default router;
