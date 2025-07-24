import React from 'react';
import './Home.css';
import Layout from '../components/Layout/Layout';
import Button from '../components/Button/Button';

export default function Home() {
	return (
		<Layout>
			<div>
				<h1>Hi</h1>
				<Button variant="primary" size="large">
					Primary Large
				</Button>
				<Button variant="primary" size="large" loading>
					Primary Large
				</Button>
				<Button variant="primary" size="large" disabled>
					Primary Large
				</Button>
				<Button variant="secondary" size="medium">
					Secondary Medium
				</Button>
				<Button variant="secondary" size="medium" loading>
					Secondary Medium
				</Button>
				<Button variant="secondary" size="medium" disabled>
					Secondary Medium
				</Button>
				<Button variant="cta" size="small">
					CTA Small
				</Button>
				<Button variant="cta" size="small" loading>
					CTA Small
				</Button>
				<Button variant="cta" size="small" disabled>
					CTA Small
				</Button>
			</div>
		</Layout>
	);
}
