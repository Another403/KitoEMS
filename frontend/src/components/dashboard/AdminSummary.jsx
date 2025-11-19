import React from 'react'

import SummaryCard from './SummaryCard';

import { FaUser, FaBookOpen } from 'react-icons/fa';

const AdminSummary = () => {
	return (
		<div className='p-6'>
			<h3 className='class-2xl font-bold'>Overview</h3>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
				<SummaryCard icon={<FaUser/>} text="Members" number={13}/>
				<SummaryCard icon={<FaBookOpen/>} text="Book Titles" number={100} color="bg-yellow-600"/>
			</div>

			<div className='mt-12'>
				<h4 className='text-2xl font-bold'>Details</h4>
				
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
					<SummaryCard icon={<FaUser/>} text="Members" number={13}/>
					<SummaryCard icon={<FaBookOpen/>} text="Book Titles" number={100} color="bg-yellow-600"/>
					<SummaryCard icon={<FaUser/>} text="Members" number={13}/>
					<SummaryCard icon={<FaBookOpen/>} text="Book Titles" number={100} color="bg-yellow-600"/>
				</div>
			</div>
		</div>
	)
}

export default AdminSummary
