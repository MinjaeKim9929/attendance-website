const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

// @desc		Register new user
// @route		POST /api/users/signup
// @access	Public
const signupUser = asyncHandler(async (req, res) => {
	// Check for validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400);
		throw new Error(
			'Validation failed: ' +
				errors
					.array()
					.map((err) => err.msg)
					.join(', ')
		);
	}

	const { firstName, lastName, email, password, dateOfBirth, phoneNumber, preferences } = req.body;

	// Check if user exists
	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error('User already exists with this email');
	}

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create user
	const user = await User.create({
		firstName,
		lastName,
		email,
		password: hashedPassword,
		dateOfBirth,
		phoneNumber,
		preferences: {
			language: preferences?.language || 'en',
			timezone: preferences?.timezone || 'GMT-04:00',
			theme: preferences?.theme || 'auto',
			notifications: {
				email: preferences?.notifications?.email !== undefined ? preferences.notifications.email : true,
				push: preferences?.notifications?.push !== undefined ? preferences.notifications.push : true,
				sms: preferences?.notifications?.sms !== undefined ? preferences.notifications.sms : false,
				reminderMinutes: preferences?.notifications?.reminderMinutes || 15,
			},
		},
	});
	if (user) {
		res.status(201).json({
			success: true,
			message: 'User registered successfully',
			user: {
				_id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				dateOfBirth: user.dateOfBirth,
				phoneNumber: user.phoneNumber,
				preferences: user.preferences,
				createdAt: user.createdAt,
			},
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
});

// @desc		Login user
// @route		POST /api/users/login
// @access	Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Check for user email
	const user = await User.findOne({ email }).select('+password');

	if (user && (await bcrypt.compare(password, user.password))) {
		res.json({
			success: true,
			message: 'Login successful',
			user: {
				_id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				preferences: user.preferences,
			},
			token: generateToken(user._id),
		});
	} else {
		res.status(401);
		throw new Error('Invalid email or password');
	}
});

module.exports = { signupUser, loginUser };
