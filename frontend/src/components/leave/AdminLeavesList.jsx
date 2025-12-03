import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';

import { api } from '../../api.jsx';
import { AdminLeaveColumns, AdminLeaveButtons } from '../../utils/AdminLeaveHelper';

const AdminLeavesList = () => {
	const [leaves, setLeaves] = useState([]);
	const [leavesLoading, setLeavesLoading] = useState(false);
	const [searchText, setSearchText] = useState("");

	const fetchLeaves = async () => {
		setLeavesLoading(true);
		try {
			const res = await api.get('/Leaves');

			if (res.status === 200)
			{
				const data = res.data.map((leave) => ({
					id: leave.id,
					userId: leave.userId,
					user: leave.user,
		  			startDate: new Date(leave.startDate).toLocaleDateString(),
		  			endDate: new Date(leave.endDate).toLocaleDateString(),
		  			reason: leave.reason,
		  			status: leave.status,
					actions: (<AdminLeaveButtons id={leave.id} handleDelete={handleDelete}/>)
				}));
				setLeaves(data);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLeavesLoading(false);
		}
	};

	useEffect(() => {
		fetchLeaves();
	}, []);

	const handleDelete = async (id) => {
		setLeaves(leaves.filter(leave => leave.id !== id));
		try {
			const res = await api.delete(`/Leaves/${id}`);
			await fetchLeaves();
		} catch (error) {
			console.log(error);
			await fetchLeaves();
		}
	}

	return (
		<> { leavesLoading ? <div>Loading leaves...</div> :
			<div className='p-5'>
				<div className='text-center'>
					<h3 className='text-2xl font-bold'>Leaves</h3>
				</div>
				<div className='flex justify-between items-center'>
					<input type="text" placeholder="Filter by employee name"
						onChange={(e) => setSearchText(e.target.value)}
						className='px-4 py-0.5 border'>
					</input>
					<Link to="/admin-dashboard/leaves/add" 
						className='px-4 py-1 bg-teal-600 rounded text-white'>
							Add leave
					</Link>
				</div>
				<div className='mt-5'>
					<DataTable
						columns={AdminLeaveColumns}
						data={leaves}
						pagination
					/>
				</div>
		</div>
		} </>
	)
}

export default AdminLeavesList