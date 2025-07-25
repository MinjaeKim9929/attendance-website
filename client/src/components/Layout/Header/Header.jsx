import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../Button/Button';
import './Header.css';

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<header className="header">
			<div className="logo">
				<Link to="/" className="logo-link">
					<h1 className="logo-text">AW</h1>
				</Link>
			</div>
			<nav className="navigation">
				<ul className="desktop-menu">
					<li>
						<Link to="/" className="nav-link nav-home">
							Home
						</Link>
					</li>
					<li>Features</li>
					<li>About</li>
					<li>
						<Link to="/login" className="nav-link">
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
				</ul>

				<button
					className={`hamburger ${isMenuOpen ? 'active' : ''}`}
					onClick={toggleMenu}
					aria-label="Toggle mobile menu"
				>
					<span className="hamburger-line"></span>
					<span className="hamburger-line"></span>
					<span className="hamburger-line"></span>
				</button>
			</nav>

			<div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
				<ul>
					<li>Features</li>
					<li>About</li>
					<li>
						<Link to="/login" className="nav-link">
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
				</ul>
			</div>
		</header>
	);
}
