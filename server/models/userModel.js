const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'First Name is required'],
			maxlength: [50, 'First name cannot be more than 50 characters'],
		},
		lastName: {
			type: String,
			required: [true, 'Last Name is required'],
			maxlength: [50, 'Last name cannot be more than 50 characters'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: [6, 'Password must be at least 6 characters'],
			select: false,
		},
		role: {
			type: String,
			required: [true, 'Role is required'],
			enum: ['user', 'admin'],
			default: 'user',
		},
		dateOfBirth: {
			type: Date,
			required: [true, 'Date of Birth is required'],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('User', userSchema);
