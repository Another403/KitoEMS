import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Navbar = () => {
	const { user, logout } = useAuth();

	return (
		<div className='flex items-center text-white justify-between h-12 bg-teal-500 px-5'>
			<p>Welcome {user.fullName}</p>
			<button className='px-4 py-1 bg-teal-700 hover:bg-teal-800 hover:cursor-pointer' onClick={logout}>Logout</button>
		</div>
	)
}

export default Navbar
