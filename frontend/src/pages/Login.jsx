import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '../api';
import { useAuth } from '../contexts/authContext.jsx';

const Login = () => {
	const [error, setError] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const { login } = useAuth();

	const navigate = useNavigate();

	const handleLogin = async (e) => {
		setError("");
		e.preventDefault();
		try {
			const res = await api.post("/AppUsers/login", {
				username: username,
				password: password
			});

			login(res.data.user);
			localStorage.setItem("token", res.data.token);
			localStorage.setItem("refreshToken", res.data.refreshToken);

			if (res.data.user.userRole === "admin") {
				navigate('/admin-dashboard');
			} else {
				navigate('/employee-dashboard');
			}

			console.log(localStorage.getItem("token"));
			console.log(localStorage.getItem("refreshToken"));
		} catch (error) {
			setError("Error");
		}
	}

	return (
		<div className="flex flex-col items-center h-screen justify-center
						bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6">
			<h2 className="font-pacifico text-3xl text-white">
				Kito - Enterprise Resource Planning
			</h2>
			<div className="border shadow p-6 w-80 bg-white">
				<h2 className="text-2xl font-bold mb-4">
					Login
				</h2>
				{error && <p className='text-red-500'>{error}</p>}
				<form onSubmit={handleLogin}>
					<div className="mb-4">
						<label htmlFor="username" className="block text-gray-700">
							Username
						</label>
						<input type="username" placeholder="Enter username"
							className="w-full px-3 py-2 border"
							onChange={(e) => setUsername(e.target.value)}>
						</input>
					</div>
					<div className="mb-4">
						<label htmlFor="password" className="block text-gray-700">
							Password
						</label>
						<input type={showPassword ? "text" : "password"} placeholder="*******"
							className="w-full px-3 py-2 border"
							onChange={(e) => setPassword(e.target.value)}
							required>	
						</input>
					</div>
					<div className="mb-4 flex items-center justify-between">
						<label className="inline-flex items-center">
							<input type="checkbox" className='form-checkbox'></input>
							<span className="ml-2 text-gray-700">Remember me</span>
						</label>
						<a href="#" className="text-teal-600">Forgot password?</a>
					</div>
					<div>
						<label className="inline-flex items-center">
							<input type="checkbox" className='form-checkbox'
								checked={showPassword}
								onChange={() => setShowPassword(!showPassword)}></input>
							<span className="ml-2 text-gray-700">Show Password</span>
						</label>
					</div>
					<div className="mb-4">
						<button type="submit" 
							className="w-full bg-teal-600 hover:bg-teal-800 hover:cursor-pointer
							 		   text-white py-2"
						>
							Login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;