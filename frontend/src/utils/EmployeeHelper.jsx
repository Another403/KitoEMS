import { useNavigate } from "react-router-dom";

import { api } from '../api.jsx';

export const EmployeeColumns = [
	{
		name: "No.",
		cell: (row, index) => index + 1,
		maxWidth: "70px",
		right: true
	},
	{
		name: 'Full name',
		selector : (row) => row.fullName,
		sortable: true,
		maxWidth: "300px",
	},
	{
		name: 'Username',
		selector : (row) => row.username,
		sortable: true,
		maxWidth: "150px"
	},
	{
		name: 'Role',
		selector : (row) => row.userRole,
	},
	{
		name: 'Email',
		selector : (row) => row.email
	},
	{
		name: 'Base salary',
		selector : (row) => row.salary.toFixed(2) + '$',
		sortable: true
	},
	{
		name: 'Actions',
		cell : (row) => row.actions,
		minWidth: "300px"
	}
]

export const EmployeeButtons = ({id, deleteable, handleDelete}) => {
	const navigate = useNavigate();

	return (
		<div className="flex space-x-3 whitespace-nowrap">
			<button className="px-3 py-1 bg-teal-600 text-white hover:cursor-pointer hover:bg-teal-800"
				onClick={() => navigate(`/admin-dashboard/employees/edit/${id}`)}>
					Edit
			</button>
			<button className="px-3 py-1 bg-green-600 text-white hover:cursor-pointer hover:bg-green-800"
				onClick={() => navigate(`/admin-dashboard/employees/${id}`)}>
					View
			</button>
			{ deleteable ? 
			<button className="px-3 py-1 bg-red-600 text-white hover:cursor-pointer hover:bg-red-800"
				onClick={() => handleDelete(id)}>
					Delete
			</button>
			: <></>}
		</div>
	)
}