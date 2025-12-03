import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';

import { EmployeeButtons, EmployeeColumns } from '../../utils/EmployeeHelper';
import { api } from '../../api.jsx';

const EmployeeList = () => {
	const [searchText, setSearchText] = useState("");
	const [employees, setEmployees] = useState([]);
	const [employeesLoading, setEmployeesLoading] = useState(false);

	const fetchEmployees = async () => {
		setEmployeesLoading(true);
		try {
			const res = await api.get('/AppUsers');

			if (res.status === 200)
			{
				const data = res.data.map((employee) => ({
					id: employee.id,
					fullName: employee.fullName,
					salary: employee.salary,
					userRole: employee.userRole,
					username: employee.userName,
					email: employee.email,
					actions: (<EmployeeButtons id={employee.id} deleteable={employee.userRole !== 'admin'} handleDelete={handleDelete}/>)
				}));
				setEmployees(data);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setEmployeesLoading(false);
		}
	};

	useEffect(() => {
		fetchEmployees();
	}, []);

	const handleDelete = async (id) => {
		const data = employees.filter(employee => employee.id !== id);
		setEmployees(data);

		try {
			const res = await api.delete(`/AppUsers/${id}`);
			await fetchEmployees();
		} catch (error) {
			console.log(error);
			await fetchEmployees();
		}
	}
	
	return (
		<>{employeesLoading ? <div>Loading employee...</div> :
			<div className='p-5'>
				<div className='text-center'>
					<h3 className='text-2xl font-bold'>Employees</h3>
				</div>
				<div className='flex justify-between items-center'>
					<input type="text" placeholder='Search by name' minWidth='200px'
						onChange={(e) => setSearchText(e.target.value)}
						className='px-4 py-0.5 border'>
					</input>
					<Link to="/admin-dashboard/add-employee" 
						className='px-4 py-1 bg-teal-600 rounded text-white'>
							Add new employee
					</Link>
				</div>
				<div className='mt-5'>
					<DataTable
						columns={EmployeeColumns}
						data={employees.filter((employee) =>
								employee.fullName.toLowerCase().includes(searchText.toLowerCase())
							)}
						pagination
					/>
				</div>
			</div>
		}</>
	)
}

export default EmployeeList
