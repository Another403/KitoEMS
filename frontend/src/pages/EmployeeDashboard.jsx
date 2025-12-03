import React, { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext.jsx';

import AdminSidebar from '../components/dashboard/EmployeeSidebar.jsx';
import Navbar from '../components/dashboard/Navbar.jsx';

const EmployeeDashboard = () => {
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

export default EmployeeDashboard