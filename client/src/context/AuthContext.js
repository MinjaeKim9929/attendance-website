import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

//  Initial state
const initialState = {
	user: null,
	token: localStorage.getItem('token'),
	isAuthenticated: false,
	isLoading: true,
	error: null,
};

// Auth context
const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
	switch (action.type) {
		case 'SET_LOADING':
			return {
				...state,
				isLoading: action.payload,
			};
		case 'LOGIN_SUCCESS':
		case 'SIGNUP_SUCCESS':
			localStorage.setItem('token', action.payload.token);
			return {
				...state,
				user: action.payload.user,
				token: action.payload.token,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			};
		case 'LOGIN_FAIL':
		case 'SIGNUP_FAIL':
		case 'AUTH_ERROR':
			localStorage.removeItem('token');
			return {
				...state,
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
				error: action.payload,
			};
		case 'LOGOUT':
			localStorage.removeItem('token');
			return {
				...state,
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
				error: null,
			};
		case 'LOAD_USER_SUCCESS':
			return {
				...state,
				user: action.payload,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			};
		case 'CLEAR_ERROR':
			return {
				...state,
				error: null,
			};
		default:
			return state;
	}
};

// Auth provider component
export const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	// Set auth token in axios header
	const setAuthToken = useCallback((token) => {
		if (token) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		} else {
			delete axios.defaults.headers.common['Authorization'];
		}
	}, []);

	// Load user on app start
	const loadUser = useCallback(async () => {
		const token = localStorage.getItem('token'); // Get token directly from localStorage
		if (token) {
			setAuthToken(token);
			try {
				const res = await axios.get('http://localhost:4000/api/users/me');
				dispatch({
					type: 'LOAD_USER_SUCCESS',
					payload: res.data.data,
				});
			} catch (err) {
				dispatch({
					type: 'AUTH_ERROR',
					payload: err.response?.data?.message || 'Authentication failed',
				});
			}
		} else {
			dispatch({ type: 'SET_LOADING', payload: false });
		}
	}, [setAuthToken]);

	// Login user
	const login = useCallback(
		async (email, password) => {
			dispatch({ type: 'SET_LOADING', payload: true });

			try {
				const res = await axios.post('http://localhost:4000/api/users/login', {
					email,
					password,
				});

				dispatch({
					type: 'LOGIN_SUCCESS',
					payload: {
						user: res.data.data,
						token: res.data.data.token,
					},
				});

				setAuthToken(res.data.data.token);
				return { success: true };
			} catch (error) {
				const errorMessage = error.response?.data?.message || 'Login failed';
				dispatch({
					type: 'LOGIN_FAIL',
					payload: errorMessage,
				});
				return { success: false, error: errorMessage };
			}
		},
		[setAuthToken]
	);

	// Signup user
	const signup = useCallback(
		async (userData) => {
			dispatch({ type: 'SET_LOADING', payload: true });

			try {
				const res = await axios.post('http://localhost:4000/api/users/signup', userData);

				dispatch({
					type: 'SIGNUP_SUCCESS',
					payload: {
						user: res.data.data,
						token: res.data.data.token,
					},
				});

				setAuthToken(res.data.data.token);
				return { success: true };
			} catch (error) {
				const errorMessage = error.response?.data?.message || 'Signup failed';
				dispatch({
					type: 'SIGNUP_FAIL',
					payload: errorMessage,
				});
				return { success: false, error: errorMessage };
			}
		},
		[setAuthToken]
	);

	// Logout user
	const logout = useCallback(() => {
		setAuthToken(null);
		dispatch({ type: 'LOGOUT' });
	}, [setAuthToken]);

	// Clear errors
	const clearError = useCallback(() => {
		dispatch({ type: 'CLEAR_ERROR' });
	}, []);

	// Load user on mount - only runs once
	useEffect(() => {
		loadUser();
	}, []); // Empty dependency array is safe now because loadUser is memoized

	return (
		<AuthContext.Provider
			value={{
				...state,
				login,
				signup,
				logout,
				clearError,
				loadUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
