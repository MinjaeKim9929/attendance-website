const mongoose = require('mongoose');

const groupSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Group name is required'],
			maxlength: [100, 'Group name cannot be more than 100 characters'],
			trim: true,
			index: true,
		},
		description: {
			type: String,
			maxlength: [500, 'Description cannot exceed 500 characters'],
			trim: true,
			default: '',
		},
		organizationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			index: true,
		},
		groupCode: {
			type: String,
			unique: true,
			lowercase: true,
			sparse: true,
			validate: {
				validator: function (v) {
					if (!v) return true;
					return /^[A-Z0-9]{4,8}$/.test(v);
				},
				message: 'Group code must be 4-8 lower alphanumeric characters',
			},
		},
		category: {
			type: String,
			enum: ['department', 'team', 'project', 'class', 'course', 'committee', 'club', 'division', 'branch', 'other'],
			default: 'other',
		},
		color: {
			type: String,
			match: [/^#[A-Fa-f0-9]{6}$/, 'Please provide a valid hex color'],
			default: '#3B82F6',
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
		visibility: {
			type: String,
			enum: ['public', 'private', 'hidden'],
			default: 'public',
		},
		joinPolicy: {
			type: String,
			enum: ['open', 'approval', 'invite_only'],
			default: 'approval',
		},
		parentGroup: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Group',
		},
		tags: [
			{
				type: String,
				lowercase: true,
				trim: true,
				maxlength: [30, 'Tag cannot exceed 30 characters'],
			},
		],
		location: {
			building: { type: String, trim: true },
			room: { type: String, trim: true },
			floor: { type: String, trim: true },
			address: { type: String, trim: true },
			coordinates: {
				lat: { type: Number, min: -90, max: 90 },
				lng: { type: Number, min: -180, max: 180 },
			},
		},
		schedule: {
			regularMeetings: {
				enabled: { type: Boolean, default: false },
				frequency: {
					type: String,
					enum: ['daily', 'weekly', 'biweekly', 'monthly', 'selected'],
				},
				dayOfWeek: {
					type: Number,
					min: 0, // Sunday
					max: 6, // Saturday
				},
				time: { type: String }, // HH:MM format
				duration: { type: Number, min: 15 }, // in minutes
			},
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		isArchived: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Indexes for better performance
groupSchema.index({ organizationId: 1, isActive: 1 });
groupSchema.index({ name: 'text', description: 'text' });
groupSchema.index({ category: 1 });
groupSchema.index({ tags: 1 });
groupSchema.index({ visibility: 1, joinPolicy: 1 });
groupSchema.index({ groupCode: 1 }, { sparse: true });

// Virtual populate for relationships
groupSchema.virtual('organization', {
	ref: 'Organization',
	localField: 'organizationId',
	foreignField: '_id',
	justOne: true,
});

groupSchema.virtual('members', {
	ref: 'Membership',
	localField: '_id',
	foreignField: 'entityId',
	match: { entityType: 'group', status: 'active' },
});

groupSchema.virtual('moderators', {
	ref: 'Membership',
	localField: '_id',
	foreignField: 'entityId',
	match: { entityType: 'group', status: 'active', role: 'moderator' },
});

groupSchema.virtual('events', {
	ref: 'Event',
	localField: '_id',
	foreignField: 'groupId',
	match: { isActive: true },
});

groupSchema.virtual('settings', {
	ref: 'Settings',
	localField: '_id',
	foreignField: 'entityId',
	match: { entityType: 'group' },
	justOne: true,
});

groupSchema.virtual('subGroups', {
	ref: 'Group',
	localField: '_id',
	foreignField: 'parentGroup',
	match: { isActive: true },
});

module.exports = mongoose.model('Group', groupSchema);
