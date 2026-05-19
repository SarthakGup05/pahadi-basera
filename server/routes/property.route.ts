import { Router } from 'express';
import {
  getProperties,
  createProperty,
  updateProperty,
  updatePropertyById,
  deleteProperty,
  deletePropertyById,
  getMyProperties,
  searchProperties,
  getPropertyById,
  getFeaturedProperties,
  getPopularProperties
} from '../controllers/property.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// --- Public Routes ---
router.get('/', getProperties);
router.get('/search', searchProperties);
router.get('/featured', getFeaturedProperties);
router.get('/popular', getPopularProperties);
router.get('/:id', getPropertyById);

// --- Protected Routes (Require Authentication) ---
router.get('/my-properties', requireAuth, getMyProperties);
router.post('/', requireAuth, createProperty);
router.put('/', requireAuth, updateProperty);
router.put('/:id', requireAuth, updatePropertyById);
router.delete('/', requireAuth, deleteProperty);
router.delete('/:id', requireAuth, deletePropertyById);

export default router;
