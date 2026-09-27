import { Router } from 'express';
import { getBlogs, getBlogById, createBlogPost, likeBlogPost } from '../controllers/blog.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/', requireAuth, createBlogPost);
router.post('/:id/like', likeBlogPost);

export default router;
