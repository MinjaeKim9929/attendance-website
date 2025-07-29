import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/Button/Button';
import axios from 'axios';
import './Signup.css';

export default function Signup() {
	const navigate = useNavigate();
	const [step, setStep] = useState('role-selection'); // 'role-selection' | 'signup-form'
	const [selectedRole, setSelectedRole] = useState('');
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		dateOfBirth: '',
		// Admin specific fields
		adminCode: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const handleRoleSelection = (role) => {
		setSelectedRole(role);
		setStep('signup-form');
		// Clear form data when switching roles
		setFormData({
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPassword: '',
			dateOfBirth: '',
			adminCode: '',
		});
		setErrors({});
	};

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

		if (!formData.dateOfBirth) {
			newErrors.dateOfBirth = 'Date of birth is required';
		}

		if (selectedRole === 'admin') {
			if (!formData.adminCode.trim()) {
				newErrors.adminCode = 'Admin access code is required';
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);

		try {
			const userData = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				password: formData.password,
				role: selectedRole,
				dateOfBirth: formData.dateOfBirth,
			};

			// Add admin code for admin users
			if (selectedRole === 'admin') {
				userData.adminCode = formData.adminCode;
			}

			const response = await axios.post('http://localhost:4000/api/users/signup', userData);

			navigate('/dashboard');
		} catch (err) {
			console.error('Signup error:', err);

			if (err.response?.data?.message) {
				setErrors({ submit: err.response.data.message });
			} else {
				setErrors({ submit: 'An error occurred during signup. Please try again.' });
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleBackToRoleSelection = () => {
		setStep('role-selection');
		setSelectedRole('');
		setFormData({
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPassword: '',
			dateOfBirth: '',
			adminCode: '',
		});
		setErrors({});
	};

	// Role Selection Step
	if (step === 'role-selection') {
		return (
			<Layout>
				<div className="signup-container">
					<div className="signup-card">
						<div className="signup-header">
							<h1>Choose Account Type</h1>
							<p>Select the type of account you want to create</p>
						</div>

						<div className="role-selection">
							<div className="role-option" onClick={() => handleRoleSelection('user')}>
								<div className="role-icon user-icon">
									<i className="fas fa-user"></i>
								</div>
								<h3>User Account</h3>
								<p>Standard access for attendance tracking</p>
								<ul>
									<li>Clock in/out and track attendance</li>
									<li>View personal attendance history</li>
									<li>Update profile information</li>
									<li>Request time off</li>
								</ul>
							</div>

							<div className="role-option" onClick={() => handleRoleSelection('admin')}>
								<div className="role-icon admin-icon">
									<i className="fas fa-user-gear"></i>
								</div>
								<h3>Admin Account</h3>
								<p>Full system access with management capabilities</p>
								<ul>
									<li>Manage users and attendance</li>
									<li>Generate reports and analytics</li>
									<li>Configure system settings</li>
								</ul>
							</div>
						</div>

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

	// Signup Form Step
	return (
		<Layout>
			<div className="signup-container">
				<div className="signup-card">
					<div className="signup-header">
						<button type="button" className="back-button" onClick={handleBackToRoleSelection} disabled={isLoading}>
							←&nbsp; Back
						</button>
						<h1>Create {selectedRole === 'admin' ? 'Admin' : 'User'} Account</h1>
						<p>
							{selectedRole === 'admin'
								? 'Set up your administrator account with management access'
								: 'Create your user account for attendance tracking'}
						</p>
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
							<label htmlFor="dateOfBirth">Date of Birth</label>
							<input
								type="date"
								id="dateOfBirth"
								name="dateOfBirth"
								value={formData.dateOfBirth}
								onChange={handleChange}
								className={errors.dateOfBirth ? 'error' : ''}
								disabled={isLoading}
								max={new Date().toISOString().split('T')[0]} // Prevent future dates
							/>
							{errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
						</div>

						{/* Role-specific fields */}
						{selectedRole === 'admin' && (
							<>
								<div className="form-group">
									<label htmlFor="adminCode">Admin Access Code</label>
									<input
										type="password"
										id="adminCode"
										name="adminCode"
										value={formData.adminCode}
										onChange={handleChange}
										className={errors.adminCode ? 'error' : ''}
										placeholder="Enter admin access code"
										disabled={isLoading}
									/>
									{errors.adminCode && <span className="error-message">{errors.adminCode}</span>}
								</div>
							</>
						)}
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
							Create {selectedRole === 'admin' ? 'Admin' : 'User'} Account
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
