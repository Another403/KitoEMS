import React, { useState, useEffect } from 'react'
import { useActionData, useNavigate } from 'react-router-dom';
import Select from 'react-select';

import { api } from '../../api';
import CustomInput from '../CustomInput';
import { useAuth } from '../../contexts/AuthContext';

const AddReceipt = () => {
	const { user } = useAuth();

	const [receipt, setReceipt] = useState({
		items: [],
		employeeId: user.id,
	});

	const [customers, setCustomers] = useState([]);
	const [customerType, setCustomerType] = useState("Walk in");

	const navigate = useNavigate();

	const fetchCustomers = async () => {
		try {
			const res = await api.get('/Customers');

			if (res.status === 200)
			{
				const data = res.data.map((customer) => ({
					value: customer.phoneNumber,
					label:  `[${customer.phoneNumber}] ${customer.name}`
				}));
				setCustomers(data);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchCustomers();
	}, []);

	useEffect(() => {
		if (customerType === "Walk in") {
			setReceipt({
				...receipt,
				customerPhone: null
			});
		}
	}, [customerType]);

	const handleCustomerSelect = (e) => {
		setReceipt(prev => ({
		...prev,
		customerPhone: e.value
	}));
	}

	const handleAddReceipt = async (e) => {
		e.preventDefault();

		try {
			const res = await api.post("/Receipts", receipt);

			if (res.status === 200)
				navigate(`/admin-dashboard/receipts/view/${res.data.id}`);
		} 
		catch (error) {
			console.log(error);
		}
	}

	return (
		<div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-100'>
			<h2 className='text-2xl font-bold mb-6'>Add receipt</h2>

			<form onSubmit={handleAddReceipt}>
				<div>
					<label>Status</label>
					<select
						name="customerType"
						onChange={(e) => setCustomerType(e.target.value)}
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"
					>
						<option value="Walk in">Walk in</option>
						<option value="Member">Member</option>
					</select>
				</div>
				
				
				{/* Customer select */}
				{ customerType === 'Walk in' ? <> </> :
					<div>
						<label>Customer</label>
						<Select
							options={customers}
							onChange={handleCustomerSelect}
							placeholder="Select customer by phone"
							className="mb-4"
							isSearchable
						/>
					</div>
				}

				{/* SUBMIT */}
				<button
					type="submit"
					className='w-full mt-6 bg-teal-600 hover:bg-teal-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'>
					Add receipt
				</button>

				{/* CANCEL */}
				<button
					type="button"
					className='w-full mt-3 bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'
					onClick={() => navigate('/admin-dashboard/receipts')}>
					Cancel
				</button>

			</form>
		</div>
	)
}

export default AddReceipt;