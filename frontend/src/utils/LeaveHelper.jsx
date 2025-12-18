import { useNavigate } from "react-router-dom";

import { api } from '../api.jsx';

export const LeaveColumns = [
	{
		name: "No.",
		cell: (row, index) => index + 1,
		maxWidth: "70px",
		right: true
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
		name: 'Status',
		selector : (row) => row.status,
	},
	{
		name: 'Rejection reason',
		selector : (row) => row.rejectionReason || 'Not provided',
	},
	{
		name: 'Reason',
		selector : (row) => row.reason,
	},
	{
		name: 'Leave type',
		selector: (row) => row.leaveType,
	},
	{
		name: 'Actions',
		cell : (row) => row.actions,
		minWidth: "300px"
	}
]

export const LeaveButtons = ({id, handleDelete, status}) => {
	const navigate = useNavigate();

	return (
		<> {status !== "pending" ? <>None</> :
			<div className="flex space-x-3 whitespace-nowrap">
				<button className="px-3 py-1 bg-teal-600 text-white hover:cursor-pointer hover:bg-teal-800"
					onClick={() => navigate(`/employee-dashboard/leaves/edit/${id}`)}>
						Edit
				</button>
			</div>
		} </>
	)
}