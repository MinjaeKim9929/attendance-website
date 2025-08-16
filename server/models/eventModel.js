const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Event name is required'],
			maxlength: [100, 'Event name cannot be more than 100 characters'],
			trim: true,
			index: true,
		},
		description: {
			type: String,
			maxlength: [1000, 'Description cannot exceed 1000 characters'],
			trim: true,
			default: '',
		},
		organizationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			index: true,
		},
		groupId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Group',
			required: true,
			index: true,
		},
		eventCode: {
			type: String,
			unique: true,
			lower: true,
			sparse: true,
			validate: {
				validator: function (v) {
					if (!v) return true;
					return /^[A-Z0-9]{6,12}$/.test(v);
				},
				message: 'Event code must be 6-12 lowercase alphanumeric characters',
			},
		},
		category: {
			type: String,
			enum: [
				'meeting',
				'training',
				'workshop',
				'conference',
				'seminar',
				'presentation',
				'social',
				'sports',
				'volunteer',
				'other',
			],
			default: 'meeting',
		},
		priority: {
			type: String,
			enum: ['low', 'medium', 'high', 'critical'],
			default: 'medium',
		},
		schedule: {
			startDateTime: {
				type: Date,
				required: true,
				index: true,
			},
			endDateTime: {
				type: Date,
				validate: {
					validator: function (v) {
						return !v || v > this.schedule.startDateTime;
					},
					message: 'End date must be after start date',
				},
			},
			timezone: {
				type: String,
				default: 'GMT+00:00',
				validate: {
					validator: function (v) {
						return /^GMT[+-]\d{2}:\d{2}$/.test(v);
					},
					message: 'Invalid timezone format. Use GMT±HH:MM',
				},
			},
			recurrence: {
				type: {
					type: String,
					enum: ['none', 'daily', 'weekly', 'monthly', 'yearly', 'selected'],
					default: 'none',
				},
				interval: { type: Number, default: 1, min: 1 },
				endDate: { type: Date },
				maxOccurrences: { type: Number, min: 1 },
			},
		},
		location: {
			type: {
				type: String,
				enum: ['physical', 'virtual', 'hybrid'],
				default: 'physical',
			},
			venue: { type: String, trim: true },
			address: { type: String, trim: true },
			room: { type: String, trim: true },
			floor: { type: String, trim: true },
			coordinates: {
				lat: { type: Number, min: -90, max: 90 },
				lng: { type: Number, min: -180, max: 180 },
			},
			virtualLink: {
				type: String,
				validate: {
					validator: function (v) {
						if (!v) return true;
						return /^https?:\/\/.+/.test(v);
					},
					message: 'Please provide a valid URL',
				},
			},
			accessCode: { type: String, trim: true },
		},
		capacity: {
			max: {
				type: Number,
				min: [1, 'Maximum capacity must be at least 1'],
			},
			waitlist: {
				enabled: { type: Boolean, default: false },
				maxSize: { type: Number, min: 0 },
			},
		},
		attendance: {
			required: { type: Boolean, default: true },
			checkInMethod: {
				type: String,
				enum: ['manual', 'qr', 'nfc', 'geolocation', 'biometric'],
				default: 'manual',
			},
			allowLateCheckIn: { type: Boolean, default: true },
			lateThresholdMinutes: { type: Number, default: 15, min: 0 },
			autoMarkAbsentMinutes: { type: Number, default: 0, min: 0 },
			allowSelfCheckIn: { type: Boolean, default: false },
			requireCheckOut: { type: Boolean, default: false },
		},
		notifications: {
			reminder: {
				enabled: { type: Boolean, default: true },
				beforeMinutes: [{ type: Number, min: 0 }], // Array of reminder times
				methods: [
					{
						type: String,
						enum: ['email', 'push', 'sms'],
					},
				],
			},
			updates: {
				enabled: { type: Boolean, default: true },
				methods: [
					{
						type: String,
						enum: ['email', 'push', 'sms'],
					},
				],
			},
		},
		materials: [
			{
				name: { type: String, required: true, trim: true },
				type: {
					type: String,
					enum: ['document', 'presentation', 'video', 'audio', 'image', 'link', 'other'],
					required: true,
				},
				url: { type: String, required: true },
				size: { type: Number }, // in bytes
				uploadedAt: { type: Date, default: Date.now },
				uploadedBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
			},
		],
		status: {
			type: String,
			enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled', 'postponed'],
			default: 'draft',
			index: true,
		},
		visibility: {
			type: String,
			enum: ['public', 'private', 'restricted'],
			default: 'private',
		},
		tags: [
			{
				type: String,
				lowercase: true,
				trim: true,
				maxlength: [30, 'Tag cannot exceed 30 characters'],
			},
		],
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		lastModifiedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
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
eventSchema.index({ organizationId: 1, groupId: 1 });
eventSchema.index({ 'schedule.startDateTime': 1, status: 1 });
eventSchema.index({ status: 1, isActive: 1 });
eventSchema.index({ createdBy: 1, createdAt: -1 });
eventSchema.index({ name: 'text', description: 'text' });
eventSchema.index({ category: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ eventCode: 1 }, { sparse: true });

// Virtual populate for relationships
eventSchema.virtual('organization', {
	ref: 'Organization',
	localField: 'organizationId',
	foreignField: '_id',
	justOne: true,
});

eventSchema.virtual('group', {
	ref: 'Group',
	localField: 'groupId',
	foreignField: '_id',
	justOne: true,
});

eventSchema.virtual('participants', {
	ref: 'Membership',
	localField: '_id',
	foreignField: 'entityId',
	match: { entityType: 'event', status: 'active' },
});

eventSchema.virtual('attendanceRecords', {
	ref: 'Record',
	localField: '_id',
	foreignField: 'eventId',
});

eventSchema.virtual('settings', {
	ref: 'Settings',
	localField: '_id',
	foreignField: 'entityId',
	match: { entityType: 'event' },
	justOne: true,
});

// Virtual fields for computed data
eventSchema.virtual('duration').get(function () {
	if (!this.schedule.endDateTime) return null;
	return Math.round((this.schedule.endDateTime - this.schedule.startDateTime) / (1000 * 60)); // in minutes
});

eventSchema.virtual('isUpcoming').get(function () {
	return this.schedule.startDateTime > new Date() && this.status !== 'cancelled';
});

eventSchema.virtual('isOngoing').get(function () {
	const now = new Date();
	return (
		this.schedule.startDateTime <= now &&
		(!this.schedule.endDateTime || this.schedule.endDateTime >= now) &&
		this.status === 'ongoing'
	);
});

eventSchema.virtual('isPast').get(function () {
	const endTime = this.schedule.endDateTime || this.schedule.startDateTime;
	return endTime < new Date();
});

eventSchema.virtual('canCheckIn').get(function () {
	const now = new Date();
	const startTime = this.schedule.startDateTime;
	const lateThreshold = this.attendance.lateThresholdMinutes * 60 * 1000; // convert to milliseconds

	if (this.attendance.allowLateCheckIn) {
		return now >= startTime && now <= startTime.getTime() + lateThreshold;
	}
	return now >= startTime;
});

// Pre-save middleware to generate event code
eventSchema.pre('save', function (next) {
	if (this.isNew && !this.eventCode) {
		const { nanoid } = require('nanoid');
		this.eventCode = nanoid(8).toUpperCase();
	}
	next();
});

// Pre-save validation
eventSchema.pre('save', function (next) {
	// Validate recurrence settings
	if (this.schedule.recurrence.type !== 'none') {
		if (!this.schedule.recurrence.endDate && !this.schedule.recurrence.maxOccurrences) {
			return next(new Error('Recurring events must have either an end date or max occurrences'));
		}
	}

	// Validate virtual event requirements
	if (this.location.type === 'virtual' && !this.location.virtualLink) {
		return next(new Error('Virtual events must have a virtual link'));
	}

	next();
});

module.exports = mongoose.model('Event', eventSchema);
