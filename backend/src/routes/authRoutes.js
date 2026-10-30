
import express from 'express';
import {
    signup,
    login,
    getProfile,
    updateProfile
} from '../controllers/authController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Signup
router.post('/signup', signup);

// Login
router.post('/login', login);

// Get user profile
router.get('/profile', authMiddleware, getProfile);

// Update user profile
router.put('/profile', authMiddleware, updateProfile);

export default router;
