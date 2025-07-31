import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

export default function Sidebar() {
	const location = useLocation();
	const [isClosed, setIsClosed] = useState(() => {
		const savedState = localStorage.getItem('sidebarClosed');
		return savedState ? JSON.parse(savedState) : false;
	});
	const [openSubmenu, setOpenSubmenu] = useState(null);

	// Save state to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem('sidebarClosed', JSON.stringify(isClosed));
	}, [isClosed]);

	const handleLogout = () => {
		// TODO: Implement logout functionality
		console.log('Logout clicked');
	};

	const handleToggler = () => {
		setIsClosed(!isClosed);
		// Close all submenus when sidebar is toggled
		setOpenSubmenu(null);
	};

	const handleSubmenuToggle = (submenuName, event) => {
		// Prevent any action if sidebar is closed
		if (isClosed) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		setOpenSubmenu(openSubmenu === submenuName ? null : submenuName);
	};

	const isActive = (path) => {
		return location.pathname === path;
	};

	return (
		<div className={`${styles.sidebar} ${isClosed ? styles.close : ''}`}>
			<header className={styles.sidebarHeader}>
				<div className={styles.logo}>
					<Link to="/dashboard" className={styles.logoLink}>
						<h1 className={styles.logoText}>AW</h1>
					</Link>
				</div>
				<div className={styles.toggler} onClick={handleToggler}>
					<i className={`fas ${isClosed ? `fa-angles-right` : `fa-angles-left`}`} />
				</div>
			</header>

			<nav className={styles.sidebarNav}>
				<ul className={`${styles.navList} ${styles.primaryNav}`}>
					{/* Dashboard */}
					<li className={styles.navItem}>
						<Link to="/dashboard" className={`${styles.navLink} ${isActive('/dashboard') ? styles.active : ''}`}>
							<i className="fas fa-chart-line" />
							<span className={styles.navLabel}>Dashboard</span>
						</Link>
						{isClosed && (
							<div className={styles.hoverTooltip}>
								<div className={styles.tooltipTitle}>Dashboard</div>
							</div>
						)}
					</li>

					{/* Attendances */}
					<li className={styles.navItem}>
						<div
							className={`${styles.navLink} ${isActive('/attendances') ? styles.active : ''}`}
							onClick={(event) => handleSubmenuToggle('attendances', event)}
							style={{ cursor: isClosed ? 'default' : 'pointer' }}
						>
							<i className="fas fa-calendar-days" />
							<span className={styles.navLabel}>Attendances</span>
							{!isClosed && (
								<i
									className={`fas fa-angle-down ${styles.dropdownArrow} ${
										openSubmenu === 'attendances' ? styles.open : ''
									}`}
								></i>
							)}
						</div>

						{!isClosed && (
							<ul className={`${styles.subItem} ${openSubmenu === 'attendances' ? styles.open : ''}`}>
								<li>
									<Link to="/attendances/view">View Attendances</Link>
								</li>
								<li>
									<Link to="/attendances/add">Add Attendance</Link>
								</li>
							</ul>
						)}

						{isClosed && (
							<div className={styles.hoverTooltip}>
								<div className={styles.tooltipTitle}>Attendances</div>
								<div className={styles.tooltipItem}>
									<Link to="/attendances/view">View Attendances</Link>
								</div>
								<div className={styles.tooltipItem}>Add Attendance</div>
							</div>
						)}
					</li>

					{/* Profile */}
					<li className={styles.navItem}>
						<Link
							to="/dashboard/profile"
							className={`${styles.navLink} ${isActive('/dashboard/profile') ? styles.active : ''}`}
						>
							<i className="fas fa-user" />
							<span className={styles.navLabel}>Profile</span>
						</Link>
						{isClosed && (
							<div className={styles.hoverTooltip}>
								<div className={styles.tooltipTitle}>Profile</div>
							</div>
						)}
					</li>

					{/* Settings */}
					<li className={styles.navItem}>
						<Link
							to="/dashboard/settings"
							className={`${styles.navLink} ${isActive('/dashboard/settings') ? styles.active : ''}`}
						>
							<i className="fas fa-gear" />
							<span className={styles.navLabel}>Settings</span>
						</Link>
						{isClosed && (
							<div className={styles.hoverTooltip}>
								<div className={styles.tooltipTitle}>Settings</div>
							</div>
						)}
					</li>
				</ul>

				<ul className={`${styles.navList} ${styles.secondaryNav}`}>
					<hr />
					<li className={styles.navItem}>
						<button onClick={handleLogout}>
							<i className="fas fa-arrow-right-from-bracket"></i>
							<span className={styles.navLabel}>Logout</span>
						</button>
					</li>
					<li className={styles.navItem}>
						<div className={styles.navLink}>
							<i className="fas fa-user" />
							<span className={`${styles.navLabel} ${styles.profileName}`}>Minjae Kim</span>
						</div>
					</li>
				</ul>
			</nav>
		</div>
	);
}
