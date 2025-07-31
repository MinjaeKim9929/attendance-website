import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/Button/Button';
import styles from './Unauthorized.module.css';

export default function Unauthorized() {
	return (
		<Layout>
			<div className={styles.unauthorizedContainer}>
				<div className={styles.errorIllustration}>
					<svg viewBox="0 0 200 200" className={styles.unauthorizedSvg}>
						<circle cx="100" cy="100" r="80" fill="var(--primary-300)" opacity="0.3" />
						<circle cx="100" cy="100" r="60" fill="var(--primary-200)" opacity="0.5" />
						<circle cx="100" cy="100" r="40" fill="var(--primary-100)" opacity="0.7" />
						<text x="100" y="110" textAnchor="middle" fontSize="24" fill="white" fontWeight="bold">
							AW
						</text>
					</svg>
				</div>

				<div className={styles.unauthorizedContent}>
					<div className={styles.errorCode}>403</div>
					<h1 className={styles.errorTitle}>Unauthorized Access</h1>
					<p className={styles.errorDescription}>
						You don't have permission to access this page. Please contact your administrator if you believe this is an
						error.
					</p>

					<div className={styles.errorActions}>
						<Link to="/dashboard">
							<Button variant="primary" size="large">
								Go to Dashboard
							</Button>
						</Link>
						<Link to="/">
							<Button variant="secondary" size="large">
								Go Home
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</Layout>
	);
}
