import React, { useContext, createContext, useState, useEffect } from "react";

import { api } from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const verifyUser = async () => {
			const token = localStorage.getItem('token');
			if (!token) {
				setLoading(false);
				return;
			}

			try {
				const res = await api.get("/AppUsers/verify");
				setUser(res.data.user);
			} catch (err) {
				localStorage.clear();
				setUser(null);
			}

			setLoading(false);
		}
		verifyUser();
	}, [])

	const login = (userData) => setUser(userData);
	const logout = () => {
		setUser(null);
		localStorage.clear();
	};

	return (
		<AuthContext.Provider value={{user, login, logout, loading}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);