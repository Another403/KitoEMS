import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import Select from "react-select";

import { api } from "../../api";
import CustomInput from "../CustomInput";

const AdminEditLeave = () => {
	const { id } = useParams();
	const navigate = useNavigate();

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
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				const usersRes = await api.get("/AppUsers");
				const userOptions = usersRes.data.map(u => ({
					value: u.id,
					label: u.userName
				}));
				setUsers(userOptions);

				const leaveRes = await api.get(`/Leaves/${id}`);
				const l = leaveRes.data;

				setLeave({
					userId: l.userId,
					startDate: new Date(l.startDate),
					endDate: new Date(l.endDate),
					reason: l.reason,
					status: l.status,
					rejectionReason: l.rejectionReason
				});
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setLeave({ ...leave, [name]: value });
	};

	const handleStartDate = (date) => {
		setLeave({ ...leave, startDate: date });
	};

	const handleEndDate = (date) => {
		setLeave({ ...leave, endDate: date });
	};

	const handleUpdateLeave = async (e) => {
		e.preventDefault();
		try {
			const payload = {
				...leave,
				startDate: leave.startDate.toISOString(),
				endDate: leave.endDate.toISOString()
			};

			await api.put(`/Leaves/${id}`, payload);
			navigate("/admin-dashboard/leaves");
		} catch (err) {
			console.log(err);
		}
	};

	if (loading) return <div className="p-5">Loading...</div>;

	return (
		<div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-100">
			<h2 className="text-2xl font-bold mb-4">Edit Leave</h2>

			<form onSubmit={handleUpdateLeave}>
				<label>User</label>
				<Select
					options={users}
					value={users.find(u => u.value === leave.userId)}
					isSearchable={true}
					isDisabled={true}
					className="cursor-not-allowed opacity-70"
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block mb-1 font-medium">Start Date</label>
						<DatePicker
							selected={leave.startDate}
							onChange={handleStartDate}
							customInput={<CustomInput />}
							className="mt-1 w-full p-2 border border-gray-300 rounded-md"
						/>
					</div>
					<div>
						<label className="block mb-1 font-medium">End Date</label>
						<DatePicker
							selected={leave.endDate}
							onChange={handleEndDate}
							customInput={<CustomInput />}
							className="mt-1 w-full p-2 border border-gray-300 rounded-md"
						/>
					</div>
				</div>

				{/* REASON */}
				<label>Reason</label>
				<textarea
					name="reason"
					value={leave.reason}
					onChange={handleChange}
					className="mt-1 w-full p-2 border border-gray-300 rounded-md"
				></textarea>

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

				{/* REJECTION REASON */}
				{ leave.reason === 'rejected' && (
				<div>
					<label>Reason</label>
					<textarea
						type="text"
						name="rejectionReason"
						value={leave.rejectionReason}
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"
						onChange={handleChange}
					/>
				</div>
				)}

				<button
					type="submit"
					className='w-full mt-6 bg-teal-600 hover:bg-teal-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'
				>
					Save
				</button>
				<button
					type="button"
					className='w-full mt-6 bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'
					onClick={() => navigate("/admin-dashboard/leaves")}
				>
					Cancel
				</button>

			</form>
		</div>
	);
};

export default AdminEditLeave;