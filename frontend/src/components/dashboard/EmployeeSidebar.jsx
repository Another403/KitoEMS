import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaInfo, FaUser, FaLayerGroup, FaCalendar, FaRegMoneyBillAlt } from 'react-icons/fa';

import { useAuth } from '../../contexts/AuthContext.jsx';

const EmployeeSidebar = () => {
	const { user } = useAuth();
	return (
		<div className='bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64'>
			<div className='bg-teal-600 h-12 flex items-center justify-center'>
				<h3 className='text-2xl text-center font-pacifico'>
					KitoERP
				</h3>
			</div>
			<div className='px-4'>
				<NavLink to='/employee-dashboard'
					className={({isActive}) => `${isActive ? "bg-teal-500" : " " } flex items-center space-x-4 block py-2.5 px-4 rounded`}
					end>
					<FaTachometerAlt/>
					<span>Dashboard</span>
				</NavLink>
				<NavLink to={`/employee-dashboard/profile/${user.id}`}
					className={({isActive}) => `${isActive ? "bg-teal-500" : " " } flex items-center space-x-4 block py-2.5 px-4 rounded`}>
					<FaUser/>
					<span>Profile</span>
				</NavLink>
				<NavLink to='/employee-dashboard/storage'
					className={({isActive}) => `${isActive ? "bg-teal-500" : " " } flex items-center space-x-4 block py-2.5 px-4 rounded`}>
					<FaLayerGroup/>
					<span>Storage</span>
				</NavLink>
				<NavLink to='/employee-dashboard/payrolls'
					className={({isActive}) => `${isActive ? "bg-teal-500" : " " } flex items-center space-x-4 block py-2.5 px-4 rounded`}>
					<FaRegMoneyBillAlt/>
					<span>Payrolls</span>
				</NavLink>
				<NavLink to='/employee-dashboard/customers'
					className={({isActive}) => `${isActive ? "bg-teal-500" : " " } flex items-center space-x-4 block py-2.5 px-4 rounded`}>
					<FaLayerGroup/>
					<span>Customers</span>
				</NavLink>
				<NavLink to='/employee-dashboard/leaves'
					className={({isActive}) => `${isActive ? "bg-teal-500" : " " } flex items-center space-x-4 block py-2.5 px-4 rounded`}>
					<FaLayerGroup/>
					<span>Leaves</span>
				</NavLink>
			</div>
		</div>
	)
}

export default EmployeeSidebar
