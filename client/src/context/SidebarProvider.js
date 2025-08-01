import React, { useState, useEffect } from 'react';
import { SidebarContext } from './SidebarContext';

export default function SidebarProvider({ children }) {
	const [isSidebarClosed, setIsSidebarClosed] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const check = () => {
			const mobile = window.innerWidth <= 689 || window.innerHeight <= 699;
			setIsMobile(mobile);
			if (!mobile) {
				const saved = localStorage.getItem('sidebarClosed');
				setIsSidebarClosed(saved ? JSON.parse(saved) : false);
			} else {
				setIsSidebarClosed(false);
			}
		};
		check();
		window.addEventListener('resize', check);
		return () => window.removeEventListener('resize', check);
	}, []);

	return (
		<SidebarContext.Provider value={{ isSidebarClosed, setIsSidebarClosed, isMobile }}>
			{children}
		</SidebarContext.Provider>
	);
}
