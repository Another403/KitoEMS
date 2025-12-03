import React, { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext.jsx';

import Navbar from '../components/dashboard/Navbar.jsx';
import EmployeeSidebar from '../components/dashboard/EmployeeSidebar.jsx';

const EmployeeDashboard = () => {
	return (
		<div className='flex'>
			<EmployeeSidebar/>
			<div className='flex-1 ml-64 bg-gray-100 h-screen'>
				<Navbar/>
				<Outlet/>
			</div>
		</div>
	)
}

export default EmployeeDashboard