const mongoose = require('mongoose');

const recordSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		eventId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Event',
			required: true,
		},
		groupId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Group',
			required: true,
		},
		organizationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
		},

		status: {
			type: String,
			enum: ['present', 'absent', 'late', 'excused', 'partial'],
		},
		checkIn: {
			time: {
				type: Date,
				default: Date.now,
			},
			method: {
				type: String,
				enum: ['self', 'admin'],
			},
		},
		checkOut: {
			time: {
				type: Date,
				default: Date.now,
			},
			method: {
				type: String,
				enum: ['self', 'admin'],
			},
		},
		note: {
			type: String,
			default: '',
		},
		recordedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		modifications: [
			{
				field: {
					type: String,
					default: 'status',
				},
				oldValue: {
					type: String,
				},
				newValue: {
					type: String,
				},
				modifiedBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
				reason: {
					type: String,
				},
				modifiedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		stats: {
			durationMinute: {
				type: Number,
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

module.exports = mongoose.model('Record', recordSchema);
