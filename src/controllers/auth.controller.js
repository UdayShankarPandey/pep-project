import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import imagekit from '../config/imagekit.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../errors/AppError.js';
import apiResponse from '../utils/apiResponse.js';
import env from '../config/env.js';

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

// Register a new user
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate request
  if (!name || !email || !password) {
    throw new AppError('All fields (name, email, password) are required.', 400);
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('User already exists with this email.', 400);
  }

  // Create the user — role is always 'user' on registration (prevent privilege escalation)
  const user = await User.create({
    name,
    email,
    password
    // role is NOT accepted from req.body — defaults to 'user' via schema
  });

  const token = generateToken(user._id);

  return apiResponse(res, 201, 'User registered successfully.', {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// Login user
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide both email and password.', 400);
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken(user._id);

  return apiResponse(res, 200, 'Login successful.', {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Get current logged-in user's profile
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return apiResponse(res, 200, 'User profile fetched successfully.', user);
});

// Update profile picture
export const updateProfilePic = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file uploaded.', 400);
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const result = await imagekit.files.upload({
    file: req.file.buffer.toString('base64'),
    fileName: `avatar-${Date.now()}-${req.file.originalname}`,
    folder: '/avatars'
  });

  user.profilePicUrl = result.url;
  await user.save();

  return apiResponse(res, 200, 'Profile picture updated successfully.', {
    profilePicUrl: user.profilePicUrl
  });
});
