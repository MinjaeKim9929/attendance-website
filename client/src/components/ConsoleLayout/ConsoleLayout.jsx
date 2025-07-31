import React from 'react';
import Sidebar from './Sidebar/Sidebar';
import styles from './ConsoleLayout.module.css';

export default function ConsoleLayout({ children }) {
	return (
		<div className={styles.consoleLayout}>
			<Sidebar />
			<main>{children}</main>
		</div>
	);
}
