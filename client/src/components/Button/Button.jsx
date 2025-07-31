import React from 'react';
import styles from './Button.module.css';

export default function Button({
	variant = 'primary',
	size = 'medium',
	disabled = false,
	loading = false,
	children,
	...props
}) {
	return (
		<button
			className={`${styles.btn} ${styles[variant]} ${styles[size]} ${loading ? styles.loading : ''}`}
			disabled={disabled || loading}
			{...props}
		>
			{loading ? <span className={styles.spinner} /> : children}
		</button>
	);
}
