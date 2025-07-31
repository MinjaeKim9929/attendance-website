import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import styles from './Signup.module.css';

export default function Signup() {
	const navigate = useNavigate();
	const { signup, isLoading, isAuthenticated, error, clearError } = useAuth();

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
	const [errors, setErrors] = useState({});

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate('/dashboard', { replace: true });
		}
	}, [isAuthenticated, navigate]);

	// Clear errors when component mounts
	useEffect(() => {
		clearError();
	}, [clearError]);

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
		clearError();
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
		// Clear auth error
		if (error) {
			clearError();
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

		const result = await signup(userData);

		if (result.success) {
			navigate('/dashboard', { replace: true });
		}
		// Error is handled by the auth context
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
		clearError();
	};

	// Role Selection Step
	if (step === 'role-selection') {
		return (
			<Layout>
				<div className={styles.signupContainer}>
					<div className={styles.signupCard}>
						<div className={styles.signupHeader}>
							<h1>Choose Account Type</h1>
							<p>Select the type of account you want to create</p>
						</div>

						<div className={styles.roleSelection}>
							<div className={styles.roleOption} onClick={() => handleRoleSelection('user')}>
								<div className={`${styles.roleIcon} ${styles.userIcon}`}>
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

							<div className={styles.roleOption} onClick={() => handleRoleSelection('admin')}>
								<div className={`${styles.roleIcon} ${styles.adminIcon}`}>
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

						<div className={styles.signupFooter}>
							<p>
								Already have an account?{' '}
								<Link to="/login" className={styles.link}>
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
			<div className={styles.signupContainer}>
				<div className={styles.signupCard}>
					<div className={styles.signupHeader}>
						<button
							type="button"
							className={styles.backButton}
							onClick={handleBackToRoleSelection}
							disabled={isLoading}
						>
							←&nbsp; Back
						</button>
						<h1>Create {selectedRole === 'admin' ? 'Admin' : 'User'} Account</h1>
						<p>
							{selectedRole === 'admin'
								? 'Set up your administrator account with management access'
								: 'Create your user account for attendance tracking'}
						</p>
					</div>

					<form onSubmit={handleSubmit} className={styles.signupForm}>
						<div className={styles.formRow}>
							<div className={styles.formGroup}>
								<label htmlFor="firstName">First Name</label>
								<input
									type="text"
									id="firstName"
									name="firstName"
									value={formData.firstName}
									onChange={handleChange}
									className={errors.firstName ? styles.error : ''}
									placeholder="First name"
									disabled={isLoading}
								/>
								{errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="lastName">Last Name</label>
								<input
									type="text"
									id="lastName"
									name="lastName"
									value={formData.lastName}
									onChange={handleChange}
									className={errors.lastName ? styles.error : ''}
									placeholder="Last name"
									disabled={isLoading}
								/>
								{errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
							</div>
						</div>
						<div className={styles.formGroup}>
							<label htmlFor="email">Email Address</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className={errors.email ? styles.error : ''}
								placeholder="Enter your email"
								disabled={isLoading}
							/>
							{errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
						</div>
						<div className={styles.formGroup}>
							<label htmlFor="dateOfBirth">Date of Birth</label>
							<input
								type="date"
								id="dateOfBirth"
								name="dateOfBirth"
								value={formData.dateOfBirth}
								onChange={handleChange}
								className={errors.dateOfBirth ? styles.error : ''}
								disabled={isLoading}
								max={new Date().toISOString().split('T')[0]} // Prevent future dates
							/>
							{errors.dateOfBirth && <span className={styles.errorMessage}>{errors.dateOfBirth}</span>}
						</div>

						{/* Role-specific fields */}
						{selectedRole === 'admin' && (
							<>
								<div className={styles.formGroup}>
									<label htmlFor="adminCode">Admin Access Code</label>
									<input
										type="password"
										id="adminCode"
										name="adminCode"
										value={formData.adminCode}
										onChange={handleChange}
										className={errors.adminCode ? styles.error : ''}
										placeholder="Enter admin access code"
										disabled={isLoading}
									/>
									{errors.adminCode && <span className={styles.errorMessage}>{errors.adminCode}</span>}
								</div>
							</>
						)}
						<div className={styles.formRow}>
							<div className={styles.formGroup}>
								<label htmlFor="password">Password</label>
								<input
									type="password"
									id="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									className={errors.password ? styles.error : ''}
									placeholder="Create password"
									disabled={isLoading}
								/>
								{errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="confirmPassword">Confirm Password</label>
								<input
									type="password"
									id="confirmPassword"
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleChange}
									className={errors.confirmPassword ? styles.error : ''}
									placeholder="Confirm password"
									disabled={isLoading}
								/>
								{errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
							</div>
						</div>
						{error && <div className={`${styles.errorMessage} ${styles.submitError}`}>{error}</div>}
						<Button type="submit" variant="primary" size="large" loading={isLoading} style={{ width: '100%' }}>
							Create {selectedRole === 'admin' ? 'Admin' : 'User'} Account
						</Button>
					</form>

					<div className={styles.signupFooter}>
						<p>
							Already have an account?{' '}
							<Link to="/login" className={styles.link}>
								Sign in here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</Layout>
	);
}
