import React from 'react'
import { Link } from 'react-router-dom';

const BooksList = () => {
  	return (
		<div className='p-5'>
			<div className='text-center'>
				<h3 className='text-2xl font-bold'>Storage</h3>
			</div>
			<div className='flex justify-between items-center'>
				<input type="text" placeholder='Search books by name' 
					className='px-4 py-0.5 border'>
				</input>
				<Link to="/admin-dashboard/add-book" 
					className='px-4 py-1 bg-teal-600 rounded text-white'>
						Add new book
				</Link>
			</div>
		</div>
	)
}

export default BooksList
