import { Router } from 'express';
import { getBlogs, getBlogById } from '../controllers/blog.controller.js';

const router = Router();

router.get('/', getBlogs);
router.get('/:id', getBlogById);

export default router;
