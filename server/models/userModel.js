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
		organizations: [
			{
				organizationId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Organization',
					required: true,
				},
				role: {
					type: String,
					enum: ['admin', 'member', 'moderator'],
					default: 'member',
				},
				joinAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		groups: [
			{
				groupId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Group',
					required: true,
				},
				role: {
					type: String,
					enum: ['moderator', 'member'],
					default: 'member',
				},
				joinAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		events: [
			{
				eventId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Event',
					required: true,
				},
			},
		],
		preferences: {
			language: {
				type: String,
				default: 'english',
			},
			timezone: {
				type: String,
				default: 'GMT',
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
				reminderMinutes: {
					type: Number,
					default: 15,
					min: [0, 'Reminder minutes cannot be negative'],
					max: [1440, 'Reminder minutes cannot exceed 24 hours'],
				},
			},
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

module.exports = mongoose.model('User', userSchema);
