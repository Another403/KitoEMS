import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';

import { api } from '../../api.jsx';
import { columns, DepartmentButtons } from '../../utils/DepartmentHelper';
import autoprefixer from 'autoprefixer';

const BooksList = () => {
	const [books, setBooks] = useState([]);
	const [booksLoading, setBooksLoading] = useState(false);

	useEffect(() => {
		const fetchBooks = async () => {
			setBooksLoading(true);
			try {
				const res = await api.get('/Books');

				if (res.status === 200)
				{
					const data = res.data.map((book) => ({
						name: book.name,
						author: book.author,
						price: book.price,
						actions: (<DepartmentButtons id={book.id}/>)
					}));
					setBooks(data);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setBooksLoading(false);
			}
		};
		fetchBooks();
	}, []);

  	return (
		<>{booksLoading ? <div>Loading...</div> :
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
				<div className='mt-5'>
					<DataTable
						columns={columns}
						data={books}
					/>
				</div>
			</div>
		}</>
	)
}

export default BooksList
