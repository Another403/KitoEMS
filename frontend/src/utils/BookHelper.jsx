import { useNavigate } from "react-router-dom";

import { api } from '../api.jsx';

export const BookColumns = [
	{
		name: "No.",
		cell: (row, index) => index + 1,
		width: "70px",
		right: true
	},
	{
		name: 'Name',
		selector : (row) => row.name,
		sortable: true
	},
	{
		name: 'Author',
		selector : (row) => row.author,
		sortable: true
	},
	{
		name: 'Price',
		selector : (row) => row.price.toFixed(2) + '$',
		sortable: true,
		right: true
	},
	{
		name: 'Actions',
		cell : (row) => row.actions
	}
]

export const BookButtons = ({id, handleDelete}) => {
	const navigate = useNavigate();

	return (
		<div className="flex space-x-3">
			<button className="px-3 py-1 bg-teal-600 text-white hover:cursor-pointer hover:bg-teal-800"
				onClick={() => navigate(`/admin-dashboard/storage/${id}`)} > 
					Edit</button>
			<button className="px-3 py-1 bg-red-600 text-white hover:cursor-pointer hover:bg-red-800"
				onClick={() => handleDelete(id)}>
					Delete</button>
		</div>
	)
}