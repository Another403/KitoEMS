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
			var receiptPayload = { ...receipt };

			if (customerType === "Create new member") {
				const customerResponse = await api.post("/Customers", newCustomer);

				if (customerResponse.status !== 200) {
				return;
				}

				receiptPayload = { ...receiptPayload, customerPhone: newCustomer.phoneNumber };
			}

			if (customerType === "Member" && !receiptPayload.customerPhone) {
				return;
			}

			const res = await api.post("/Receipts", receiptPayload);

			if (res.status === 200)
				navigate(`/admin-dashboard/receipts/view/${res.data.id}`);
		} catch (error) {
			console.log(error);
		}
	}
	
	//add new customer
	const [newCustomer, setNewCustomer] = useState({});
	const handleNewCustomerChange = (e) => {
		const { name, value } = e.target;

		setNewCustomer(prev => ({
			...prev,
			[name]: value
		}));
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
						<option value="Create new member">Create new member</option>
					</select>
				</div>
				
				
				{/* Customer options */}
				{ customerType === 'Member' && (
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
				)}

				{customerType === 'Create new member' && (
					<div className='mt-4'>
						<h3 className='text-lg font-semibold mb-2'>New customer details</h3>
						<div className='mb-4'>
						<label className='text-sm font-medium text-gray-700'>Name</label>
						<input
							type="text"
							name="name"
							onChange={handleNewCustomerChange}
							placeholder='Enter customer name'
							className="mt-1 w-full p-2 border border-gray-300 rounded-md"
							required
						/>
						</div>
						<div className='mb-4'>
						<label className='text-sm font-medium text-gray-700'>Phone Number</label>
						<input
							type="text"
							name="phoneNumber"
							onChange={handleNewCustomerChange}
							placeholder='Enter phone number'
							className="mt-1 w-full p-2 border border-gray-300 rounded-md"
							required
						/>
						</div>
					</div>
				)}

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