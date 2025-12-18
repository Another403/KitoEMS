import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import Select from "react-select";

import { api } from "../../api";
import CustomInput from '../CustomInput';

import "react-datepicker/dist/react-datepicker.css";

const AdminAddLeave = () => {
	const [leave, setLeave] = useState({
		userId: "",
		startDate: new Date(),
		endDate: new Date(),
		reason: "no reason",
		status: "pending",
		leaveType: "Multiple days",
		rejectionReason: ""
	});

	const [users, setUsers] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await api.get('/AppUsers');

				if (res.status === 200)
				{
					const data = res.data.map((u) => ({
						value: u.id,
						label: u.userName
					}));
					setUsers(data);
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchUsers();
	}, [])

	const handleChange = (e) => {
		const {name, value} = e.target;
		setLeave({...leave, [name] : value});
	}

	const handleAddLeave = async (e) => {
		e.preventDefault();
		try {
			const payload = {
				...leave,
				startDate: leave.startDate.toISOString(),
				endDate: leave.endDate.toISOString()
			};
			const res = await api.post("/Leaves", payload);

			if (res.data)
				navigate("/admin-dashboard/leaves");
		} catch (error) {
			console.log(error);
		}
	}

	const handleUserSelect = (e) => {
		setLeave({...leave, userId: e.value});
	}

	const handleStartDate = (date) => {
		setLeave(prev => ({
			...prev,
			startDate: date,
			endDate: prev.leaveType === "Partial" ? date : prev.endDate
		}));
	};

	const handleEndDate = (date) => {
		setLeave({...leave, endDate: date});
	};

	return (
		<div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-100">
			<h2 className="text-2xl font-bold mb-4">Add Leave</h2>
			<form onSubmit={handleAddLeave}>

				{/* User select */}
				<div>
					<label>User</label>
					<Select
						options={users}
						onChange={handleUserSelect}
						placeholder="Select a user"
						className="mb-4"
					/>
				</div>

				{/* Dates row */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

					{/* Start date */}
					<div>
						<label className="block mb-1 font-medium">Start Date</label>
						<DatePicker
							selected={leave.startDate}
							onChange={handleStartDate}
							customInput={<CustomInput />}
							className="mt-1 w-full p-2 border border-gray-300 rounded-md"
						/>
					</div>

					{/* End date */}
					<div>
						<label className="block mb-1 font-medium">End Date</label>
						<DatePicker
							selected={leave.endDate}
							onChange={handleEndDate}
							customInput={<CustomInput />}
							className="mt-1 w-full p-2 border border-gray-300 rounded-md"
							disabled={leave.leaveType === 'Partial'}
						/>
					</div>

				</div>

				{/* REASON */}
				<div>
					<label>Reason</label>
					<textarea
						type="text"
						name="reason"
						value={leave.reason}
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"
						onChange={handleChange}
					/>
				</div>

				<div>
					<label>Status</label>
					<select
						name="status"
						value={leave.status}
						onChange={handleChange}
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"
					>
						<option value="pending">Pending</option>
						<option value="approved">Approved</option>
						<option value="rejected">Rejected</option>
					</select>
				</div>

				{/* REJECTION REASON */}
				{ leave.status === 'rejected' && (
				<div>
					<label>Rejection reason</label>
					<textarea
						type="text"
						name="rejectionReason"
						value={leave.rejectionReason}
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"
						onChange={handleChange}
					/>
				</div>
				)}

				<div>
					<label>Leave type</label>
					<select
						name="leaveType"
						value={leave.leaveType}
						onChange={handleChange}
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"
					>
						<option value="Partial">Partial</option>
						<option value="Multiple days">Multiple days</option>
					</select>
				</div>

				<button type="submit"
					className='w-full mt-6 bg-teal-600 hover:bg-teal-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'>
						Submit
				</button>
				<button
					type="button"
					className='w-full mt-6 bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'
					onClick={() => navigate('/admin-dashboard/leaves')}>
						Cancel
				</button>
			</form>
		</div>
	);
};

export default AdminAddLeave;
