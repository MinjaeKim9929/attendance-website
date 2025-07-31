import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

export default function Sidebar() {
	const location = useLocation();

	const handleLogout = () => {
		// TODO: Implement logout functionality
		console.log('Logout clicked');
	};

	const isActive = (path) => {
		return location.pathname === path;
	};

	return (
		<div className={styles.sidebar}>
			<header className={styles.sidebarHeader}>
				<div className={styles.logo}>
					<Link to="/dashboard" className={styles.logoLink}>
						<h1 className={styles.logoText}>AW</h1>
					</Link>
				</div>
				<div className={styles.toggler}>
					<i className="fas fa-angles-left" />
				</div>
			</header>

			<nav className={styles.sidebarNav}>
				<ul className={`${styles.navList} ${styles.primaryNav}`}>
					<li className={styles.navItem}>
						<Link to="/dashboard" className={`${styles.navLink} ${isActive('/dashboard') ? styles.active : ''}`}>
							<i className="fas fa-chart-line" />
							Dashboard
						</Link>
					</li>
					<li className={styles.navItem}>
						<Link to="/dashboard/profile" className={`${styles.navLink} ${isActive('/profile') ? styles.active : ''}`}>
							<i className="fas fa-user" />
							Profile
						</Link>
					</li>
					<li className={styles.navItem}>
						<Link
							to="/dashboard/settings"
							className={`${styles.navLink} ${isActive('/settings') ? styles.active : ''}`}
						>
							<i className="fas fa-gear" />
							Settings
						</Link>
					</li>
				</ul>

				<hr />

				<ul className={`${styles.navList} ${styles.secondaryNav}`}>
					<li className={styles.navItem}>
						<button onClick={handleLogout}>
							<i className="fas fa-arrow-right-from-bracket"></i>
							Logout
						</button>
					</li>
				</ul>
			</nav>
		</div>
	);
}
