import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [errors, setErrors] = useState({});

	const navigate = useNavigate();
	const location = useLocation();
	const { login, isLoading, isAuthenticated, error, clearError } = useAuth();

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			const from = location.state?.from?.pathname || '/console/home';
			navigate(from, { replace: true });
		}
	}, [isAuthenticated, navigate, location]);

	// Clear errors when component mounts
	useEffect(() => {
		clearError();
	}, [clearError]);

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

		const result = await login(formData.email, formData.password);

		if (result.success) {
			const from = location.state?.from?.pathname || '/console/home';
			navigate(from, { replace: true });
		}
		// Error is handled by the auth context
	};

	return (
		<Layout>
			<div className={styles.loginContainer}>
				<div className={styles.loginCard}>
					<div className={styles.loginHeader}>
						<h1>Welcome Back</h1>
						<p>Sign in to your attendance account</p>
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
								className={errors.email ? `${styles.error}` : ''}
								placeholder="Enter your email"
								disabled={isLoading}
							/>
							{errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="password">Password</label>
							<input
								type="password"
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className={errors.password ? `${styles.error}` : ''}
								placeholder="Enter your password"
								disabled={isLoading}
							/>
							{errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
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
