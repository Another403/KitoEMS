import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DatePicker from 'react-datepicker';
import Skeleton from 'react-loading-skeleton';

import { api } from '../../api.jsx';
import { LeaveColumns, LeaveButtons } from '../../utils/LeaveHelper';
import { useAuth } from '../../contexts/AuthContext';
import ListSkeleton from '../skeletons/ListSkeleton';

const LeavesList = () => {
	const { user } = useAuth();

	const [leaves, setLeaves] = useState([]);
	const [leavesLoading, setLeavesLoading] = useState(false);
	const [searchText, setSearchText] = useState("");

	const [startAfter, setStartAfter] = useState(null);
		const [endBefore, setEndBefore] = useState(null);

	const fetchLeaves = async () => {
		setLeavesLoading(true);
		try {
			const res = await api.get(`/Leaves/user/${user.id}`);

			if (res.status === 200)
			{
				const data = res.data.map((leave) => ({
					id: leave.id,
					userId: leave.userId,
					user: leave.user,
		  			startDate: new Date(leave.startDate).toLocaleDateString('en-GB'),
		  			endDate: new Date(leave.endDate).toLocaleDateString('en-GB'),

					// keep originals for filtering
					_startDate: new Date(leave.startDate),
		  			_endDate: new Date(leave.endDate),

		  			reason: leave.reason,
		  			status: leave.status,
					actions: (<LeaveButtons id={leave.id} handleDelete={handleDelete} status={leave.status}/>)
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

	const filteredLeaves = leaves
		.filter((leave) =>
			startAfter ? leave._startDate >= startAfter : true
		)
		.filter((leave) =>
			endBefore ? leave._endDate <= endBefore : true
		);

	return (
		<> { leavesLoading ?  <ListSkeleton/> :
			<div className='p-5'>
				<div className='text-center'>
					<h3 className='text-2xl font-bold'>Leaves</h3>
				</div>
				<div className='flex justify-between items-center'>
					<div className='flex gap-2'>
						{/* Date filtering */}
						<DatePicker
							selected={startAfter}
							onChange={setStartAfter}
							placeholderText="Start After"
							className="px-4 py-0.5 border border-gray-300 rounded-md w-50"
							dateFormat="dd/MM/yyyy"
							isClearable
						/>
						<DatePicker
							selected={endBefore}
							onChange={setEndBefore}
							placeholderText="End Before"
							className="px-4 py-0.5 border border-gray-300 rounded-md w-50"
							dateFormat="dd/MM/yyyy"
							isClearable
						/>
					</div>
					<Link to="/employee-dashboard/leaves/add" 
						className='px-4 py-1 bg-teal-600 rounded text-white'>
							Add leave
					</Link>
				</div>
				<div className='mt-5'>
					<DataTable
						columns={LeaveColumns}
						data={filteredLeaves}
						pagination
					/>
				</div>
		</div>
		} </>
	)
}

export default LeavesList