import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';

const router = Router();

// Protect all user routes
router.use(protect);

// Routes for /api/users
router.route('/')
  .post(createUser)
  .get(getUsers);

// Routes for /api/users/:id
router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

export default router;

