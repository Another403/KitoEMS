import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { api } from '../../api';
import CustomInput from '../CustomInput';

const AddCustomer = ({phoneNumber}) => {
	const [customer, setCustomer] = useState({
		name: "",
		phoneNumber: phoneNumber,
		points: 0
	});

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;

		setCustomer(prev => ({
			...prev,
			[name]: name === "points" ? Number(value) : value
		}));
	}

	const handleAddCustomer = async (e) => {
		e.preventDefault();

		try {
			const res = await api.post("/Customers", customer);

			if (res.status === 200)
				navigate("/admin-dashboard/customers");
		} 
		catch (error) {
			console.log(error);
		}
	}

	return (
		<div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-100'>
			<h2 className='text-2xl font-bold mb-6'>Add Customer</h2>

			<form onSubmit={handleAddCustomer}>

				{/* NAME */}
				<div className='mb-4'>
					<label className='text-sm font-medium text-gray-700'>
						Name
					</label>
					<input
						type="text"
						name="name"
						onChange={handleChange}
						placeholder='Enter customer name'
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"
						required
					/>
				</div>

				{/* PHONE NUMBER */}
				<div className='mb-4'>
					<label className='text-sm font-medium text-gray-700'>
						Phone Number
					</label>
					<input
						type="text"
						name="phoneNumber"
						onChange={handleChange}
						placeholder='Enter phone number'
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"
						required
					/>
				</div>

				{/* POINTS */}
				<div className='mb-4'>
					<label className='text-sm font-medium text-gray-700'>
						Points (optional)
					</label>
					<input
						type="number"
						name="points"
						min="0"
						onChange={handleChange}
						placeholder='Enter points'
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				{/* SUBMIT */}
				<button
					type="submit"
					className='w-full mt-6 bg-teal-600 hover:bg-teal-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'>
					Add Customer
				</button>

				{/* CANCEL */}
				<button
					type="button"
					className='w-full mt-3 bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'
					onClick={() => navigate('/admin-dashboard/customers')}>
					Cancel
				</button>

			</form>
		</div>
	)
}

export default AddCustomer;