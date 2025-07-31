import './App.css';
import Home from './pages/Home';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Unauthorized from './pages/Unauthorized/Unauthorized';
import DashboardHome from './pages/Dashboard/DashboardHome';
import Profile from './pages/Dashboard/Profile/Profile';
import Settings from './pages/Dashboard/Settings/Settings';
import NotFound from './pages/NotFound/NotFound';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					{/* Public Routes */}
					<Route path="/" element={<Home />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />
					<Route path="/unauthorized" element={<Unauthorized />} />

					{/* Protected Routes - User and Admin */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<DashboardHome />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/dashboard/profile"
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/dashboard/settings"
						element={
							<ProtectedRoute>
								<Settings />
							</ProtectedRoute>
						}
					/>

					{/* 404 Page */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}
