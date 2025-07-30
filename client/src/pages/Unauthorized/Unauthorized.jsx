import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/Button/Button';
import './Unauthorized.css';

export default function Unauthorized() {
	return (
		<Layout>
			<div className="unauthorized-container">
				<div className="error-illustration">
					<svg viewBox="0 0 200 200" className="unauthorized-svg">
						<circle cx="100" cy="100" r="80" fill="var(--primary-300)" opacity="0.3" />
						<circle cx="100" cy="100" r="60" fill="var(--primary-200)" opacity="0.5" />
						<circle cx="100" cy="100" r="40" fill="var(--primary-100)" opacity="0.7" />
						<text x="100" y="110" textAnchor="middle" fontSize="24" fill="white" fontWeight="bold">
							AW
						</text>
					</svg>
				</div>

				<div className="unauthorized-content">
					<div className="error-code">403</div>
					<h1 className="error-title">Unauthorized Access</h1>
					<p className="error-description">
						You don't have permission to access this page. Please contact your administrator if you believe this is an
						error.
					</p>

					<div className="error-actions">
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
