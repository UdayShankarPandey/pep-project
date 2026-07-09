import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/upload.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Configure multer with memory storage and image-only file filter
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// POST /api/upload - Secure route for image upload
router.post('/', protect, upload.single('image'), uploadImage);

export default router;
