import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './ProtectedRoute.module.css';

const LoadingSpinner = () => (
	<div className={styles.loadingContainer}>
		<div className={styles.loadingSpinner}></div>
	</div>
);

export default function ProtectedRoute({ children, requireAdmin = false }) {
	const { isAuthenticated, isLoading, user } = useAuth();
	const location = useLocation();

	if (location.pathname === '/console') {
		return <Navigate to="/console/dashboard" replace />;
	}

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (requireAdmin && user?.role !== 'admin') {
		return <Navigate to="/unauthorized" replace />;
	}

	return children;
}
