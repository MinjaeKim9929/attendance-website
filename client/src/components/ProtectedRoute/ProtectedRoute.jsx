import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProtectedRoute.css';

// Loading component
const LoadingSpinner = () => (
	<div className="loading-container">
		<div className="loading-spinner"></div>
	</div>
);

// Protected Route Component
export default function ProtectedRoute({ children, requireAdmin = false }) {
	const { isAuthenticated, isLoading, user } = useAuth();
	const location = useLocation();

	// Show loading spinner while checking authentication
	if (isLoading) {
		return <LoadingSpinner />;
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// Check admin requirement
	if (requireAdmin && user?.role !== 'admin') {
		return <Navigate to="/unauthorized" replace />;
	}

	// User is authenticated and authorized
	return children;
}
