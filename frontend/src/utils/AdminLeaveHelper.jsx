import { useNavigate } from "react-router-dom";

import { api } from '../api.jsx';

export const AdminLeaveColumns = [
	{
		name: "No.",
		cell: (row, index) => index + 1,
		maxWidth: "70px",
		right: true
	},
	{
		name: 'Employee name',
		selector : (row) => row.user.fullName,
		sortable: true,
		maxWidth: "300px",
	},
	{
		name: 'From',
		selector : (row) => row.startDate,
	},
	{
		name: 'To',
		selector : (row) => row.endDate,
	},
	{
		name: 'Reason',
		selector : (row) => row.reason,
	},
	{
		name: 'Status',
		selector : (row) => row.status,
	},
	{
		name: 'Rejection reason',
		selector : (row) => row.rejectionReason
	},
	{
		name: 'Leave type',
		selector: (row) => row.leaveType,
	},
	{
    name: 'Actions',
    cell: (row) => (
			<AdminLeaveButtons 
				id={row.id}
				status={row.status}
				handleDelete={row.handleDelete}
				handleApprove={row.handleApprove}
				handleReject={row.handleReject}
			/>
		),
		minWidth: "300px"
	}
]

export const AdminLeaveButtons = ({id, handleDelete, handleApprove, handleReject, status}) => {
	const navigate = useNavigate();

	return (
		<div className="flex space-x-3 whitespace-nowrap">
			<button className="px-3 py-1 bg-teal-600 text-white hover:cursor-pointer hover:bg-teal-800"
				onClick={() => navigate(`/admin-dashboard/leaves/edit/${id}`)}>
					Edit
			</button>
			<button className="px-3 py-1 bg-red-600 text-white hover:cursor-pointer hover:bg-red-800"
				onClick={() => handleDelete(id)}>
					Delete
			</button>
			<>{status === "approved" ? <></> :
				<button className="px-3 py-1 bg-green-600 text-white hover:cursor-pointer hover:bg-green-800"
					onClick={() => handleApprove(id)}>
						Approve
				</button>
			}</>
			<>{status === "rejected" ? <></> :
				<button className="px-3 py-1 bg-yellow-600 text-white hover:cursor-pointer hover:bg-yellow-800"
					//onClick={() => handleReject(id)}
					onClick={() => navigate(`/admin-dashboard/leaves/${id}/reject`)}>
						Reject
				</button>
			}</>
		</div>
	)
}