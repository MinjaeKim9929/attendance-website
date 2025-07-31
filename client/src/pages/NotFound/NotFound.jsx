import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/Button/Button';
import styles from './NotFound.module.css';

export default function NotFound() {
	return (
		<Layout>
			<div className={styles.notfoundContainer}>
				<div className={styles.errorIllustration}>
					<svg viewBox="0 0 200 200" className={styles.notfoundSvg}>
						<circle cx="100" cy="100" r="80" fill="var(--primary-300)" opacity="0.3" />
						<circle cx="100" cy="100" r="60" fill="var(--primary-200)" opacity="0.5" />
						<circle cx="100" cy="100" r="40" fill="var(--primary-100)" opacity="0.7" />
						<text x="100" y="110" textAnchor="middle" fontSize="24" fill="white" fontWeight="bold">
							AW
						</text>
					</svg>
				</div>

				<div className={styles.notfoundContent}>
					<div className={styles.errorCode}>404</div>
					<h1 className={styles.errorTitle}>Page Not Found</h1>
					<p className={styles.errorDescription}>
						Sorry, the page you are looking for doesn't exist or has been moved.
					</p>

					<div className={styles.errorActions}>
						<Link to="/">
							<Button variant="primary" size="large">
								Go Home
							</Button>
						</Link>
						<Link to="/signup">
							<Button variant="secondary" size="large">
								Sign Up
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</Layout>
	);
}
