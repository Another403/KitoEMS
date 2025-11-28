import { useNavigate } from "react-router-dom";

import { api } from '../api.jsx';

export const PayrollColumns = [
	{
		name: "No.",
		cell: (row, index) => index + 1,
		width: "70px",
		right: true
	},
	{
		name: 'Employee name',
		selector : (row) => row.employeeName,
		sortable: true
	},
	{
		name: 'Period',
		selector : (row) => row.period,
		sortable: true
	},
	{
		name: 'Base salary',
		selector : (row) => row.baseSalary.toFixed(2) + '$',
		sortable: true,
	},
	{
		name: 'Bonus',
		selector : (row) => row.bonus.toFixed(2) + '$',
		sortable: true,
	},
	{
		name: 'Total payment',
		selector : (row) => row.total.toFixed(2) + '$',
		sortable: true,
	},
	{
		name: 'Actions',
		cell : (row) => row.actions
	}
]

export const PayrollButtons = ({id, handleDelete}) => {
	const navigate = useNavigate();

	return (
		<div className="flex space-x-3">
			<button className="px-3 py-1 bg-teal-600 text-white hover:cursor-pointer hover:bg-teal-800"
				onClick={() => navigate(`/admin-dashboard/payrolls/edit/${id}`)}>
					Edit</button>
			<button className="px-3 py-1 bg-red-600 text-white hover:cursor-pointer hover:bg-red-800"
				onClick={() => handleDelete(id)}>
					Delete</button>
		</div>
	)
}