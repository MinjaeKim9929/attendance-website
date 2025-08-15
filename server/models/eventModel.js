const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Event name is required'],
			maxlength: [100, 'Event name cannot be more than 50 characters'],
			trim: true,
			index: true,
		},
		description: {
			type: String,
			maxlength: [250, 'Description cannot exceed 250 characters'],
			trim: true,
			default: '',
		},
		organization: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
		},
		group: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Group',
			required: true,
		},
		users: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
				joinedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		schedule: {
			startDate: {
				type: Date,
				default: Date.now,
				required: true,
			},
			endDate: {
				type: Date,
				default: null,
			},
			startTime: {
				type: String,
			},
			endTime: {
				type: String,
			},
		},
		settings: {
			timezone: {
				type: String,
				default: 'GMT+00:00',
			},
			isMandatory: {
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
				max: [24, 'Auto mark absent hours cannot exceed 1 day'],
			},
			allowSelfCheckIn: {
				type: Boolean,
				default: false,
			},
			lateThresholdMinutes: {
				type: Number,
				default: 60,
				min: 0,
			},
		},
		stats: {
			totalInvited: {
				type: Number,
				default: 0,
				min: 0,
			},
			totalPresent: {
				type: Number,
				default: 0,
				min: 0,
			},
			totalAbsent: {
				type: Number,
				default: 0,
				min: 0,
			},
			attendanceRate: {
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

module.exports = mongoose.model('Event', eventSchema);
