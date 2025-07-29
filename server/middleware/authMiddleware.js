const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Protect routes middleware
const protect = asyncHandler(async (req, res, next) => {
	let token;

	if (req.header.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			// Get token from header
			token = req.headers.authorization.split(' ')[1];

			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Get user from the token
			req.user = await User.findById(decoded.id).select('-password');

			if (!req.user) {
				res.status(401);
				throw new Error('User not found');
			}

			next();
		} catch (err) {
			console.error('Auth middleware error:', err);
			res.status(401);
			throw new Error('Not authorized, invalid token');
		}
	}

	if (!token) {
		res.status(401);
		throw new Error('Not authorized, no token');
	}
});

// Admin only middleware
const adminOnly = asyncHandler(async (req, res, next) => {
	if (req.user && req.user.role === 'admin') {
		next();
	} else {
		res.status(403);
		throw new Error('Access denied. Admin privileges required.');
	}
});

// User or Admin middleware (for routes that both can access)
const userOrAdmin = asyncHandler(async (req, res, next) => {
	if (req.user && (req.user.role === 'user' || req.user.role === 'admin')) {
		next();
	} else {
		res.status(403);
		throw new Error('Access denied. User or Admin privileges required.');
	}
});

module.exports = { protect, adminOnly, userOrAdmin };
