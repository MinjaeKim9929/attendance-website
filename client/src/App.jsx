import './App.css';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import NotFound from './pages/NotFound/NotFound';
import Home from './pages/Home';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login />} />
				<Route path="/" element={<Home />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
}
