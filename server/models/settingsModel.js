const settingsSchema = mongoose.Schema(
	{
		entityType: {
			type: String,
			enum: ['organization', 'group', 'event'],
			required: true,
			index: true,
		},
		entityId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			index: true,
		},
		// General Settings
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
		language: {
			type: String,
			default: 'en',
			enum: ['en', 'ko', 'es', 'fr', 'de', 'ja'],
		},
		// Attendance Policy
		attendancePolicy: {
			allowLateCheckIn: { type: Boolean, default: true },
			autoMarkAbsentHours: {
				type: Number,
				default: 0,
				min: [0, 'Auto mark absent hours cannot be negative'],
				max: [168, 'Auto mark absent hours cannot exceed 1 week'],
			},
			allowSelfCheckIn: { type: Boolean, default: false },
			lateThresholdMinutes: { type: Number, default: 15, min: 0 },
			requireCheckOut: { type: Boolean, default: false },
			allowExcuses: { type: Boolean, default: true },
			excuseRequiresApproval: { type: Boolean, default: true },
		},
		// Privacy & Access
		privacy: {
			isPrivate: { type: Boolean, default: false },
			allowMemberInvites: { type: Boolean, default: false },
			allowCustomPolicy: { type: Boolean, default: false },
			publicProfile: { type: Boolean, default: true },
			showMemberList: { type: Boolean, default: true },
		},
		// Notifications
		notifications: {
			email: {
				enabled: { type: Boolean, default: true },
				events: {
					memberJoined: { type: Boolean, default: true },
					eventCreated: { type: Boolean, default: true },
					eventUpdated: { type: Boolean, default: true },
					attendanceReminder: { type: Boolean, default: true },
				},
			},
			push: {
				enabled: { type: Boolean, default: true },
				events: {
					memberJoined: { type: Boolean, default: false },
					eventCreated: { type: Boolean, default: true },
					eventUpdated: { type: Boolean, default: true },
					attendanceReminder: { type: Boolean, default: true },
				},
			},
			sms: {
				enabled: { type: Boolean, default: false },
				events: {
					attendanceReminder: { type: Boolean, default: false },
					emergencyAlerts: { type: Boolean, default: true },
				},
			},
		},
		// Integration Settings
		integrations: {
			calendar: {
				enabled: { type: Boolean, default: false },
				provider: { type: String, enum: ['google', 'outlook', 'apple'] },
				syncEvents: { type: Boolean, default: true },
			},
			sso: {
				enabled: { type: Boolean, default: false },
				provider: { type: String, enum: ['google', 'microsoft', 'okta'] },
				domain: { type: String },
			},
		},
		// Custom Fields
		customFields: [
			{
				name: { type: String, required: true, trim: true },
				type: {
					type: String,
					enum: ['text', 'number', 'date', 'boolean', 'select'],
					required: true,
				},
				required: { type: Boolean, default: false },
				options: [{ type: String }], // For select type
				defaultValue: { type: mongoose.Schema.Types.Mixed },
			},
		],
		// Reporting Settings
		reporting: {
			defaultPeriod: {
				type: String,
				enum: ['week', 'month', 'quarter', 'year'],
				default: 'month',
			},
			autoGenerate: { type: Boolean, default: false },
			recipients: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			],
		},
		// Backup & Archive
		dataRetention: {
			deleteAfterDays: { type: Number, min: 30, default: 365 },
			archiveAfterDays: { type: Number, min: 90, default: 730 },
			autoBackup: { type: Boolean, default: true },
		},
	},
	{
		timestamps: true,
	}
);

// Compound index for uniqueness
settingsSchema.index({ entityType: 1, entityId: 1 }, { unique: true });

module.exports = mongoose.model('Settings', settingsSchema);
