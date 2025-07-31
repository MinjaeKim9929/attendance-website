import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button/Button';
import Layout from '../components/Layout/Layout';
import styles from './Home.module.css';

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
			<div className={styles.homeContainer}>
				<section className={styles.heroSection}>
					<div className={styles.heroContent}>
						<div className={styles.heroText}>
							<h1>
								Modern Attendance
								<span className={styles.gradientText}> Management</span>
							</h1>
							<p className={styles.heroDescription}>
								Transform your workforce management with intelligent attendance tracking, comprehensive analytics, and
								seamless user experience. Built for the modern workplace.
							</p>
							<div className={styles.heroActions}>
								<Link to="/signup">
									<Button variant="primary" size="large">
										Get Started Free
										<i className={`fas fa-arrow-right ${styles.buttonIcon}`} />
									</Button>
								</Link>
								<Link to="/login">
									<Button variant="secondary" size="large">
										Sign In
									</Button>
								</Link>
							</div>
						</div>
						<div className={styles.heroVisual}>
							<div className={styles.dashboardPreview}>
								<div className={styles.dashboardHeader}>
									<div className={styles.dashboardNav}>
										<div className={`${styles.navItem} ${styles.active}`}>Dashboard</div>
										<div className={styles.navItem}>Attendance</div>
										<div className={styles.navItem}>Reports</div>
									</div>
								</div>
								<div className={styles.dashboardContent}>
									<div className={styles.statCard}>
										<div className={styles.statNumber}>98.5%</div>
										<div className={styles.statLabel}>Attendance Rate</div>
									</div>
									<div className={styles.statCard}>
										<div className={styles.statNumber}>142</div>
										<div className={styles.statLabel}>Active Users</div>
									</div>
									<div className={styles.chartPlaceholder}>
										<div className={styles.chartBars}>
											<div className={styles.bar} style={{ height: '60%' }}></div>
											<div className={styles.bar} style={{ height: '80%' }}></div>
											<div className={styles.bar} style={{ height: '45%' }}></div>
											<div className={styles.bar} style={{ height: '90%' }}></div>
											<div className={styles.bar} style={{ height: '75%' }}></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className={styles.accountTypesSection}>
					<div className={styles.sectionHeader}>
						<h2>Choose Your Account Type</h2>
						<p>Get started with the right access level for your needs</p>
					</div>
					<div className={styles.accountTypes}>
						<div className={`${styles.accountTypeCard} ${styles.userCard}`}>
							<div className={styles.accountIcon}>
								<i className="fas fa-user" />
							</div>
							<h3>User Account</h3>
							<p>Essential features for efficient attendance tracking</p>
							<ul className={styles.accountFeatures}>
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

						<div className={`${styles.accountTypeCard} ${styles.adminCard}`}>
							<div className={styles.accountIcon}>
								<i className="fas fa-clock" />
							</div>
							<h3>Admin Account</h3>
							<p>Complete system control with advanced management capabilities</p>
							<ul className={styles.accountFeatures}>
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

				<section className={styles.featuresSection}>
					<div className={styles.sectionHeader}>
						<h2>Powerful Features for Modern Teams</h2>
						<p>Everything you need to manage attendance efficiently and effectively</p>
					</div>
					<div className={styles.featuresGrid}>
						{features.map((feature, index) => (
							<div key={index} className={styles.featureCard}>
								<div className={styles.featureIcon}>
									<i className={feature.icon} />
								</div>
								<h3>{feature.title}</h3>
								<p>{feature.description}</p>
							</div>
						))}
					</div>
				</section>

				<section className={styles.benefitsSection}>
					<div className={styles.benefitsContent}>
						<div className={styles.benefitsText}>
							<h2>Why Choose Our Platform?</h2>
							<p>Join thousands of organizations already transforming their attendance management</p>
							<div className={styles.benefitsList}>
								{benefits.map((benefit, index) => (
									<div key={index} className={styles.benefitItem}>
										<i className={`fas fa-check-circle ${styles.benefitIcon}`} />
										<span>{benefit}</span>
									</div>
								))}
							</div>
							<div className={styles.benefitsAction}>
								<Link to="/signup">
									<Button variant="cta" size="large">
										Start Your Free Trial
									</Button>
								</Link>
							</div>
						</div>
						<div className={styles.benefitsVisual}>
							<div className={styles.statsShowcase}>
								<div className={styles.showcaseStat}>
									<div className={styles.statValue}>50K+</div>
									<div className={styles.statDesc}>Active Users</div>
								</div>
								<div className={styles.showcaseStat}>
									<div className={styles.statValue}>99.9%</div>
									<div className={styles.statDesc}>Uptime</div>
								</div>
								<div className={styles.showcaseStat}>
									<div className={styles.statValue}>24/7</div>
									<div className={styles.statDesc}>Support</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className={styles.ctaSection}>
					<div className={styles.ctaContent}>
						<h2>Ready to Transform Your Attendance Management?</h2>
						<p>Join thousands of organizations already using our platform to streamline their workforce management.</p>
						<div className={styles.ctaActions}>
							<Link to="/signup">
								<Button variant="primary" size="large">
									Get Started Now
									<i className={`fas fa-arrow-right ${styles.buttonIcon}`} />
								</Button>
							</Link>
							<Link to="/login" className={styles.ctaLink}>
								Already have an account? Sign in
							</Link>
						</div>
					</div>
				</section>
			</div>
		</Layout>
	);
}
