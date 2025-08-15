const mongoose = require('mongoose');

const groupSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Group name is required'],
			maxlength: [100, 'Group name cannot be more than 50 characters'],
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
		members: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required,
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
					required,
				},
				addedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		settings: {
			isPrivate: {
				type: Boolean,
				default: false,
			},
			allowMemberInvites: {
				type: Boolean,
				default: false,
			},
			allowCustomPolicy: {
				type: Boolean,
				default: false,
			},
			attendancePolicy: {
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
		},
		stats: {
			totalMembers: {
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

module.exports = mongoose.model('Group', groupSchema);
