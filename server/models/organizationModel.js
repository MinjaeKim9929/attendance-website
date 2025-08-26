const mongoose = require('mongoose');

const organizationSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Organization name is required'],
			maxlength: [100, 'Organization name cannot be more than 100 characters'],
			trim: true,
			index: true,
		},
		description: {
			type: String,
			maxlength: [500, 'Description cannot exceed 500 characters'],
			trim: true,
			default: '',
		},
		organizationCode: {
			type: String,
			required: true,
			unique: true,
			lower: true,
			validate: {
				validator: function (v) {
					return /^[A-Z0-9]{6,10}$/.test(v);
				},
				message: 'Organization code must be 6-10 lowercase alphanumeric characters',
			},
			index: true,
		},
		logo: {
			type: String,
			default: null,
		},
		website: {
			type: String,
			validate: {
				validator: function (v) {
					if (!v) return true;
					return /^https?:\/\/.+/.test(v);
				},
				message: 'Please provide a valid URL',
			},
		},
		contactInfo: {
			email: {
				type: String,
				lowercase: true,
				trim: true,
				match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
			},
			phone: {
				type: String,
				trim: true,
				match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'],
			},
			address: {
				street: { type: String, trim: true },
				city: { type: String, trim: true },
				state: { type: String, trim: true },
				country: { type: String, trim: true },
				postalCode: { type: String, trim: true },
			},
		},
		industry: {
			type: String,
			enum: [
				'education',
				'healthcare',
				'technology',
				'finance',
				'manufacturing',
				'retail',
				'nonprofit',
				'government',
				'consulting',
				'other',
			],
			default: 'other',
		},
		size: {
			type: String,
			enum: ['startup', 'small', 'medium', 'large', 'enterprise'],
			default: 'small',
		},
		subscription: {
			plan: {
				type: String,
				enum: ['free', 'basic', 'premium', 'enterprise'],
				default: 'free',
			},
			status: {
				type: String,
				enum: ['active', 'inactive', 'suspended', 'cancelled'],
				default: 'active',
			},
			startDate: {
				type: Date,
				default: Date.now,
			},
			endDate: {
				type: Date,
			},
			maxUsers: {
				type: Number,
				default: 30,
				min: 1,
			},
			maxGroups: {
				type: Number,
				default: 5,
				min: 1,
			},
		},
		branding: {
			primaryColor: {
				type: String,
				match: [/^#[A-Fa-f0-9]{6}$/, 'Please provide a valid hex color'],
				default: '#3B82F6',
			},
			secondaryColor: {
				type: String,
				match: [/^#[A-Fa-f0-9]{6}$/, 'Please provide a valid hex color'],
				default: '#1F2937',
			},
			// customCss: {
			// 	type: String,
			// 	maxlength: [5000, 'Custom CSS cannot exceed 5000 characters'],
			// },
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		isVerified: {
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
organizationSchema.index({ name: 'text', description: 'text' });
organizationSchema.index({ isActive: 1, isVerified: 1 });
organizationSchema.index({ 'subscription.status': 1, 'subscription.endDate': 1 });

// Virtual populate for relationships
organizationSchema.virtual('members', {
	ref: 'Membership',
	localField: '_id',
	foreignField: 'entityId',
	match: { entityType: 'organization', status: 'active' },
});

organizationSchema.virtual('groups', {
	ref: 'Group',
	localField: '_id',
	foreignField: 'organizationId',
	match: { isActive: true },
});

organizationSchema.virtual('events', {
	ref: 'Event',
	localField: '_id',
	foreignField: 'organizationId',
	match: { isActive: true },
});

organizationSchema.virtual('settings', {
	ref: 'Settings',
	localField: '_id',
	foreignField: 'entityId',
	match: { entityType: 'organization' },
	justOne: true,
});

// Virtual fields for computed data
organizationSchema.virtual('subscriptionDaysLeft').get(function () {
	if (!this.subscription.endDate) return null;
	const now = new Date();
	const endDate = new Date(this.subscription.endDate);
	const diffTime = endDate - now;
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Organization', organizationSchema);
