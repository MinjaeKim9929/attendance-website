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
		// Organization specific fields
		organizationName: '',
		organizationDescription: '',
		organizationCode: '',
		adminEmail: '',
		industry: '',
		size: '',
	});
	const [errors, setErrors] = useState({});

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate('/console/home', { replace: true });
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
			organizationName: '',
			organizationDescription: '',
			organizationCode: '',
			industry: '',
			size: '',
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

		// Validate personal fields only for user accounts
		if (selectedRole === 'user') {
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

			if (!formData.dateOfBirth) {
				newErrors.dateOfBirth = 'Date of birth is required';
			}
		}

		// Password validation for both account types
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

		// Validate organization fields only for organization accounts
		if (selectedRole === 'organization') {
			if (!formData.organizationName.trim()) {
				newErrors.organizationName = 'Organization name is required';
			}

			if (!formData.organizationCode.trim()) {
				newErrors.organizationCode = 'Organization code is required';
			} else if (!/^[A-Z0-9]{6,10}$/i.test(formData.organizationCode)) {
				newErrors.organizationCode = 'Organization code must be 6-10 alphanumeric characters';
			}

			if (!formData.adminEmail) {
				newErrors.adminEmail = 'Email is required';
			} else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
				newErrors.adminEmail = 'Please enter a valid email address';
			}
			if (!formData.industry) {
				newErrors.industry = 'Industry is required';
			}

			if (!formData.size) {
				newErrors.size = 'Organization size is required';
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		let userData = {
			password: formData.password,
			role: selectedRole,
		};

		// Add personal data for user accounts
		if (selectedRole === 'user') {
			userData = {
				...userData,
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				dateOfBirth: formData.dateOfBirth,
			};
		}

		// Add organization data for organization accounts
		if (selectedRole === 'organization') {
			userData.organizationData = {
				name: formData.organizationName,
				description: formData.organizationDescription,
				organizationCode: formData.organizationCode.toUpperCase(),
				industry: formData.industry,
				size: formData.size,
			};
		}

		const result = await signup(userData);

		if (result.success) {
			navigate('/console/home', { replace: true });
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
			organizationName: '',
			organizationDescription: '',
			organizationCode: '',
			industry: '',
			size: '',
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
								<h3>Personal Account</h3>
								<p>Join existing organizations and groups</p>
								<ul>
									<li>Join organizations with invite codes</li>
									<li>Participate in group activities</li>
									<li>Track your attendance and events</li>
									<li>Connect with other members</li>
								</ul>
							</div>

							<div className={styles.roleOption} onClick={() => handleRoleSelection('organization')}>
								<div className={`${styles.roleIcon} ${styles.organizationIcon}`}>
									<i className="fas fa-building"></i>
								</div>
								<h3>Organization Account</h3>
								<p>Create and manage your own organization</p>
								<ul>
									<li>Create and manage groups</li>
									<li>Organize events and activities</li>
									<li>Generate reports and analytics</li>
									<li>Invite and manage members</li>
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
						<h1>Create {selectedRole === 'organization' ? 'Organization' : 'Personal'} Account</h1>
						<p>
							{selectedRole === 'organization'
								? 'Set up your organization account with management capabilities'
								: 'Create your personal account to join organizations'}
						</p>
					</div>

					<form onSubmit={handleSubmit} className={styles.signupForm}>
						{/* Personal fields - only show for user accounts */}
						{selectedRole === 'user' && (
							<>
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
							</>
						)}

						{/* Organization-specific fields */}
						{selectedRole === 'organization' && (
							<>
								<div className={styles.formGroup}>
									<label htmlFor="organizationName">Organization Name</label>
									<input
										type="text"
										id="organizationName"
										name="organizationName"
										value={formData.organizationName}
										onChange={handleChange}
										className={errors.organizationName ? styles.error : ''}
										placeholder="Enter organization name"
										disabled={isLoading}
									/>
									{errors.organizationName && <span className={styles.errorMessage}>{errors.organizationName}</span>}
								</div>

								<div className={styles.formGroup}>
									<label htmlFor="organizationCode">Organization Code</label>
									<input
										type="text"
										id="organizationCode"
										name="organizationCode"
										value={formData.organizationCode}
										onChange={handleChange}
										className={errors.organizationCode ? styles.error : ''}
										placeholder="e.g. ABC123 (6-10 characters, A-Z & 0-9)"
										disabled={isLoading}
										maxLength={10}
									/>
									{errors.organizationCode && <span className={styles.errorMessage}>{errors.organizationCode}</span>}
								</div>

								<div className={styles.formGroup}>
									<label htmlFor="adminEmail">Admin Email</label>
									<input
										type="email"
										id="adminEmail"
										name="adminEmail"
										value={formData.adminEmail}
										onChange={handleChange}
										className={errors.adminEmail ? styles.error : ''}
										placeholder="Enter admin email (You can add more emails later)"
										disabled={isLoading}
									/>
									{errors.adminEmail && <span className={styles.errorMessage}>{errors.adminEmail}</span>}
								</div>

								<div className={styles.formGroup}>
									<label htmlFor="organizationDescription">Description (Optional)</label>
									<textarea
										id="organizationDescription"
										name="organizationDescription"
										value={formData.organizationDescription}
										onChange={handleChange}
										placeholder="Describe your organization"
										disabled={isLoading}
										maxLength={500}
										rows={3}
									/>
								</div>

								<div className={styles.formRow}>
									<div className={styles.formGroup}>
										<label htmlFor="industry">Industry</label>
										<select
											id="industry"
											name="industry"
											value={formData.industry}
											onChange={handleChange}
											className={errors.industry ? styles.error : ''}
											disabled={isLoading}
										>
											<option value="">Select industry</option>
											<option value="education">Education</option>
											<option value="healthcare">Healthcare</option>
											<option value="technology">Technology</option>
											<option value="finance">Finance</option>
											<option value="manufacturing">Manufacturing</option>
											<option value="retail">Retail</option>
											<option value="nonprofit">Non-profit</option>
											<option value="government">Government</option>
											<option value="consulting">Consulting</option>
											<option value="other">Other</option>
										</select>
										{errors.industry && <span className={styles.errorMessage}>{errors.industry}</span>}
									</div>

									<div className={styles.formGroup}>
										<label htmlFor="size">Organization Size</label>
										<select
											id="size"
											name="size"
											value={formData.size}
											onChange={handleChange}
											className={errors.size ? styles.error : ''}
											disabled={isLoading}
										>
											<option value="">Select size</option>
											<option value="startup">Startup (1-10)</option>
											<option value="small">Small (11-50)</option>
											<option value="medium">Medium (51-200)</option>
											<option value="large">Large (201-1000)</option>
											<option value="enterprise">Enterprise (1000+)</option>
										</select>
										{errors.size && <span className={styles.errorMessage}>{errors.size}</span>}
									</div>
								</div>
							</>
						)}

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
						{error && <div className={`${styles.errorMessage} ${styles.submitError}`}>{error}</div>}
						<Button type="submit" variant="primary" size="large" loading={isLoading} style={{ width: '100%' }}>
							Create {selectedRole === 'organization' ? 'Organization' : 'Personal'} Account
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
