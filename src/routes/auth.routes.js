import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

// Route for register: POST /api/auth/register
router.post('/register', register);

// Route for login: POST /api/auth/login
router.post('/login', login);

export default router;
