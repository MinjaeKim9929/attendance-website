import React from 'react';
import Sidebar from './Sidebar/Sidebar';
import './DashboardLayout.css';

export default function DashboardLayout({ children }) {
	return (
		<div className="dashboard-layout">
			<Sidebar />
			<main>{children}</main>
		</div>
	);
}
