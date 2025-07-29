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
	getUserList,
};
