import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';

import { api } from '../../api.jsx';
import { CustomerColumns, CustomerButtons } from '../../utils/CustomerHelper';

const CustomersList = () => {
	const [customers, setCustomers] = useState([]);
	const [customersLoading, setCustomersLoading] = useState(false);
	const [searchText, setSearchText] = useState("");

	const fetchCustomers = async () => {
		setCustomersLoading(true);
		try {
			const res = await api.get('/Customers');

			if (res.status === 200)
			{
				const data = res.data.map((customer) => ({
					id: customer.id,
					name: customer.name,
					phoneNumber: customer.phoneNumber,
					points: customer.points,
					rank: customer.rank,
					actions: (<CustomerButtons id={customer.id} handleDelete={handleDelete}/>)
				}));
				setCustomers(data);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setCustomersLoading(false);
		}
	};

	useEffect(() => {
		fetchCustomers();
	}, []);

	const handleDelete = async (id) => {
		setCustomers(customers.filter(customer => customer.id !== id));
		try {
			const res = await api.delete(`/Customers/${id}`);
			await fetchCustomers();
		} catch (error) {
			console.log(error);
			await fetchCustomers();
		}
	}

	return (
		<div className='p-5'>
			<div className='text-center'>
				<h3 className='text-2xl font-bold'>Customers</h3>
			</div>
			<div className='flex justify-between items-center'>
				<input type="text" placeholder='Search cutomers by name'
					onChange={(e) => setSearchText(e.target.value)}
					className='px-4 py-0.5 border'>
				</input>
				<Link to="/admin-dashboard/customers/add" 
					className='px-4 py-1 bg-teal-600 rounded text-white'>
						Add customer
				</Link>
			</div>
			<div className='mt-5'>
				<DataTable
					columns={CustomerColumns}
					data={customers}
					pagination
				/>
			</div>
		</div>
	)
}

export default CustomersList
