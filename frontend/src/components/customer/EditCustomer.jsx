import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import { api } from '../../api';

const EditCustomer = () => {
	const { id } = useParams();

	const [customer, setCustomer] = useState({
		name: "",
		phoneNumber: "",
		points: 0
	});

	const navigate = useNavigate();

	const fetchCustomer = async () => {
		try {
			const res = await api.get(`/Customers/${id}`);

			if (res.status === 200) {
				setCustomer(res.data);
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		fetchCustomer();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCustomer(prev => ({
			...prev,
			[name]: name === "points" ? Number(value) : value
		}));
	}

	const handleEditCustomer = async (e) => {
		e.preventDefault();

		try {
			const res = await api.put(`/Customers/${id}`, customer);

			if (res.status === 200) {
				navigate("/admin-dashboard/customers");
			}
		} catch (error) {
			console.log(error);
			alert("Error updating customer");
		}
	}

	return (
		<div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-100'>
			<h2 className='text-2xl font-bold mb-6'>Edit Customer</h2>

			<form onSubmit={handleEditCustomer}>

				{/* Name */}
				<div className='mb-4'>
					<label className='text-sm font-medium text-gray-700'>Name</label>
					<input
						type="text"
						name="name"
						value={customer.name}
						onChange={handleChange}
						placeholder='Enter customer name'
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"
						required
					/>
				</div>

				{/* Phone number */}
				<div className='mb-4'>
					<label className='text-sm font-medium text-gray-700'>Phone Number</label>
					<input
						type="text"
						name="phoneNumber"
						value={customer.phoneNumber}
						onChange={handleChange}
						placeholder='Enter phone number'
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"
						required
					/>
				</div>

				{/* Points */}
				<div className='mb-4'>
					<label className='text-sm font-medium text-gray-700'>Points</label>
					<input
						type="number"
						name="points"
						value={customer.points}
						min="0"
						onChange={handleChange}
						placeholder='Enter points'
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				{/* Submit */}
				<button
					type="submit"
					className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'>
					Save Changes
				</button>

				{/* Cancel */}
				<button
					type="button"
					onClick={() => navigate('/admin-dashboard/customers')}
					className='w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
					Cancel
				</button>

			</form>
		</div>
	)
}

export default EditCustomer;