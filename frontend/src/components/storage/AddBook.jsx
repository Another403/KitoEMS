import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { api } from '../../api'
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardBasePath } from '../../utils/dashboardPaths';

const AddBook = () => {
	const [book, setBook] = useState({
		name: '',
		author: '',
		price: 0
	});

	const navigate = useNavigate();
	const { user } = useAuth();
	const basePath = getDashboardBasePath(user?.userRole);

	const handleChange = (e) => {
		const {name, value} = e.target;
		setBook({...book, [name] : value});
	}

	const handleAddBook = async (e) => {
		e.preventDefault();
		try {
			const res = await api.post("/Books", book);

			if (res.data)
				navigate(`${basePath}/storage`);
		} catch (error) {
			alert("Error");
		}
	}

	return (
		<div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96'>
			<h2 className='text-2xl font-bold mb-6'>Add book</h2>
			<form onSubmit={handleAddBook}>
				<div>
					<label htmlFor="name"
						className='text-sm font-medium text-gray-700'>
							Book name
					</label>
					<input type="text" name="name"
						value={book.name} onChange={handleChange}
						placeholder='Enter book name' required
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"></input>
				</div>
				<div className='grid grid-cols-2 gap-6'>
					<div>
					<label htmlFor="author"
						className='text-sm font-medium text-gray-700'>
							Author
					</label>
					<input type="text" name="author"
						value={book.author} onChange={handleChange}
						placeholder='Enter book name' required
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"></input>
					</div>
					<div>
						<label htmlFor="price"
							className='text-sm font-medium text-gray-700'>
								Price
						</label>
						<input type="number" step="0.01" min="0" name="price"
							value={book.price} onChange={handleChange}
							placeholder='Enter book name' required
							className="mt-1 w-full p-2 border border-gray-300 rounded-md"></input>
					</div>
				</div>
				<button type="submit"
					className='w-full mt-6 bg-teal-600 hover:bg-teal-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'>
						Add book
				</button>
			</form>
		</div>
	)
}

export default AddBook
