import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

import "react-datepicker/dist/react-datepicker.css";
import { api } from '../../api'
import CustomInput from '../CustomInput';

const ImportBook = () => {
	const [importData, setImportData] = useState({
		quantity: 0,
	});
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [bookId, setBookId] = useState(null);

	const navigate = useNavigate();

	const fetchBooks = async () => {
		setLoading(true);
		try {
			const res = await api.get('/Books');
			if (res.status === 200) {
				const data = res.data.map(book => ({
					value: book.id,
					label: book.name
				}));
				setBooks(data);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBooks();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setImportData({ ...importData, [name]: value });
	};

	const handleBookSelect = (e) => {
		setBookId(e.value);
	};

	const handleSubmitImport = async (e) => {
		e.preventDefault();
		try {
			console.log(bookId);
			const res = await api.put(`/Books/storages/${bookId}`, importData);
			if (res.data)
				navigate("/admin-dashboard/storage");
		} catch (error) {
			console.log(error);
			alert("Import failed");
		}
	};

	return (
		<div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96'>
			<h2 className='text-2xl font-bold mb-6'>Import Books</h2>
			<form onSubmit={handleSubmitImport}>
				<div className='mb-4'>
					<label className='text-sm font-medium text-gray-700 mb-2 block'>
						Select Book
					</label>
					<Select
						options={books}
						onChange={handleBookSelect}
						placeholder="Type to search book..."
						isSearchable={true}
					/>
				</div>

				<div className='grid grid-cols-2 gap-6'>
					<div>
						<label className='text-sm font-medium text-gray-700'>
							Quantity
						</label>
						<input
							type="number"
							min="1"
							name="quantity"
							onChange={handleChange}
							placeholder='Enter quantity'
							className="mt-1 w-full p-2 border border-gray-300 rounded-md"
						/>
					</div>
				</div>
				<button
					type="submit"
					className='w-full mt-6 bg-teal-600 hover:bg-teal-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'>
					Import Book
				</button>
				<button
					type="button"
					className='w-full mt-3 bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'
					onClick={() => navigate('/admin-dashboard/books')}>
					Cancel
				</button>
			</form>
		</div>
	);
};

export default ImportBook;