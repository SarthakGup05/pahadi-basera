import { Router } from 'express';
import multer from 'multer';
import { 
  getImageKitAuth, 
  uploadMedia, 
  deleteMedia 
} from '../controllers/media.controller.js';

const router = Router();

// Multer memory storage (keeps file in RAM buffer for direct streaming to ImageKit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB maximum file size
  },
  fileFilter: (_req, file, cb) => {
    // Whitelist valid web image formats
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, HEIC) are permitted'));
    }
  },
});

// Authentication parameters for direct client-to-ImageKit upload
router.get('/imagekit-auth', getImageKitAuth);

// Server-side fallback upload endpoint
router.post('/upload', upload.single('file'), uploadMedia);

// Delete asset from ImageKit by fileId
router.delete('/:fileId', deleteMedia);

export default router;
