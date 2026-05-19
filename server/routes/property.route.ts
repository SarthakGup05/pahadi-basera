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
router.get('/get-all-properties', getProperties);
router.get('/search-properties', searchProperties);
router.get('/featured-properties', getFeaturedProperties);
router.get('/popular-properties', getPopularProperties);
router.get('/get-property/:id', getPropertyById);

// --- Protected Routes (Require Authentication) ---
router.get('/my-properties', requireAuth, getMyProperties);
router.post('/create-property', requireAuth, createProperty);
router.put('/update-property', requireAuth, updateProperty);
router.put('/update-property/:id', requireAuth, updatePropertyById);
router.delete('/delete-property', requireAuth, deleteProperty);
router.delete('/delete-property/:id', requireAuth, deletePropertyById);

export default router;
