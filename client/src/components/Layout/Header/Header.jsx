import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../Button/Button';
import styles from './Header.module.css';
import { useAuth } from '../../../context/AuthContext';

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { isAuthenticated } = useAuth();

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<header className={styles.header}>
			<div className={styles.logo}>
				<Link to="/" className={styles.logoLink}>
					<h1 className={styles.logoText}>AW</h1>
				</Link>
			</div>
			<nav className={styles.navigation}>
				<ul className={styles.desktopMenu}>
					<li>
						<Link to="/" className={`${styles.navLink} ${styles.navHome}`}>
							Home
						</Link>
					</li>
					<li>Features</li>
					<li>About</li>
					{isAuthenticated ? (
						<li>
							<Link to="/console/home">
								<Button variant="primary" size="medium">
									Go to console
								</Button>
							</Link>
						</li>
					) : (
						<>
							<li>
								<Link to="/login" className={styles.navLink}>
									Login
								</Link>
							</li>
							<li>
								<Link to="/signup">
									<Button variant="primary" size="medium">
										Sign Up
									</Button>
								</Link>
							</li>
						</>
					)}
				</ul>

				<button
					className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
					onClick={toggleMenu}
					aria-label="Toggle mobile menu"
				>
					<span className={styles.hamburgerLine}></span>
					<span className={styles.hamburgerLine}></span>
					<span className={styles.hamburgerLine}></span>
				</button>
			</nav>

			<div className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ''}`}>
				<ul>
					<li>Features</li>
					<li>About</li>
					{isAuthenticated ? (
						<li>
							<Link to="/console/dashboard">
								<Button variant="primary" size="medium">
									Go to console
								</Button>
							</Link>
						</li>
					) : (
						<>
							<li>
								<Link to="/login" className={styles.navLink}>
									Login
								</Link>
							</li>
							<li>
								<Link to="/signup">
									<Button variant="primary" size="medium">
										Sign Up
									</Button>
								</Link>
							</li>
						</>
					)}
				</ul>
			</div>
		</header>
	);
}
