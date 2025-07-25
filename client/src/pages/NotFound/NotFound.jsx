import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/Button/Button';
import './NotFound.css';

export default function NotFound() {
	return (
		<Layout>
			<div className="notfound-container">
				<div className="notfound-content">
					<div className="error-code">404</div>
					<h1 className="error-title">Page Not Found</h1>
					<p className="error-description">Sorry, the page you are looking for doesn't exist or has been moved.</p>

					<div className="error-actions">
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

					{/* <div className="helpful-links">
						<h3>You might be looking for:</h3>
						<ul>
							<li>
								<Link to="/" className="help-link">
									Home
								</Link>
							</li>
							<li>
								<Link to="/login" className="help-link">
									Login
								</Link>
							</li>
							<li>
								<Link to="/signup" className="help-link">
									Sign Up
								</Link>
							</li>
						</ul>
					</div> */}
				</div>

				<div className="error-illustration">
					<svg viewBox="0 0 200 200" className="notfound-svg">
						<circle cx="100" cy="100" r="80" fill="var(--primary-300)" opacity="0.3" />
						<circle cx="100" cy="100" r="60" fill="var(--primary-200)" opacity="0.5" />
						<circle cx="100" cy="100" r="40" fill="var(--primary-100)" opacity="0.7" />
						<text x="100" y="110" textAnchor="middle" fontSize="24" fill="white" fontWeight="bold">
							AW
						</text>
					</svg>
				</div>
			</div>
		</Layout>
	);
}
