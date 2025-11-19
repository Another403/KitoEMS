import React from 'react';
import { useAuth } from '../contexts/authContext.jsx';

const Navbar = () => {
	const { user } = useAuth();

	return (
		<div className='flex justify-between h-12 bg-teal-600'>
			<button>Logout</button>
		</div>
	)
}

export default Navbar
