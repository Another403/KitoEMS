import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import DataTable from 'react-data-table-component';
import Select from 'react-select';

import "react-datepicker/dist/react-datepicker.css";
import { api } from '../../api'
import CustomInput from '../CustomInput';
import { ReceiptItemColumns } from '../../utils/ReceiptHelper.jsx';

const ViewReceipt = () => {
	const { id } = useParams();
	const [receipt, setReceipt] = useState({});
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState("");

	const fetchReceipt = async () => {
		setLoading(true);

		try {
			var res = await api.get(`/Receipts/${id}`);

			setReceipt({
				createdAt: res.data.createdAt,
				customerPhone: res.data.customerPhone,
				customerName: res.data.customer.name,
				total: res.data.total,
				employee: res.data.employee.userName,
			});

			console.log(res.data);

			var data = res.data.items.map((item) => ({
				bookName: item.book.name,
				quantity: item.quantity,
				author: item.book.author,
				price: item.unitPrice,
				subTotal: item.subTotal
			}));

			setItems(data);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchReceipt();
	}, [])

	return (
		<div className='p-5'>
			<div className='text-center'>
				<h3 className='text-2xl font-bold'>Receipt Items</h3>
			</div>
			<div className='flex justify-between items-center'>
				<input type="text" placeholder='Search books by name'
					onChange={(e) => setSearchText(e.target.value)}
					className='px-4 py-0.5 border'>
				</input>
				<Link to={`/admin-dashboard/receipts/${id}/items/add`}
					className='px-4 py-1 bg-teal-600 rounded text-white'>
						Add item
				</Link>
			</div>
			<div className='mt-5'>
				<DataTable
					columns={ReceiptItemColumns}
					data={items.filter((item) =>
						item.bookName.toLowerCase().includes(searchText.toLowerCase()))}
					pagination
				/>
			</div>
			<div className="mt-4 flex justify-between bg-white p-4 rounded shadow text-sm">
				<div className="space-y-1">
					<p>
						<span className="font-semibold">Employee:</span> {receipt.employee}
					</p>
					<p>
						<span className="font-semibold">Created:</span>{" "}
						{receipt.createdAt &&
							new Date(receipt.createdAt).toLocaleDateString('en-GB')}
					</p>
					<p>
						<span className="font-semibold">Total:</span> {receipt.total}$
					</p>
				</div>
				<div className="space-y-1 text-right">
					<p>
						<span className="font-semibold">Customer:</span> {receipt.customerName}
					</p>
					<p>
						<span className="font-semibold">Phone:</span> {receipt.customerPhone}
					</p>
				</div>
			</div>
		</div>
	)
}

export default ViewReceipt
