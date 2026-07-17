import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import imagekit from '../config/imagekit.js';
import AppError from '../errors/AppError.js';
import env from '../config/env.js';

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

export const authService = {
  async registerUser({ name, email, password }) {
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new AppError('User already exists with this email.', 400);
    }

    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    };
  },

  async loginUser({ email, password }) {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password.', 401);
    }

    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  },

  async getCurrentUser(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return user;
  },

  async updateProfilePicture(userId, file) {
    if (!file) {
      throw new AppError('No file uploaded.', 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const result = await imagekit.files.upload({
      file: file.buffer.toString('base64'),
      fileName: `avatar-${Date.now()}-${file.originalname}`,
      folder: '/avatars'
    });

    user.profilePicUrl = result.url;
    await user.save();

    return {
      profilePicUrl: user.profilePicUrl
    };
  }
};
