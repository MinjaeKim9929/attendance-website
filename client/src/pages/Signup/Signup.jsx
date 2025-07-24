import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/Button/Button';
import './Signup.css';

export default function Signup() {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		organizationName: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: '',
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = 'First name is required';
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = 'Last name is required';
		}

		if (!formData.email) {
			newErrors.email = 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Please enter a valid email address';
		}

		if (!formData.password) {
			newErrors.password = 'Password is required';
		} else if (formData.password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters';
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = 'Please confirm your password';
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
		}

		if (!formData.organizationName.trim()) {
			newErrors.organizationName = 'Organization name is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);

		try {
			// TODO: Replace with actual API call to MongoDB
			console.log('Signup attempt:', {
				...formData,
				password: '[HIDDEN]',
				confirmPassword: '[HIDDEN]',
			});

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Handle successful signup here
			alert('Account created successfully! (This will be replaced with navigation)');
		} catch (error) {
			console.error('Signup error:', error);
			setErrors({ submit: 'Account creation failed. Please try again.' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Layout>
			<div className="signup-container">
				<div className="signup-card">
					<div className="signup-header">
						<h1>Create Account</h1>
						<p>Join us to start managing attendance efficiently</p>
					</div>

					<form onSubmit={handleSubmit} className="signup-form">
						<div className="form-row">
							<div className="form-group">
								<label htmlFor="firstName">First Name</label>
								<input
									type="text"
									id="firstName"
									name="firstName"
									value={formData.firstName}
									onChange={handleChange}
									className={errors.firstName ? 'error' : ''}
									placeholder="First name"
									disabled={isLoading}
								/>
								{errors.firstName && <span className="error-message">{errors.firstName}</span>}
							</div>

							<div className="form-group">
								<label htmlFor="lastName">Last Name</label>
								<input
									type="text"
									id="lastName"
									name="lastName"
									value={formData.lastName}
									onChange={handleChange}
									className={errors.lastName ? 'error' : ''}
									placeholder="Last name"
									disabled={isLoading}
								/>
								{errors.lastName && <span className="error-message">{errors.lastName}</span>}
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="email">Email Address</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className={errors.email ? 'error' : ''}
								placeholder="Enter your email"
								disabled={isLoading}
							/>
							{errors.email && <span className="error-message">{errors.email}</span>}
						</div>

						<div className="form-group">
							<label htmlFor="organizationName">Organization Name</label>
							<input
								type="text"
								id="organizationName"
								name="organizationName"
								value={formData.organizationName}
								onChange={handleChange}
								className={errors.organizationName ? 'error' : ''}
								placeholder="Your organization or company name"
								disabled={isLoading}
							/>
							{errors.organizationName && <span className="error-message">{errors.organizationName}</span>}
						</div>

						<div className="form-row">
							<div className="form-group">
								<label htmlFor="password">Password</label>
								<input
									type="password"
									id="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									className={errors.password ? 'error' : ''}
									placeholder="Create password"
									disabled={isLoading}
								/>
								{errors.password && <span className="error-message">{errors.password}</span>}
							</div>

							<div className="form-group">
								<label htmlFor="confirmPassword">Confirm Password</label>
								<input
									type="password"
									id="confirmPassword"
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleChange}
									className={errors.confirmPassword ? 'error' : ''}
									placeholder="Confirm password"
									disabled={isLoading}
								/>
								{errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
							</div>
						</div>

						{errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

						<Button type="submit" variant="primary" size="large" loading={isLoading} style={{ width: '100%' }}>
							Create Account
						</Button>
					</form>

					<div className="signup-footer">
						<p>
							Already have an account?{' '}
							<Link to="/login" className="link">
								Sign in here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</Layout>
	);
}
