import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

export default function Sidebar() {
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
						<i className="fas fa-chart-line" />
						<Link to="/dashboard">Dashboard</Link>
					</li>
					<li className={styles.navItem}>
						<i className="fas fa-user" />
						<Link to="/profile">Profile</Link>
					</li>
					<li className={styles.navItem}>
						<i className="fas fa-gear" />
						<Link to="/settings">Settings</Link>
					</li>
				</ul>

				<hr />

				<ul className={`${styles.navList} ${styles.secondaryNav}`}>
					<li className={styles.navItem}>
						<button>
							<i className="fas fa-arrow-right-from-bracket"></i>
							Logout
						</button>
					</li>
				</ul>
			</nav>
		</div>
	);
}
