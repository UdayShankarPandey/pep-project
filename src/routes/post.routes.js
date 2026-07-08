import { Router } from 'express';
import multer from 'multer';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  deleteComment
} from '../controllers/post.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Configure multer to use memory storage for image uploading in post creation
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Post routes
router.post('/', protect, upload.single('image'), createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

// Like routes
router.post('/:id/like', protect, likePost);

// Comment routes
router.post('/:id/comments', protect, commentPost);
router.delete('/:id/comments/:commentId', protect, deleteComment);

export default router;
