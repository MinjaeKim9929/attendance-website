const express = require('express');
const router = express.Router();
const { loginUser, getUserList, signupUser, getMe, updateProfile } = require('../controllers/userController');
const { protect, adminOnly, userOrAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', signupUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getMe);

// Admin only routes
router.get('/list', protect, adminOnly, getUserList);

module.exports = router;
