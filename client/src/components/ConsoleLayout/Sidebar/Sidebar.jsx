import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useSidebar } from '../../../context/SidebarContext';

export default function Sidebar() {
	const location = useLocation();
	const { isSidebarClosed, setIsSidebarClosed, isMobile } = useSidebar();
	const [openSubmenu, setOpenSubmenu] = useState(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isResizing, setIsResizing] = useState(false);

	// Check if device is mobile
	useEffect(() => {
		let resizeTimer;

		const checkMobile = () => {
			const mobile = window.innerWidth <= 689 || window.innerHeight <= 699;
			const wasMobile = isMobile;

			if (wasMobile !== mobile) {
				setIsResizing(true);
				clearTimeout(resizeTimer);

				resizeTimer = setTimeout(() => {
					setIsResizing(false);

					if (!mobile && wasMobile) {
						const sidebar = document.querySelector(`.${styles.sidebar}`);
						if (sidebar) {
							void sidebar.offsetHeight;
							sidebar.classList.remove(styles.resizing);
							const navItems = sidebar.querySelectorAll(`.${styles.navItem}`);
							navItems.forEach((item, index) => {
								item.style.animation = 'none';
								void item.offsetWidth;
								item.style.animation = `fadeInUp 0.3s ease forwards`;
								item.style.animationDelay = `${(index + 1) * 0.05}s`;
							});
						}
					}
				}, 150);
			}

			if (mobile) {
				setIsSidebarClosed(false);
				setMobileMenuOpen(false);
			} else {
				setMobileMenuOpen(false);
				const savedState = localStorage.getItem('sidebarClosed');
				setIsSidebarClosed(savedState ? JSON.parse(savedState) : false);
				setIsResizing(false);
			}
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => {
			window.removeEventListener('resize', checkMobile);
			if (resizeTimer) clearTimeout(resizeTimer);
		};
	}, [isMobile, setIsSidebarClosed]);

	// Save state to localStorage only for desktop
	useEffect(() => {
		if (!isMobile) {
			localStorage.setItem('sidebarClosed', JSON.stringify(isSidebarClosed));
		}
	}, [isSidebarClosed, isMobile]);

	// Close mobile menu when clicking outside
	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (isMobile && mobileMenuOpen) {
				const sidebar = document.querySelector(`.${styles.sidebar}`);
				const topbar = document.querySelector(`.${styles.mobileTopbar}`);

				// Check if click is outside both sidebar and topbar
				if (!sidebar?.contains(event.target) && !topbar?.contains(event.target)) {
					setMobileMenuOpen(false);
				}
			}
		};

		if (mobileMenuOpen) {
			document.addEventListener('click', handleOutsideClick);
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.removeEventListener('click', handleOutsideClick);
			document.body.style.overflow = 'unset';
		};
	}, [mobileMenuOpen, isMobile]);

	// Close mobile menu when route changes
	useEffect(() => {
		if (isMobile) {
			setMobileMenuOpen(false);
		}
	}, [location.pathname, isMobile]);

	const handleLogout = () => {
		// TODO: Implement logout functionality
		console.log('Logout clicked');
		if (isMobile) {
			setMobileMenuOpen(false);
		}
	};

	const handleToggler = (event) => {
		event.preventDefault();
		event.stopPropagation();

		if (isMobile) {
			setMobileMenuOpen((prev) => !prev);
			setOpenSubmenu(null);
		} else {
			setIsSidebarClosed((prev) => !prev);
			// Close all submenus when sidebar is toggled
			setOpenSubmenu(null);
		}
	};

	const handleSubmenuToggle = (submenuName, event) => {
		// Prevent any action if sidebar is closed on desktop
		if (!isMobile && isSidebarClosed) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		setOpenSubmenu(openSubmenu === submenuName ? null : submenuName);
	};

	const isActive = (path) => {
		return location.pathname === path;
	};

	const handleLinkClick = () => {
		if (isMobile) {
			setMobileMenuOpen(false);
		}
	};

	const sidebarClasses = [
		styles.sidebar,
		isSidebarClosed && !isMobile ? styles.close : '',
		isMobile && mobileMenuOpen ? styles.mobileOpen : '',
		isResizing ? styles.resizing : '',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<>
			{/* Mobile topbar - always visible on small screens */}
			{isMobile && (
				<div className={styles.mobileTopbar}>
					<div className={styles.logo}>
						<Link to="/console/home" className={styles.logoLink} onClick={handleLinkClick}>
							<h1 className={styles.logoText}>AW</h1>
						</Link>
					</div>
					<button
						className={styles.mobileToggler}
						onClick={handleToggler}
						type="button"
						aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
					>
						<i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`} />
					</button>
				</div>
			)}

			{/* Mobile overlay */}
			{isMobile && (
				<div
					className={`${styles.mobileOverlay} ${mobileMenuOpen ? styles.show : ''}`}
					onClick={() => setMobileMenuOpen(false)}
				/>
			)}

			<div className={sidebarClasses}>
				{/* Desktop header - hidden on mobile */}
				{!isMobile && (
					<header className={styles.sidebarHeader}>
						<div className={styles.logo}>
							<Link to="/console/home" className={styles.logoLink} onClick={handleLinkClick}>
								<h1 className={styles.logoText}>AW</h1>
							</Link>
						</div>
						<button
							className={styles.toggler}
							onClick={handleToggler}
							type="button"
							aria-label={isSidebarClosed ? 'Expand sidebar' : 'Collapse sidebar'}
						>
							<i className={`fas ${isSidebarClosed ? 'fa-angles-right' : 'fa-angles-left'}`} />
						</button>
					</header>
				)}

				<nav className={styles.sidebarNav}>
					<ul className={`${styles.navList} ${styles.primaryNav}`}>
						{/* Home */}
						<li className={styles.navItem}>
							<Link
								to="/console/home"
								className={`${styles.navLink} ${isActive('/console/home') ? styles.active : ''}`}
								onClick={handleLinkClick}
							>
								<i className="fas fa-home" />
								<span className={styles.navLabel}>Home</span>
							</Link>
							{!isMobile && isSidebarClosed && (
								<div className={styles.hoverTooltip}>
									<div className={styles.tooltipTitle}>Home</div>
								</div>
							)}
						</li>

						{/* Attendances */}
						<li className={styles.navItem}>
							<div
								className={`${styles.navLink} ${isActive('/attendances') ? styles.active : ''}`}
								onClick={(event) => handleSubmenuToggle('attendances', event)}
								style={{ cursor: !isMobile && isSidebarClosed ? 'default' : 'pointer' }}
							>
								<i className="fas fa-calendar-days" />
								<span className={styles.navLabel}>Attendances</span>
								{(isMobile || !isSidebarClosed) && (
									<i
										className={`fas fa-angle-down ${styles.dropdownArrow} ${
											openSubmenu === 'attendances' ? styles.open : ''
										}`}
									></i>
								)}
							</div>

							{(isMobile || !isSidebarClosed) && (
								<ul className={`${styles.subItem} ${openSubmenu === 'attendances' ? styles.open : ''}`}>
									<li>
										<Link to="/attendances" onClick={handleLinkClick}>
											View Attendances
										</Link>
									</li>
									<li>
										<Link to="/attendances/add" onClick={handleLinkClick}>
											Add Attendance
										</Link>
									</li>
								</ul>
							)}

							{!isMobile && isSidebarClosed && (
								<div className={styles.hoverTooltip}>
									<div className={styles.tooltipTitle}>Attendances</div>
									<div className={styles.tooltipItem}>
										<Link to="/attendances" onClick={handleLinkClick}>
											View Attendances
										</Link>
									</div>
									<div className={styles.tooltipItem}>
										<Link to="/attendances/add" onClick={handleLinkClick}>
											Add Attendance
										</Link>
									</div>
								</div>
							)}
						</li>

						{/* Profile */}
						<li className={styles.navItem}>
							<Link
								to="/console/profile"
								className={`${styles.navLink} ${isActive('/console/profile') ? styles.active : ''}`}
								onClick={handleLinkClick}
							>
								<i className="fas fa-user" />
								<span className={styles.navLabel}>Profile</span>
							</Link>
							{!isMobile && isSidebarClosed && (
								<div className={styles.hoverTooltip}>
									<div className={styles.tooltipTitle}>Profile</div>
								</div>
							)}
						</li>

						{/* Settings */}
						<li className={styles.navItem}>
							<Link
								to="/console/settings"
								className={`${styles.navLink} ${isActive('/console/settings') ? styles.active : ''}`}
								onClick={handleLinkClick}
							>
								<i className="fas fa-gear" />
								<span className={styles.navLabel}>Settings</span>
							</Link>
							{!isMobile && isSidebarClosed && (
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
		</>
	);
}
