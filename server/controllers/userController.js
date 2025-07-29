const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
const signupUser = asyncHandler(async (req, res) => {
	const { firstName, lastName, email, password, role, dateOfBirth, adminCode } = req.body;

	if (!firstName || !lastName || !email || !password || !role || !dateOfBirth) {
		res.status(400);
		throw new Error('Please add all fields');
	}

	// Check if user exists
	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error('User already exists');
	}

	//  Validate date of Birth
	const dob = new Date(dateOfBirth);
	if (isNaN(dob.getTime())) {
		res.status(400);
		throw new Error('Invalid date of birth');
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
		role,
		dateOfBirth: dob,
	});

	if (user) {
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '30d',
		});

		res.status(201).json({
			_id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			role: user.role,
			dateOfBirth: user.dateOfBirth,
			token,
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400);
		throw new Error('Email and password is required');
	}

	const user = await User.findOne({ email }).select('+password');

	if (user && (await bcrypt.compare(password, user.password))) {
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '30d',
		});

		res.json({
			_id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			role: user.role,
			dateOfBirth: user.dateOfBirth,
			token,
		});
	} else {
		res.status(401);
		throw new Error('Invalid email or password');
	}
});

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
	res.status(200).json({
		success: true,
		data: {
			_id: req.user._id,
			firstName: req.user.firstName,
			lastName: req.user.lastName,
			email: req.user.email,
			role: req.user.role,
			dateOfBirth: req.user.dateOfBirth,
			createdAt: req.user.createdAt,
			updatedAt: req.user.updatedAt,
		},
	});
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
	const { firstName, lastName, dateOfBirth } = req.body;

	const user = await User.findById(req.user._id);

	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}

	// Update fields if provided
	if (firstName) user.firstName = firstName;
	if (lastName) user.lastName = lastName;
	if (dateOfBirth) {
		const dob = new Date(dateOfBirth);
		if (isNaN(dob.getTime())) {
			res.status(400);
			throw new Error('Invalid date of birth');
		}

		// Check age requirement
		const today = new Date();
		const minAge = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
		if (dob > minAge) {
			res.status(400);
			throw new Error('User must be at least 16 years old');
		}

		user.dateOfBirth = dob;
	}

	const updatedUser = await user.save();

	res.status(200).json({
		success: true,
		message: 'Profile updated successfully',
		data: {
			_id: updatedUser._id,
			firstName: updatedUser.firstName,
			lastName: updatedUser.lastName,
			email: updatedUser.email,
			role: updatedUser.role,
			dateOfBirth: updatedUser.dateOfBirth,
			updatedAt: updatedUser.updatedAt,
		},
	});
});

// @desc    Get user list
// @route   GET /api/users/list
// @access  Private
const getUserList = asyncHandler(async (req, res) => {
	try {
		const users = await User.find({}).select('-password');
		res.status(200).json({
			success: true,
			count: users.length,
			data: users,
		});
	} catch (error) {
		res.status(500);
		throw new Error('Server Error');
	}
});

module.exports = {
	signupUser,
	loginUser,
	getMe,
	updateProfile,
	getUserList,
};
