const mongoose = require('mongoose');

const recordSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		eventId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Event',
			required: true,
			index: true,
		},
		groupId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Group',
			required: true,
			index: true,
		},
		organizationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			index: true,
		},
		status: {
			type: String,
			enum: ['present', 'absent', 'late', 'excused', 'partial', 'pending'],
			required: true,
			index: true,
		},
		checkIn: {
			timestamp: {
				type: Date,
				index: true,
			},
			method: {
				type: String,
				enum: ['manual', 'self', 'qr', 'nfc', 'geolocation', 'biometric', 'admin'],
				default: 'manual',
			},
			location: {
				lat: { type: Number, min: -90, max: 90 },
				lng: { type: Number, min: -180, max: 180 },
				accuracy: { type: Number, min: 0 },
			},
			deviceInfo: {
				type: { type: String }, // 'mobile', 'tablet', 'desktop'
				browser: { type: String },
				ip: { type: String },
				userAgent: { type: String },
			},
			verificationData: {
				qrCode: { type: String },
				nfcTag: { type: String },
				biometricHash: { type: String, select: false },
			},
		},
		checkOut: {
			timestamp: {
				type: Date,
				index: true,
			},
			method: {
				type: String,
				enum: ['manual', 'self', 'qr', 'nfc', 'auto', 'admin'],
				default: 'manual',
			},
			location: {
				lat: { type: Number, min: -90, max: 90 },
				lng: { type: Number, min: -180, max: 180 },
				accuracy: { type: Number, min: 0 },
			},
		},
		duration: {
			planned: { type: Number, min: 0 }, // Expected duration in minutes
			actual: { type: Number, min: 0 }, // Actual duration in minutes
		},
		attendance: {
			percentage: {
				type: Number,
				min: 0,
				max: 100,
				default: 0,
			},
			lateMinutes: {
				type: Number,
				min: 0,
				default: 0,
			},
			earlyLeaveMinutes: {
				type: Number,
				min: 0,
				default: 0,
			},
		},
		note: {
			content: {
				type: String,
				maxlength: [1000, 'Note cannot exceed 1000 characters'],
				trim: true,
				default: '',
			},
			isPublic: { type: Boolean, default: false },
			addedBy: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			addedAt: { type: Date, default: Date.now },
		},
		excuse: {
			reason: {
				type: String,
				enum: ['sick', 'personal', 'work', 'family', 'travel', 'technical', 'other'],
			},
			description: {
				type: String,
				maxlength: [500, 'Excuse description cannot exceed 500 characters'],
				trim: true,
			},
			documentation: [
				{
					name: { type: String, required: true },
					url: { type: String, required: true },
					uploadedAt: { type: Date, default: Date.now },
				},
			],
			approvalStatus: {
				type: String,
				enum: ['pending', 'approved', 'rejected'],
				default: 'pending',
			},
			reviewedBy: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			reviewedAt: { type: Date },
			reviewNote: { type: String, maxlength: 500, trim: true },
		},
		recordedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		lastModifiedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		flags: {
			isManualEntry: { type: Boolean, default: false },
			isSystemGenerated: { type: Boolean, default: false },
			hasDiscrepancy: { type: Boolean, default: false },
			requiresReview: { type: Boolean, default: false },
			isLocked: { type: Boolean, default: false },
		},
		metadata: {
			eventStartTime: { type: Date },
			eventEndTime: { type: Date },
			submissionDeadline: { type: Date },
			version: { type: Number, default: 1 },
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

// Compound indexes for better performance and uniqueness
recordSchema.index({ userId: 1, eventId: 1 }, { unique: true });
recordSchema.index({ eventId: 1, status: 1 });
recordSchema.index({ userId: 1, createdAt: -1 });
recordSchema.index({ organizationId: 1, groupId: 1, createdAt: -1 });
recordSchema.index({ status: 1, 'checkIn.timestamp': 1 });
recordSchema.index({ 'flags.requiresReview': 1, createdAt: -1 });

// Virtual populate for relationships
recordSchema.virtual('user', {
	ref: 'User',
	localField: 'userId',
	foreignField: '_id',
	justOne: true,
});

recordSchema.virtual('event', {
	ref: 'Event',
	localField: 'eventId',
	foreignField: '_id',
	justOne: true,
});

recordSchema.virtual('group', {
	ref: 'Group',
	localField: 'groupId',
	foreignField: '_id',
	justOne: true,
});

recordSchema.virtual('organization', {
	ref: 'Organization',
	localField: 'organizationId',
	foreignField: '_id',
	justOne: true,
});

recordSchema.virtual('auditLogs', {
	ref: 'AuditLog',
	localField: '_id',
	foreignField: 'entityId',
	match: { entityType: 'Record' },
});

// Virtual fields for computed data
recordSchema.virtual('totalDuration').get(function () {
	if (!this.checkIn.timestamp) return 0;

	const endTime = this.checkOut.timestamp || new Date();
	const startTime = this.checkIn.timestamp;

	return Math.max(0, Math.round((endTime - startTime) / (1000 * 60))); // in minutes
});

recordSchema.virtual('isLate').get(function () {
	if (!this.checkIn.timestamp || !this.metadata.eventStartTime) return false;
	return this.checkIn.timestamp > this.metadata.eventStartTime;
});

recordSchema.virtual('isEarlyLeave').get(function () {
	if (!this.checkOut.timestamp || !this.metadata.eventEndTime) return false;
	return this.checkOut.timestamp < this.metadata.eventEndTime;
});

recordSchema.virtual('attendanceScore').get(function () {
	let score = 0;

	switch (this.status) {
		case 'present':
			score = 100;
			break;
		case 'late':
			score = Math.max(50, 100 - this.attendance.lateMinutes * 2); // 2 points per minute late
			break;
		case 'partial':
			score = this.attendance.percentage || 50;
			break;
		case 'excused':
			score = this.excuse.approvalStatus === 'approved' ? 80 : 0;
			break;
		case 'absent':
		default:
			score = 0;
			break;
	}

	return Math.max(0, Math.min(100, score));
});

// Pre-save middleware
recordSchema.pre('save', function (next) {
	// Auto-calculate actual duration
	if (this.checkIn.timestamp && this.checkOut.timestamp) {
		this.duration.actual = Math.round((this.checkOut.timestamp - this.checkIn.timestamp) / (1000 * 60));
	}

	// Calculate late minutes
	if (this.checkIn.timestamp && this.metadata.eventStartTime) {
		const lateMs = this.checkIn.timestamp - this.metadata.eventStartTime;
		this.attendance.lateMinutes = Math.max(0, Math.round(lateMs / (1000 * 60)));
	}

	// Calculate early leave minutes
	if (this.checkOut.timestamp && this.metadata.eventEndTime) {
		const earlyMs = this.metadata.eventEndTime - this.checkOut.timestamp;
		this.attendance.earlyLeaveMinutes = Math.max(0, Math.round(earlyMs / (1000 * 60)));
	}

	// Auto-determine status based on attendance data
	if (this.isNew && this.status === 'pending') {
		if (this.checkIn.timestamp) {
			if (this.attendance.lateMinutes > 0) {
				this.status = 'late';
			} else {
				this.status = 'present';
			}
		}
	}

	// Calculate attendance percentage for partial attendance
	if (this.duration.planned && this.duration.actual) {
		this.attendance.percentage = Math.min(100, Math.round((this.duration.actual / this.duration.planned) * 100));
	}

	next();
});

// Pre-save validation
recordSchema.pre('save', function (next) {
	// Validate check-out is after check-in
	if (this.checkIn.timestamp && this.checkOut.timestamp) {
		if (this.checkOut.timestamp <= this.checkIn.timestamp) {
			return next(new Error('Check-out time must be after check-in time'));
		}
	}

	// Validate excuse requirements
	if (this.status === 'excused' && !this.excuse.reason) {
		return next(new Error('Excused attendance must have a reason'));
	}

	next();
});

module.exports = mongoose.model('Record', recordSchema);
