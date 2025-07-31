import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className={styles.footer}>
			<div className={styles.footerContent}>
				<div className={styles.footerMain}>
					<div className={styles.footerBrand}>
						<h3 className={styles.footerLogo}>AW</h3>
						<p className={styles.footerDescription}>
							Simplifying attendance tracking and management for organizations of all sizes.
						</p>
					</div>

					<div className={styles.footerLinksSection}>
						<div className={styles.footerColumn}>
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

						<div className={styles.footerColumn}>
							<h4>Contact</h4>
							<ul>
								<li>
									<a href="mailto:minjaekim9929@gmail.com">minjaekim9929@gmail.com</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className={styles.footerBottom}>
					<p>&copy; {currentYear} Attendance Website. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
