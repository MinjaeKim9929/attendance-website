import React from 'react';
import './Footer.css';

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="footer">
			<div className="footer-content">
				<div className="footer-main">
					<div className="footer-brand">
						<h3 className="footer-logo">AW</h3>
						<p className="footer-description">
							Simplifying attendance tracking and management for organizations of all sizes.
						</p>
					</div>

					<div className="footer-links-section">
						<div className="footer-column">
							<h4>Legal</h4>
							<ul>
								<li>
									<a href="/privacy-policy">Privacy Policy</a>
								</li>
								<li>
									<a href="/terms-of-service">Terms of Service</a>
								</li>
							</ul>
						</div>

						<div className="footer-column">
							<h4>Contact</h4>
							<ul>
								<li>
									<a href="mailto:minjaekim9929@gmail.com">minjaekim9929@gmail.com</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="footer-bottom">
					<p>&copy; {currentYear} Attendance Website. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
