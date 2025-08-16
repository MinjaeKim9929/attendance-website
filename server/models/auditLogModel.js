const auditLogSchema = mongoose.Schema(
	{
		entityType: {
			type: String,
			required: true,
			index: true,
		},
		entityId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			index: true,
		},
		action: {
			type: String,
			enum: ['create', 'update', 'delete', 'login', 'logout', 'invite', 'join', 'leave'],
			required: true,
			index: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		changes: [
			{
				field: { type: String, required: true },
				oldValue: { type: mongoose.Schema.Types.Mixed },
				newValue: { type: mongoose.Schema.Types.Mixed },
			},
		],
		metadata: {
			ipAddress: { type: String },
			userAgent: { type: String },
			source: {
				type: String,
				enum: ['web', 'mobile', 'api', 'system'],
				default: 'web',
			},
			sessionId: { type: String },
			requestId: { type: String },
		},
		severity: {
			type: String,
			enum: ['low', 'medium', 'high', 'critical'],
			default: 'low',
			index: true,
		},
		description: {
			type: String,
			maxlength: 1000,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

// Indexes for efficient querying
auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ severity: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 }); // For general time-based queries

// TTL index to auto-delete old logs (optional)
// auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 }); // 1 year

// Virtual populate
auditLogSchema.virtual('user', {
	ref: 'User',
	localField: 'userId',
	foreignField: '_id',
	justOne: true,
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
