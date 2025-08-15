const mongoose = require('mongoose');

const organizationSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Organization name is required'],
			maxlength: [100, 'Organization name cannot be more than 50 characters'],
			trim: true,
			index: true,
		},
		description: {
			type: String,
			maxlength: [250, 'Description cannot exceed 250 characters'],
			trim: true,
			default: '',
		},
		organizationCode: {
			type: String,
			required: true,
		},
		logo: {
			type: String,
			default: null,
		},
		admins: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
				addedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		moderators: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
				addedAt: {
					type: Date,
					default: Date.now,
				},
				addedBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			},
		],
		settings: {
			timezone: {
				type: String,
				default: 'GMT+00:00',
			},
			attendancePolicy: {
				allowCustomPolicy: {
					type: Boolean,
					default: false,
				},
				allowLateCheckIn: {
					type: Boolean,
					default: true,
				},
				autoMarkAbsentHours: {
					type: Number,
					default: 0,
					min: [0, 'Auto mark absent hours cannot be negative'],
					max: [168, 'Auto mark absent hours cannot exceed 1 weeks'],
				},
				allowSelfCheckIn: {
					type: Boolean,
					default: false,
				},
				lateThresholdMinutes: {
					type: Number,
					default: 15,
					min: 0,
				},
			},
		},
		stats: {
			totalMembers: {
				type: Number,
				default: 0,
				min: 0,
			},
			totalGroups: {
				type: Number,
				default: 0,
				min: 0,
			},
			activeEvents: {
				type: Number,
				default: 0,
				min: 0,
			},
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Organization', organizationSchema);
