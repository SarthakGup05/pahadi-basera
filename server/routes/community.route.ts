import { Router } from 'express';
import { 
  getTrails, 
  getThreads, 
  getRecipes, 
  createThread, 
  upvoteThread 
} from '../controllers/community.controller.js';

const router = Router();

router.get('/trails', getTrails);
router.get('/threads', getThreads);
router.get('/recipes', getRecipes);
router.post('/threads', createThread);
router.post('/threads/:id/upvote', upvoteThread);

export default router;
