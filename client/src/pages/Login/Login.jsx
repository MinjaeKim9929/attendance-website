import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/Button/Button';
import axios from 'axios';
import './Login.css';

export default function Login() {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const navigate = useNavigate();

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

		setIsLoading(true);

		try {
			await axios.post('http://localhost:4000/api/users/login', formData);
			navigate('/dashboard');
		} catch (error) {
			console.error('Login error:', error);
			setErrors({ submit: 'Login failed. Please try again.' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Layout>
			<div className="login-container">
				<div className="login-card">
					<div className="login-header">
						<h1>Welcome Back</h1>
						<p>Sign in to your attendance account</p>
					</div>

					<form onSubmit={handleSubmit} className="login-form">
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
							<label htmlFor="password">Password</label>
							<input
								type="password"
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className={errors.password ? 'error' : ''}
								placeholder="Enter your password"
								disabled={isLoading}
							/>
							{errors.password && <span className="error-message">{errors.password}</span>}
						</div>

						{errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

						<Button type="submit" variant="primary" size="large" loading={isLoading} style={{ width: '100%' }}>
							Sign In
						</Button>
					</form>

					<div className="login-footer">
						<p>
							Don't have an account?{' '}
							<Link to="/signup" className="link">
								Sign up here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</Layout>
	);
}
