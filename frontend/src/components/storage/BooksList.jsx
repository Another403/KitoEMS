import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';

import { api } from '../../api';
import { BookColumns, BookButtons } from '../../utils/BookHelper';
import autoprefixer from 'autoprefixer';
import { useAuth } from '../../contexts/AuthContext';
import ListSkeleton from '../skeletons/ListSkeleton';

const BooksList = () => {
	const { user } = useAuth();

	const [books, setBooks] = useState([]);
	const [booksLoading, setBooksLoading] = useState(false);
	const [searchText, setSearchText] = useState("");

	const fetchBooks = async () => {
		setBooksLoading(true);
		try {
			const booksRes = await api.get('/Books');
			const storagesRes = await api.get('/Books/storages');

			const storages = storagesRes.data;

			const data = booksRes.data.map(book => {
				const storage = storages.find(s => s.id === book.id);
				return {
					id: book.id,
					name: book.name,
					author: book.author,
					price: book.price,
					quantity: storage ? storage.quantity : 0,
					actions: <BookButtons id={book.id} handleDelete={handleDelete} />
				};
			});

			setBooks(data);

		} catch (error) {
			console.log(error);
		} finally {
			setBooksLoading(false);
		}
	};

	const handleDelete = async (id) => {
		const data = books.filter(book => book.id !== id);
		setBooks(data);

		try {
			const res = await api.delete(`/Books/${id}`);
			await fetchBooks();
		} catch (error) {
			console.log(error);
			await fetchBooks();
		}
	}

	useEffect(() => {
		fetchBooks();
	}, []);

  	return (
		<>{booksLoading ? <ListSkeleton/> :
			<div className='p-5'>
				<div className='text-center'>
					<h3 className='text-2xl font-bold'>Storage</h3>
				</div>
				<div className='flex justify-between items-center'>
					<input type="text" placeholder='Search books by name'
						onChange={(e) => setSearchText(e.target.value)}
						className='px-4 py-0.5 border'>
					</input>
					<div className='flex space-x-2'>
						{(user.userRole === 'admin' || user.userRole === 'storage_manager') &&
							(<Link to="/admin-dashboard/storage/import" 
								className='px-4 py-1 bg-teal-600 rounded text-white'>
									Import
							</Link>)}
						{(user.userRole === 'admin' || user.userRole === 'storage_manager') &&
							(<Link to="/admin-dashboard/add-book" 
								className='px-4 py-1 bg-teal-600 rounded text-white'>
									Add new book
							</Link>)}
					</div>
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
