import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DatePicker from 'react-datepicker';

import { api } from '../../api.jsx';
import { ReceiptButtons, ReceiptColumns } from '../../utils/ReceiptHelper.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import ListSkeleton from '../skeletons/ListSkeleton.jsx';

const ReceiptList = () => {
	const [receipts, setReceipts] = useState([]);
	const [receiptsLoading, setReceiptsLoading] = useState(false);

	const fetchReceipts = async () => {
		setReceiptsLoading(true);
		try {
			const res = await api.get('/Receipts');
			
			console.log(res.data);

			const data = res.data.map((receipt) => ({
				employee: receipt.employee.userName,
				customerName: receipt.customer?.name ?? 'walk-in',
				customerNumber: receipt.customer?.phoneNumber ?? 'walk-in',
				total: receipt.total,
				pointsEarned: receipt.pointsEarned,
				createdAt: new Date(receipt.createdAt).toLocaleDateString('en-GB'),

				_createdAt: new Date(receipt.createdAt),

				actions: (<ReceiptButtons id={receipt.id} handleDelete={handleDelete}/>)
			}));

			setReceipts(data);
		} catch (error) {
			console.log(error);
		} finally {
			setReceiptsLoading(false);
		}
	}

	useEffect(() => {
		fetchReceipts();
	}, []);

	const handleDelete = async (id) => {
		setReceipts(receipts.filter(receipt => receipt.id !== id));
		try {
			const res = await api.delete(`/Receipts/${id}`);
			await fetchReceipts();
		} catch (error) {
			console.log(error);
			await fetchReceipts();
		}
	}

	return (
		<>{ receiptsLoading ? 
			<ListSkeleton/>:
			<div className='p-5'>
				<div className='text-center'>
					<h3 className='text-2xl font-bold'>Receipts</h3>
				</div>
				<div className='flex justify-between items-center'>
					<div className='flex gap-2'>
						{/* Date filtering */}
						<DatePicker
							placeholderText="Start After"
							className="px-4 py-0.5 border border-gray-300 rounded-md w-50"
							dateFormat="dd/MM/yyyy"
							isClearable
						/>
						<DatePicker
							placeholderText="End Before"
							className="px-4 py-0.5 border border-gray-300 rounded-md w-50"
							dateFormat="dd/MM/yyyy"
							isClearable
						/>
					</div>
					<Link to="/admin-dashboard/receipts/add" 
						className='px-4 py-1 bg-teal-600 rounded text-white'>
							Add Receipt
					</Link>
				</div>
				<div className='mt-5'>
					<DataTable
						columns={ReceiptColumns}
						data={receipts}
						pagination
					/>
				</div>
			</div>
		}</>
	)
}

export default ReceiptList