import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { api } from "../../api";

const RejectLeave = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [rejectionReason, setRejectionReason] = useState('');

	const handleReject = async (e) => {
		e.preventDefault();
		try {
			const res = await api.put(`/Leaves/reject/${id}`, {
				rejectionReason: rejectionReason
			});

			if (res.status === 200) {
				navigate('/admin-dashboard/leaves')
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-100">
			<h2 className="text-2xl font-bold mb-4">Leave rejection reason</h2>
			<form onSubmit={handleReject}>
				<div>
					<label>Rejection reason</label>
					<textarea
						type="text"
						name="rejectionReason"
						className="mt-1 w-full p-2 border border-gray-300 rounded-md"
						onChange={(e) => setRejectionReason(e.target.value)}
					/>
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
	)
}

export default RejectLeave
