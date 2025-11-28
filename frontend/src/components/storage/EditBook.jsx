import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { api } from '../../api.jsx';

const EditBook = () => {
	const { id } = useParams();
	
	const [book, setBook] = useState({
		id: '',
		name: '',
		author: '',
		price: '',
		createdAt: '',
	});
	const [bookLoading, setBookLoading] = useState(false);

	useEffect(() => {
		const fetchBook = async () => {
			setBookLoading(true);
			try {
				const res = await api.get(`/Books/${id}`);

				if (res.status === 200) {
					setBook(res.data);
					//console.log(res.data);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setBookLoading(false);
			}
		};
		fetchBook();
	}, []);

	const navigate = useNavigate();

	const handleChange = (e) => {
		const {name, value} = e.target;
		setBook({...book, [name] : value});
	}

	const handleEditBook = async (e) => {
		e.preventDefault();
		try {
			const res = await api.put(`/Books/${id}`, book);

			if (res.data)
				navigate("/admin-dashboard/storage");
		} catch (error) {
			alert("Error");
		}
	}

	return (
		<>{bookLoading ? <div>Loading book...</div> :
		<div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96'>
			<h2 className='text-2xl font-bold mb-6'>Edit book</h2>
			<form onSubmit={handleEditBook}>
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
						Edit book
				</button>
				<button type="button"
					className='w-full mt-6 bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'
					onClick={() => navigate('/admin-dashboard/storage')}>
						Cancel
				</button>
			</form>
		</div>
		}</>
	)
}

export default EditBook
