const mongoose = require('mongoose');

const membershipSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		entityType: {
			type: String,
			enum: ['organization', 'group', 'event'],
			required: true,
			index: true,
		},
		entityId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			refPath: 'entityModel',
			index: true,
		},
		entityModel: {
			type: String,
			required: true,
			enum: ['Organization', 'Group', 'Event'],
		},
		role: {
			type: String,
			enum: ['admin', 'moderator', 'member'],
			default: 'member',
			index: true,
		},
		status: {
			type: String,
			enum: ['active', 'inactive', 'pending', 'suspended'],
			default: 'active',
			index: true,
		},
		permissions: [
			{
				type: String,
				enum: [
					'view',
					'edit',
					'delete',
					'invite',
					'manage_members',
					'manage_events',
					'manage_settings',
					'view_reports',
					'export_data',
				],
			},
		],
		joinedAt: {
			type: Date,
			default: Date.now,
			index: true,
		},
		addedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		inviteToken: {
			type: String,
			sparse: true,
		},
		inviteExpiry: {
			type: Date,
		},
		lastActivity: {
			type: Date,
			default: Date.now,
		},
		metadata: {
			inviteSource: { type: String }, // 'email', 'link', 'qr', 'manual'
			joinSource: { type: String }, // 'invite', 'request', 'direct'
			notes: { type: String, maxlength: 500, trim: true },
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Compound indexes
membershipSchema.index({ userId: 1, entityType: 1, entityId: 1 }, { unique: true });
membershipSchema.index({ entityType: 1, entityId: 1, role: 1 });
membershipSchema.index({ entityType: 1, entityId: 1, status: 1 });
membershipSchema.index({ userId: 1, status: 1 });
membershipSchema.index({ inviteToken: 1 }, { sparse: true });

// Virtual populate
membershipSchema.virtual('user', {
	ref: 'User',
	localField: 'userId',
	foreignField: '_id',
	justOne: true,
});

module.exports = mongoose.model('Membership', membershipSchema);
