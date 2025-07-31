import React from 'react';
import Sidebar from './Sidebar/Sidebar';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children }) {
	return (
		<div className={styles.dashboardLayout}>
			<Sidebar />
			<main>{children}</main>
		</div>
	);
}
