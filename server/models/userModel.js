const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'First Name is required'],
			maxlength: [50, 'First name cannot be more than 50 characters'],
			trim: true,
		},
		lastName: {
			type: String,
			required: [true, 'Last Name is required'],
			maxlength: [50, 'Last name cannot be more than 50 characters'],
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
			index: true,
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: [6, 'Password must be at least 6 characters'],
			select: false,
		},
		dateOfBirth: {
			type: Date,
			required: [true, 'Date of Birth is required'],
		},
		profileImage: {
			type: String,
			default: null,
		},
		preferences: {
			language: {
				type: String,
				default: 'en',
				enum: ['en', 'ko', 'es', 'fr', 'de', 'ja'],
			},
			timezone: {
				type: String,
				default: 'GMT-04:00',
				validate: {
					validator: function (v) {
						return /^GMT[+-]\d{2}:\d{2}$/.test(v);
					},
					message: 'Invalid timezone format. Use GMT±HH:MM',
				},
			},
			notifications: {
				email: {
					type: Boolean,
					default: true,
				},
				push: {
					type: Boolean,
					default: true,
				},
				sms: {
					type: Boolean,
					default: false,
				},
				reminderMinutes: {
					type: Number,
					default: 15,
					min: [0, 'Reminder minutes cannot be negative'],
					max: [1440, 'Reminder minutes cannot exceed 24 hours'],
				},
			},
			theme: {
				type: String,
				enum: ['light', 'dark', 'auto'],
				default: 'auto',
			},
		},
		phoneNumber: {
			type: String,
			trim: true,
			match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'],
		},
		lastLoginAt: {
			type: Date,
		},
		emailVerified: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Indexes for better performance
userSchema.index({ isActive: 1 });
userSchema.index({ lastLoginAt: -1 });

// Virtual fields
userSchema.virtual('fullName').get(function () {
	return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.virtual('age').get(function () {
	if (!this.dateOfBirth) return null;
	const today = new Date();
	let age = today.getFullYear() - this.dateOfBirth.getFullYear();
	const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();

	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())) {
		age--;
	}

	return age;
});

// Virtual populate for relationships
userSchema.virtual('organizations', {
	ref: 'Membership',
	localField: '_id',
	foreignField: 'userId',
	match: { entityType: 'organization', status: 'active' },
});

userSchema.virtual('groups', {
	ref: 'Membership',
	localField: '_id',
	foreignField: 'userId',
	match: { entityType: 'group', status: 'active' },
});

userSchema.virtual('events', {
	ref: 'Membership',
	localField: '_id',
	foreignField: 'userId',
	match: { entityType: 'event', status: 'active' },
});

module.exports = mongoose.model('User', userSchema);
