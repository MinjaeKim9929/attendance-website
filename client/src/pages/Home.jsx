import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Layout from '../components/Layout/Layout';
import Button from '../components/Button/Button';

export default function Home() {
	const features = [
		{
			icon: 'fas fa-clock',
			title: 'Smart Time Tracking',
			description: 'Effortless clock in/out with intelligent time tracking and automated calculations.',
		},
		{
			icon: 'fas fa-chart-line',
			title: 'Advanced Analytics',
			description: 'Comprehensive reports and insights to optimize workforce management and productivity.',
		},
		{
			icon: 'fas fa-calendar-check',
			title: 'Leave Management',
			description: 'Streamlined leave requests, approvals, and calendar integration for better planning.',
		},
		{
			icon: 'fas fa-shield-alt',
			title: 'Secure & Reliable',
			description: 'Enterprise-grade security with role-based access control and data protection.',
		},
	];

	const benefits = [
		'Reduce administrative overhead by 75%',
		'Improve attendance accuracy with real-time tracking',
		'Generate compliance reports instantly',
		'Mobile-friendly access from anywhere',
		'Seamless integration with existing systems',
		'24/7 support and maintenance',
	];

	return (
		<Layout>
			<div className="home-container">
				{/* Hero Section */}
				<section className="hero-section">
					<div className="hero-content">
						<div className="hero-text">
							<h1>
								Modern Attendance
								<span className="gradient-text"> Management</span>
							</h1>
							<p className="hero-description">
								Transform your workforce management with intelligent attendance tracking, comprehensive analytics, and
								seamless user experience. Built for the modern workplace.
							</p>
							<div className="hero-actions">
								<Link to="/signup">
									<Button variant="primary" size="large">
										Get Started Free
										<i className="fas fa-arrow-right button-icon" />
									</Button>
								</Link>
								<Link to="/login">
									<Button variant="secondary" size="large">
										Sign In
									</Button>
								</Link>
							</div>
						</div>
						<div className="hero-visual">
							<div className="dashboard-preview">
								<div className="dashboard-header">
									<div className="dashboard-nav">
										<div className="nav-item active">Dashboard</div>
										<div className="nav-item">Attendance</div>
										<div className="nav-item">Reports</div>
									</div>
								</div>
								<div className="dashboard-content">
									<div className="stat-card">
										<div className="stat-number">98.5%</div>
										<div className="stat-label">Attendance Rate</div>
									</div>
									<div className="stat-card">
										<div className="stat-number">142</div>
										<div className="stat-label">Active Users</div>
									</div>
									<div className="chart-placeholder">
										<div className="chart-bars">
											<div className="bar" style={{ height: '60%' }}></div>
											<div className="bar" style={{ height: '80%' }}></div>
											<div className="bar" style={{ height: '45%' }}></div>
											<div className="bar" style={{ height: '90%' }}></div>
											<div className="bar" style={{ height: '75%' }}></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Account Types Section */}
				<section className="account-types-section">
					<div className="section-header">
						<h2>Choose Your Account Type</h2>
						<p>Get started with the right access level for your needs</p>
					</div>
					<div className="account-types">
						<div className="account-type-card user-card">
							<div className="account-icon">
								<i className="fas fa-user" />
							</div>
							<h3>User Account</h3>
							<p>Essential features for efficient attendance tracking</p>
							<ul className="account-features">
								<li>
									<i className="fas fa-check-circle" />
									Clock in/out tracking
								</li>
								<li>
									<i className="fas fa-check-circle" />
									Personal attendance history
								</li>
								<li>
									<i className="fas fa-check-circle" />
									Leave request management
								</li>
								<li>
									<i className="fas fa-check-circle" /> Mobile accessibility
								</li>
							</ul>
						</div>

						<div className="account-type-card admin-card">
							<div className="account-icon">
								<i className="fas fa-clock" />
							</div>
							<h3>Admin Account</h3>
							<p>Complete system control with advanced management capabilities</p>
							<ul className="account-features">
								<li>
									<i className="fas fa-check-circle" /> User & attendance management
								</li>
								<li>
									<i className="fas fa-check-circle" /> Advanced analytics & reports
								</li>
								<li>
									<i className="fas fa-check-circle" /> System configuration
								</li>
								<li>
									<i className="fas fa-check-circle" />
									Multi-department oversight
								</li>
							</ul>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="features-section">
					<div className="section-header">
						<h2>Powerful Features for Modern Teams</h2>
						<p>Everything you need to manage attendance efficiently and effectively</p>
					</div>
					<div className="features-grid">
						{features.map((feature, index) => (
							<div key={index} className="feature-card">
								<div className="feature-icon">
									<i className={feature.icon} />
								</div>
								<h3>{feature.title}</h3>
								<p>{feature.description}</p>
							</div>
						))}
					</div>
				</section>

				{/* Benefits Section */}
				<section className="benefits-section">
					<div className="benefits-content">
						<div className="benefits-text">
							<h2>Why Choose Our Platform?</h2>
							<p>Join thousands of organizations already transforming their attendance management</p>
							<div className="benefits-list">
								{benefits.map((benefit, index) => (
									<div key={index} className="benefit-item">
										<i className="fas fa-check-circle benefit-icon" />
										<span>{benefit}</span>
									</div>
								))}
							</div>
							<div className="benefits-action">
								<Link to="/signup">
									<Button variant="cta" size="large">
										Start Your Free Trial
									</Button>
								</Link>
							</div>
						</div>
						<div className="benefits-visual">
							<div className="stats-showcase">
								<div className="showcase-stat">
									<div className="stat-value">50K+</div>
									<div className="stat-desc">Active Users</div>
								</div>
								<div className="showcase-stat">
									<div className="stat-value">99.9%</div>
									<div className="stat-desc">Uptime</div>
								</div>
								<div className="showcase-stat">
									<div className="stat-value">24/7</div>
									<div className="stat-desc">Support</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="cta-section">
					<div className="cta-content">
						<h2>Ready to Transform Your Attendance Management?</h2>
						<p>Join thousands of organizations already using our platform to streamline their workforce management.</p>
						<div className="cta-actions">
							<Link to="/signup">
								<Button variant="primary" size="large">
									Get Started Now
									<i className="fas fa-arrow-right button-icon" />
								</Button>
							</Link>
							<Link to="/login" className="cta-link">
								Already have an account? Sign in
							</Link>
						</div>
					</div>
				</section>
			</div>
		</Layout>
	);
}
