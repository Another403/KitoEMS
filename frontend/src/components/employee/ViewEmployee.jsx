import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { api } from '../../api.jsx';

const ViewEmployee = () => {
	const { id } = useParams();
	const [employee, setEmployee] = useState({});
	const [employeeLoading, setEmployeeLoading] = useState(false);

	useEffect(() => {
		const fetchEmployee = async () => {
			setEmployeeLoading(true);
			try {
				const res = await api.get(`/AppUsers/${id}`);

				if (res.status === 200) {
					setEmployee(res.data);
					//console.log(res.data);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setEmployeeLoading(false);
			}
		};
		fetchEmployee();
	}, []);

	return (
		<>{ employeeLoading ? <div>Loading employee...</div> :
			<div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
				<h2 className='text-2xl font-bold mb-8 text-center'>
					Employee Details
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='flex justify-center'>
					{ employee.userImage == null ? <></> :
						<img 
							src={`https://localhost:7014${employee.userImage}`}
							className='rounded-full max-w-64 max-h-64 shadow-sm object-cover'
						/>
					}
					</div>
					<div>
						<div className=''>
							<p className='text-lg font-bold'>Full name:</p>
							<p className='text-gray-900 text-base mt-1'>{employee.fullName}</p>
						</div>
						<div className=''>
							<p className='text-lg font-bold'>Username:</p>
							<p className='text-gray-900 text-base mt-1'>{employee.userName}</p>
						</div>
						<div className=''>
							<p className='text-lg font-bold'>Email:</p>
							<p className='text-gray-900 text-base mt-1'>{employee.email}</p>
						</div>
						<div className=''>
							<p className='text-lg font-bold'>Role:</p>
							<p className='text-gray-900 text-base mt-1'>{employee.userRole}</p>
						</div>
						<div className=''>
							<p className='text-lg font-bold'>Salary:</p>
							<p className='text-gray-900 text-base mt-1'>{employee.salary}$</p>
						</div>
					</div>
				</div>
			</div>
		}</>
	)
}

export default ViewEmployee
