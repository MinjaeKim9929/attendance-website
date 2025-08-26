const { body } = require('express-validator');
const signupValidation = [
	body('firstName')
		.trim()
		.notEmpty()
		.withMessage('First name is required')
		.isLength({ min: 1, max: 50 })
		.withMessage('First name must be between 1 and 50 characters')
		.matches(/^[a-zA-Z\s]+$/)
		.withMessage('First name can only contain letters and spaces'),

	body('lastName')
		.trim()
		.notEmpty()
		.withMessage('Last name is required')
		.isLength({ min: 1, max: 50 })
		.withMessage('Last name must be between 1 and 50 characters')
		.matches(/^[a-zA-Z\s]+$/)
		.withMessage('Last name can only contain letters and spaces'),

	body('email')
		.trim()
		.notEmpty()
		.withMessage('Email is required')
		.isEmail()
		.withMessage('Please provide a valid email address')
		.normalizeEmail(),

	body('password')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long')
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
		.withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

	body('dateOfBirth')
		.notEmpty()
		.withMessage('Date of birth is required')
		.isISO8601()
		.withMessage('Please provide a valid date format (YYYY-MM-DD)')
		.custom((value) => {
			const birthDate = new Date(value);
			const today = new Date();
			const age = today.getFullYear() - birthDate.getFullYear();

			if (age < 13 || age > 120) {
				throw new Error('Age must be between 13 and 120 years');
			}
			return true;
		}),

	body('phoneNumber')
		.optional()
		.matches(/^\+?[1-9]\d{1,14}$/)
		.withMessage('Please provide a valid phone number'),

	body('preferences.language')
		.optional()
		.isIn(['en', 'ko', 'es', 'fr', 'de', 'ja'])
		.withMessage('Invalid language preference'),

	body('preferences.timezone')
		.optional()
		.matches(/^GMT[+-]\d{2}:\d{2}$/)
		.withMessage('Invalid timezone format. Use GMT±HH:MM'),
];

const loginValidation = [
	body('email')
		.trim()
		.notEmpty()
		.withMessage('Email is required')
		.isEmail()
		.withMessage('Please provide a valid email address')
		.normalizeEmail(),

	body('password').notEmpty().withMessage('Password is required'),
];

module.exports = {
	signupValidation,
	loginValidation,
};
