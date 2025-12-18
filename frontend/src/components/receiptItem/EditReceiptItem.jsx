import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

import { api } from '../../api';
import CustomInput from '../CustomInput';

const EditReceiptItem = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [item, setItem] = useState({});
	const [books, setBooks] = useState([]);

	const fetchBooks = async () => {
		try {
			const booksRes = await api.get('/Books');

			const data = booksRes.data.map(book => {
				return {
					value: book.id,
					label: book.name,
				};
			});

			setBooks(data);
		} catch (error) {
			console.log(error);
		}
	};

	const fetchItem = async () => {
		try {
			const res = await api.get(`/Receipts/items/${id}`);

			if (res.status === 200) {
				setItem(res.data);

				console.log(res.data);
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		fetchBooks();
	}, []);

	useEffect(() => {
		fetchItem();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;

		setItem(prev => ({
			...prev,
			[name]: value === "" ? null : Number(value)
		}));
	}

	const handleAddReceiptItem = async (e) => {
		e.preventDefault();
		console.log(item);
		try {
			const res = await api.put(`/Receipts/items/${id}`, item);

			if (res.status === 200)
				navigate(`/admin-dashboard/receipts/view/${item.receiptId}`);
		} 
		catch (error) {
			console.log(error);
		}
	}

	const handleBookSelect = (e) => {
		setItem({
			...item, 
			bookId: e.value,
		});
	}

	return (
		<div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-100'>
			<h2 className='text-2xl font-bold mb-6'>Add receipt item</h2>
			<form onSubmit={handleAddReceiptItem}>
				{/* ITEM */}
				<div>
					<label>Book</label>
					<Select
						options={books}
						value={item.bookId ? books.find(b => b.value === item.bookId) : null}

						onChange={handleBookSelect}
						placeholder="Select a book to add"
						className="mb-4"
					/>
				</div>

				{/* UNIT PRICE */}
				<div className='mb-4'>
					<label className='text-sm font-medium text-gray-700'>
						Unit price (optional)
					</label>
					<input
						type="number"
						name="unitPrice"
						min="0"
						step="0.01"
						value={item.unitPrice}
						placeholder='Enter unit price'
						onChange={handleChange}
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				{/* QUANTITY */}
				<div className='mb-4'>
					<label className='text-sm font-medium text-gray-700'>
						Quantity
					</label>
					<input
						type="number"
						name="quantity"
						min="0"
						value={item.quantity}
						placeholder='Enter quantity'
						onChange={handleChange}
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				{/* SUBMIT */}
				<button
					type="submit"
					className='w-full mt-6 bg-teal-600 hover:bg-teal-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'>
					Edit item
				</button>

				{/* CANCEL */}
				<button
					type="button"
					className='w-full mt-3 bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'
					onClick={() => navigate(`/admin-dashboard/receipts/view/${item.receiptId}`)}>
					Cancel
				</button>

			</form>
		</div>
	)
}

export default EditReceiptItem;