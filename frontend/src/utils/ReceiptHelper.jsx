import { useNavigate } from "react-router-dom";

import { api } from '../api.jsx';
import { useAuth } from "../contexts/AuthContext";

export const ReceiptColumns = [
	{
		name: "No.",
		cell: (row, index) => index + 1,
		maxWidth: "70px",
		right: true
	},
	{
		name: 'Employee',
		selector : (row) => row.employee,
	},
	{
		name: 'Customer name',
		selector : (row) => row.customerName,
	},
	{
		name: 'Phone number',
		selector : (row) => row.customerNumber,
	},
	{
		name: 'Points earned',
		selector : (row) => row.pointsEarned,
        sortable: true,
	},
	{
		name: 'Total amount',
		selector : (row) => row.total,
	},
	{
		name: 'Created at',
		selector : (row) => row.createdAt
	},
	{
		name: 'Actions',
		cell : (row) => row.actions,
		minWidth: "300px"
	}
]

export const ReceiptItemColumns = [
	{
		name: "No.",
		cell: (row, index) => index + 1,
		maxWidth: "70px",
		right: true
	},
	{
		name: 'Book name',
		selector : (row) => row.bookName,
		sortable: true,
	},
	{
		name: 'Author',
		selector : (row) => row.author,
		sortable: true,
	},
	{
		name: 'Unit price',
		selector : (row) => row.price,
		sortable: true,
	},
	{
		name: 'Quantity',
		selector : (row) => row.quantity,
        sortable: true,
	},
	{
		name: 'Sub total',
		selector : (row) => row.subTotal,
	},
	{
		name: 'Actions',
		cell : (row) => row.actions,
		minWidth: "300px"
	}
]

export const ReceiptButtons = ({id, handleDelete}) => {
	const navigate = useNavigate();

	return (
		<div className="flex space-x-3 whitespace-nowrap">
			<button className="px-3 py-1 bg-teal-600 text-white hover:cursor-pointer hover:bg-teal-800"
				onClick={() => navigate(`/admin-dashboard/receipts/view/${id}`)}>
					View
			</button>
			<button className="px-3 py-1 bg-red-600 text-white hover:cursor-pointer hover:bg-red-800"
				onClick={() => handleDelete(id)}>
					Delete
			</button>
		</div>
	)
}

export const ReceiptItemButtons = ({id, handleDelete, employeeId}) => {
	const navigate = useNavigate();
	const {user} = useAuth();

	return (
		<div className="flex space-x-3 whitespace-nowrap">
			{ user.role !== 'admin' && user.id !== employeeId ? <></> :
			<button className="px-3 py-1 bg-teal-600 text-white hover:cursor-pointer hover:bg-teal-800"
				onClick={() => navigate(`/admin-dashboard/receipts/item/edit/${id}`)}>
					Edit
			</button>
			}
			<button className="px-3 py-1 bg-red-600 text-white hover:cursor-pointer hover:bg-red-800"
				onClick={() => handleDelete(id)}>
					Delete
			</button>
		</div>
	)
}