import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Route for register: POST /api/auth/register
router.post('/register', register);

// Route for login: POST /api/auth/login
router.post('/login', login);

// Route for getting current user profile: GET /api/auth/me
router.get('/me', protect, getMe);

export default router;

