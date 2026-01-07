import React from 'react'
import { Outlet } from 'react-router-dom';

import Navbar from '../components/dashboard/Navbar.jsx';
import HrManagerSidebar from '../components/dashboard/HrManagerSidebar.jsx';

const HrManagerDashboard = () => {
	return (
		<div className='flex'>
			<HrManagerSidebar/>
			<div className='flex-1 ml-64 bg-gray-100 h-screen'>
				<Navbar/>
				<Outlet/>
			</div>
		</div>
	)
}

export default HrManagerDashboard