const asyncHandler = require('express-async-handler');
const Organization = require('../models/organizationModel');
const User = require('../models/userModel');

const createOrganization = asyncHandler(async (req, res) => {
	const { name, organizationCode, adminEmail, ...rest } = req.body;
	if (!adminEmail) {
		return res.status(400).json({ message: 'Admin email is required' });
	}
	// Check if admin email exists in user accounts
	const adminUser = await User.findOne({ email: adminEmail.toLowerCase().trim() });
	if (!adminUser) {
		return res.status(400).json({ message: 'Admin email does not exist as a personal account' });
	}
	// Create organization account
	const org = await Organization.create({
		name,
		organizationCode,
		...rest,
	});
	res.status(201).json(org);
});

module.exports = {
	createOrganization,
};
