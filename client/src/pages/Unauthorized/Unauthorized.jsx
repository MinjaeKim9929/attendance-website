import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/Button/Button';

const Unauthorized = () => {
	return (
		<Layout>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '70vh',
					padding: '3rem',
					textAlign: 'center',
				}}
			>
				<div
					style={{
						fontSize: '6rem',
						fontWeight: '900',
						background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
						marginBottom: '1rem',
					}}
				>
					403
				</div>

				<h1
					style={{
						fontSize: '2.5rem',
						fontWeight: '700',
						color: 'var(--text-100)',
						margin: '0 0 1rem 0',
					}}
				>
					Unauthorized Access
				</h1>

				<p
					style={{
						fontSize: '1.1rem',
						color: 'var(--text-200)',
						marginBottom: '2.5rem',
						maxWidth: '500px',
					}}
				>
					You don't have permission to access this page. Please contact your administrator if you believe this is an
					error.
				</p>

				<div
					style={{
						display: 'flex',
						gap: '1rem',
						flexWrap: 'wrap',
						justifyContent: 'center',
					}}
				>
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
		</Layout>
	);
};

export default Unauthorized;
