import React from 'react';
import Sidebar from './Sidebar/Sidebar';
import styles from './ConsoleLayout.module.css';
import { useSidebar } from '../../context/SidebarContext';

export default function ConsoleLayout({ children }) {
	const { isSidebarClosed, isMobile } = useSidebar();
	const layoutClass = [styles.consoleLayout, isSidebarClosed ? styles.sidebarClosed : '', isMobile ? styles.mobile : '']
		.filter(Boolean)
		.join(' ');

	return (
		<div className={layoutClass}>
			<Sidebar />
			<main>{children}</main>
		</div>
	);
}
