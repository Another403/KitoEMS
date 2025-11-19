import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/authContext.jsx';

import AdminSidebar from '../components/AdminSidebar.jsx';
import Navbar from '../components/Navbar.jsx';

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
			<div className='flex-1 ml-64'>
				<Navbar/>
			</div>
		</div>
	)
}

export default AdminDashboard
