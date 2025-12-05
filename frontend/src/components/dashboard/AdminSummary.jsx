import React, { useState, useEffect } from 'react'

import SummaryCard from './SummaryCard';

import { FaUser, FaBookOpen, FaReceipt, FaBook, FaMoneyBill, FaCalendar, FaUserFriends } from 'react-icons/fa';
import { api } from '../../api';

const AdminSummary = () => {
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchSummary = async () => {
			try {
				const res = await api.get("/summary");
				setData(res.data);
			} catch (err) {
				setError("Failed to load summary data");
			} finally {
				setLoading(false);
			}
		};

		fetchSummary();
	}, []);

	return (
		<>{ loading ? <div>Loading...</div> :
			<div className='p-6'>
				<h3 className='class-2xl font-bold'>Overview</h3>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
					<SummaryCard icon={<FaUser/>} text="Members" number={data.members}/>
					<SummaryCard icon={<FaBookOpen/>} text="Book Titles" number={data.books} color="bg-yellow-600"/>
					<SummaryCard icon={<FaUserFriends/>} text="Customers" number={data.customers} color="bg-green-600"/>
				</div>

				<div className='mt-12'>
					<h4 className='text-2xl font-bold'>Details</h4>
					
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
						<SummaryCard icon={<FaBook/>} text="In stock" number={data.inStock} color="bg-orange-600"/>
						<SummaryCard icon={<FaCalendar/>} text="Leaves" number={data.leaves} color="bg-cyan-600"/>
						<SummaryCard icon={<FaMoneyBill/>} text="Payrolls" number={data.payrolls} color="bg-purple-600"/>
					</div>
				</div>
			</div>
		}</>
	)
}

export default AdminSummary
