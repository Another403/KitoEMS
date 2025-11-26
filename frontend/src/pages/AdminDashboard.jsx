import React, { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext.jsx';

import AdminSidebar from '../components/dashboard/AdminSidebar.jsx';
import Navbar from '../components/dashboard/Navbar.jsx';
import AdminSummary from '../components/dashboard/AdminSummary.jsx';

const AdminDashboard = () => {
	const { user } = useAuth();

	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, []);

	return (
		<div className='flex'>
			<AdminSidebar/>
			<div className='flex-1 ml-64 bg-gray-100 h-screen'>
				<Navbar/>
				<Outlet/>
			</div>
		</div>
	)
}

export default AdminDashboard
