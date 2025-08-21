import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
	const navigate = useNavigate();
	const location = useLocation();
	const { login, isLoading, isAuthenticated, error, clearError } = useAuth();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
		rememberMe: false,
	});
	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);

	// Get the redirect path from location state or default to home
	const from = location.state?.from?.pathname || '/console/home';

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate(from, { replace: true });
		}
	}, [isAuthenticated, navigate, from]);

	// Clear errors when component mounts
	useEffect(() => {
		clearError();
	}, [clearError]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
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

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		const loginData = {
			email: formData.email.toLowerCase().trim(),
			password: formData.password,
			rememberMe: formData.rememberMe,
		};

		const result = await login(loginData);

		if (result.success) {
			navigate(from, { replace: true });
		}
		// Error is handled by the auth context
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<Layout>
			<div className={styles.loginContainer}>
				<div className={styles.loginCard}>
					<div className={styles.loginHeader}>
						<h1>Welcome Back</h1>
						<p>Sign in to your attendance tracking account</p>
					</div>

					<form onSubmit={handleSubmit} className={styles.loginForm}>
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
								autoComplete="email"
							/>
							{errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="password">Password</label>
							<div className={styles.passwordInputContainer}>
								<input
									type={showPassword ? 'text' : 'password'}
									id="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									className={errors.password ? styles.error : ''}
									placeholder="Enter your password"
									disabled={isLoading}
									autoComplete="current-password"
								/>
								<button
									type="button"
									className={styles.passwordToggle}
									onClick={togglePasswordVisibility}
									disabled={isLoading}
									aria-label={showPassword ? 'Hide password' : 'Show password'}
								>
									<i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
								</button>
							</div>
							{errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
						</div>

						<div className={styles.formOptions}>
							<label className={styles.checkboxContainer}>
								<input
									type="checkbox"
									name="rememberMe"
									checked={formData.rememberMe}
									onChange={handleChange}
									disabled={isLoading}
								/>
								<span className={styles.checkmark}></span>
								Remember me
							</label>

							<Link to="/forgot-password" className={styles.forgotPassword}>
								Forgot password?
							</Link>
						</div>

						{error && <div className={`${styles.errorMessage} ${styles.submitError}`}>{error}</div>}

						<Button type="submit" variant="primary" size="large" loading={isLoading} style={{ width: '100%' }}>
							Sign In
						</Button>
					</form>

					<div className={styles.loginFooter}>
						<p>
							Don't have an account?{' '}
							<Link to="/signup" className={styles.link}>
								Sign up here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</Layout>
	);
}
