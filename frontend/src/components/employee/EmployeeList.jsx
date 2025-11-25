import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
	const [searchText, setSearchText] = useState("");
	const [employees, setEmployees] = useState([]);
	const [employeesLoading, setEmployeesLoading] = useState(false);

	useEffect(() => {
		const fetchEmployees = async () => {
			setEmployeesLoading(true);
			try {
				const res = await api.get('/AppUsers');

				if (res.status === 200)
				{
					const data = res.data.map((employee) => ({
					}));
					setEmployees(data);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setEmployeesLoading(false);
			}
		};
		fetchEmployees();
	}, []);
	
	return (
		<div className='p-5'>
			<div className='text-center'>
				<h3 className='text-2xl font-bold'>Employees</h3>
			</div>
			<div className='flex justify-between items-center'>
				<input type="text" placeholder='Search books by name'
					onChange={(e) => setSearchText(e.target.value)}
					className='px-4 py-0.5 border'>
				</input>
				<Link to="/admin-dashboard/add-employee" 
					className='px-4 py-1 bg-teal-600 rounded text-white'>
						Add new employee
				</Link>
			</div>
			<div className='mt-5'>
			</div>
		</div>
	)
}

export default EmployeeList
