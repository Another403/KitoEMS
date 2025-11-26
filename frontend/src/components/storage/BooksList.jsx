import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';

import { api } from '../../api.jsx';
import { BookColumns, BookButtons } from '../../utils/BookHelper';
import autoprefixer from 'autoprefixer';

const BooksList = () => {
	const [books, setBooks] = useState([]);
	const [booksLoading, setBooksLoading] = useState(false);
	const [searchText, setSearchText] = useState("");

	const onBookDelete = async (id) => {
		const data = books.filter(book => book.id !== id);
		setBooks(data);
	}

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
						actions: (<BookButtons id={book.id} onBookDelete={onBookDelete}/>)
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
						onChange={(e) => setSearchText(e.target.value)}
						className='px-4 py-0.5 border'>
					</input>
					<Link to="/admin-dashboard/add-book" 
						className='px-4 py-1 bg-teal-600 rounded text-white'>
							Add new book
					</Link>
				</div>
				<div className='mt-5'>
					<DataTable
						columns={BookColumns}
						data={books.filter((book) =>
							book.name.toLowerCase().includes(searchText.toLowerCase())
						)}
						pagination
					/>
				</div>
			</div>
		}</>
	)
}

export default BooksList
