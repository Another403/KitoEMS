import { useNavigate } from "react-router-dom";

import { api } from '../api.jsx';

export const CustomerColumns = [
	{
		name: "No.",
		cell: (row, index) => index + 1,
		maxWidth: "70px",
		right: true
	},
	{
		name: 'Customer name',
		selector : (row) => row.name,
		sortable: true,
		maxWidth: "300px",
	},
	{
		name: 'Phone number',
		selector : (row) => row.phoneNumber,
	},
	{
		name: 'Points',
		selector : (row) => row.points,
        sortable: true,
	},
	{
		name: 'Rank',
		selector : (row) => row.rank,
	},
	{
		name: 'Actions',
		cell : (row) => row.actions,
		minWidth: "300px"
	}
]

export const CustomerButtons = ({id, handleDelete}) => {
	const navigate = useNavigate();

	return (
		<div className="flex space-x-3 whitespace-nowrap">
			<button className="px-3 py-1 bg-teal-600 text-white hover:cursor-pointer hover:bg-teal-800"
				onClick={() => navigate(`/admin-dashboard/customers/edit/${id}`)}>
					Edit
			</button>
			<button className="px-3 py-1 bg-red-600 text-white hover:cursor-pointer hover:bg-red-800"
				onClick={() => handleDelete(id)}>
					Delete
			</button>
		</div>
	)
}