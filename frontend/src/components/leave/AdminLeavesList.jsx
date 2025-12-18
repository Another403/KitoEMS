import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DatePicker from 'react-datepicker';

import { api } from '../../api.jsx';
import { AdminLeaveColumns, AdminLeaveButtons } from '../../utils/AdminLeaveHelper';
import CustomInput from '../CustomInput';
import ListSkeleton from '../skeletons/ListSkeleton';

const AdminLeavesList = () => {
	const [leaves, setLeaves] = useState([]);
	const [leavesLoading, setLeavesLoading] = useState(false);
	const [searchText, setSearchText] = useState("");

	const [startAfter, setStartAfter] = useState(null);
	const [endBefore, setEndBefore] = useState(null);

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
		  			startDate: new Date(leave.startDate).toLocaleDateString('en-GB'),
		  			endDate: new Date(leave.endDate).toLocaleDateString('en-GB'),
					leaveType: leave.leaveType,

					// keep originals for filtering
					_startDate: new Date(leave.startDate),
		  			_endDate: new Date(leave.endDate),

		  			reason: leave.reason,
		  			status: leave.status,
				}));
				setLeaves(data);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLeavesLoading(false);
		}
	};

	const fetchLeavesDirect = async () => {
		try {
			const res = await api.get('/Leaves');
			return res.data.map((leave) => ({
				id: leave.id,
				userId: leave.userId,
				user: leave.user,
				startDate: new Date(leave.startDate).toLocaleDateString('en-GB'),
				endDate: new Date(leave.endDate).toLocaleDateString('en-GB'),
				leaveType: leave.leaveType,

				_startDate: new Date(leave.startDate),
				_endDate: new Date(leave.endDate),

				reason: leave.reason,
				status: leave.status,
				actions: null
			}));
		} catch (err) {
			console.log(err);
			return [];
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

	const handleApprove = async (id) => {
		setLeaves(prev =>
			prev.map(l => l.id === id ? { ...l, status: "approved" } : l)
		);
		try {
			await api.put(`/Leaves/approve/${id}`);
		} catch (error) {
			console.log(error);
			setLeaves(await fetchLeavesDirect());
		}
	};

	const handleReject = async (id) => {
		setLeaves(prev =>
			prev.map(l => l.id === id ? { ...l, status: "rejected" } : l)
		);
		try {
			await api.put(`/Leaves/reject/${id}`);
		} catch (error) {
			console.log(error);
			setLeaves(await fetchLeavesDirect());
		}
	};

	const filteredLeaves = leaves
		.filter((leave) =>
			leave.user.fullName.toLowerCase().includes(searchText.toLowerCase())
		)
		.filter((leave) =>
			startAfter ? leave._startDate >= startAfter : true
		)
		.filter((leave) =>
			endBefore ? leave._endDate <= endBefore : true
		);

	return (
		<> { leavesLoading ? <ListSkeleton/> : 
			<div className='p-5'>
				<div className='text-center'>
					<h3 className='text-2xl font-bold'>Leaves</h3>
				</div>
				<div className='flex justify-between items-center gap-2'>
					<div className='flex flex-col gap-2'>
						<input type="text" placeholder="Filter by employee name"
							onChange={(e) => setSearchText(e.target.value)}
							className='px-4 py-0.5 border border-gray-300 rounded-md'>
						</input>
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
					</div>

					<Link to="/admin-dashboard/leaves/add" 
						className='px-4 py-1 bg-teal-600 rounded text-white'>
							Add leave
					</Link>
				</div>
				<div className='mt-5'>
					<DataTable
						columns={AdminLeaveColumns}
						data={filteredLeaves.map(l => ({
							...l,
							handleDelete,
							handleApprove,
							handleReject
						}))}
						pagination
					/>
				</div>
		</div>
		} </>
	)
}

export default AdminLeavesList