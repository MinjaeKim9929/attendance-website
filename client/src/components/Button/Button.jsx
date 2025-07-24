import React from 'react';
import './Button.css';

export default function Button({
	variant = 'primary',
	size = 'medium',
	disabled = false,
	loading = false,
	children,
	...props
}) {
	return (
		<button className={`btn ${variant} ${size} ${loading ? 'loading' : ''}`} disabled={disabled || loading} {...props}>
			{loading ? <span className="spinner" /> : children}
		</button>
	);
}
