import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';

import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../CustomInput';

const AddReceipt = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [selectedUser, setSelectedUser] = useState(null);
	const [booksOptions, setBooksOptions] = useState([]);
	const [items, setItems] = useState([]);
	const [selectedBook, setSelectedBook] = useState(null);
	const [period, setPeriod] = useState(new Date());

	// Load books when typing in Select
	const loadBooks = async (inputValue) => {
		if (!inputValue) return;

		const res = await api.get(`/Books/search?query=${inputValue}`);
		const options = res.data.map((b) => ({
			value: b.id,
			label: `${b.name} (${b.price}₫)`,
			book: b
		}));

		setBooksOptions(options);
	};

	const handleSelectBook = (option) => {
		if (!option) return;

		const exists = items.find(i => i.book.id === option.book.id);
		if (exists) return;

		setItems([...items, {
			book: option.book,
			bookId: option.book.id,
			quantity: 1
		}]);

		setSelectedBook(null);
	};

	const updateQuantity = (bookId, qty) => {
		setItems(items.map(i => 
			i.bookId === bookId ? { ...i, quantity: qty } : i
		));
	};

	const removeItem = (bookId) => {
		setItems(items.filter(i => i.bookId !== bookId));
	};

	const totalAmount = items.reduce(
		(sum, i) => sum + i.book.price * i.quantity,
		0
	);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (items.length === 0) {
			alert("Please add at least one item.");
			return;
		}

		const payload = {
			employeeId: user?.id,
			customerPhone: selectedUser?.phone || null,
			period: period,
			items: items.map(i => ({
				bookId: i.bookId,
				quantity: i.quantity
			}))
		};

		await api.post("/Receipts", payload);

		alert("Receipt created!");
		navigate("/admin-dashboard/receipts");
	};

	return (
		<div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-100'>
			<h2 className='text-2xl font-bold mb-6'>Create Receipt</h2>

			<form onSubmit={handleSubmit}>
				{/* SELECT USER */}
				<div className='mb-4'>
					<label className='text-sm font-medium text-gray-700 mb-2 block'>
						Select User
					</label>
					<Select
						placeholder="Type to search user by name..."
						isSearchable={true}
						onInputChange={loadBooks}
						options={booksOptions}
						value={selectedBook}
						onChange={(opt) => {
							setSelectedBook(opt);
							handleSelectBook(opt);
						}}
					/>
				</div>

				{/* ITEMS TABLE */}
				<div className='border rounded p-4 mt-4'>
					<h3 className='font-bold mb-3'>Receipt Items</h3>

					{items.length === 0 && (
						<p className='text-gray-500'>No items added yet.</p>
					)}

					{items.length > 0 && (
						<table className='w-full text-left'>
							<thead>
								<tr className='border-b'>
									<th className='py-2'>Book</th>
									<th className='py-2'>Price</th>
									<th className='py-2'>Quantity</th>
									<th className='py-2'>Total</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{items.map(i => (
									<tr key={i.bookId} className='border-b'>
										<td className='py-2'>{i.book.name}</td>
										<td className='py-2'>{i.book.price.toLocaleString()}₫</td>
										<td className='py-2'>
											<input
												type="number"
												min="1"
												value={i.quantity}
												onChange={(e) =>
													updateQuantity(i.bookId, Number(e.target.value))
												}
												className='w-20 p-1 border rounded'
											/>
										</td>
										<td className='py-2'>
											{(i.book.price * i.quantity).toLocaleString()}₫
										</td>
										<td>
											<button
												type="button"
												className='text-red-600 font-bold'
												onClick={() => removeItem(i.bookId)}
											>
												X
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}

					{/* TOTAL */}
					<div className='text-right font-bold mt-3'>
						Total: {totalAmount.toLocaleString()}₫
					</div>
				</div>

				{/* PERIOD */}
				<div className='mt-6'>
					<label className='text-sm font-medium block text-gray-700'>
						Period
					</label>
					<DatePicker
						dateFormat="MM/yyyy"
						showMonthYearPicker
						selected={period}
						onChange={setPeriod}
						customInput={<CustomInput />}
					/>
				</div>

				{/* BUTTONS */}
				<button
					type="submit"
					className='w-full mt-6 bg-teal-600 hover:bg-teal-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'
				>
					Add Receipt
				</button>

				<button
					type="button"
					className='w-full mt-3 bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'
					onClick={() => navigate('/admin-dashboard/payrolls')}
				>
					Cancel
				</button>
			</form>
		</div>
	);
};

export default AddReceipt;