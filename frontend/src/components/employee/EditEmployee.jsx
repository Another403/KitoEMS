import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { api } from '../../api.jsx';

const EditEmployee = () => {
	const { id } = useParams();
	const [employee, setEmployee] = useState({});
	const [employeeLoading, setEmployeeLoading] = useState(false);
	const [formData, setFormData] = useState({
		FullName: '',
		Username: '',
		Email: '',
		Salary: 0,
		UserRole: ''
	});
	const navigate = useNavigate();

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
	}, [id]);

	useEffect(() => {
		if (!employee) return;

		setFormData({
			FullName: employee.fullName,
			Username: employee.userName,
			Email: employee.email,
			Salary: employee.salary,
			UserRole: employee.userRole
		});
	}, [employee]);

	const handleChange = (e) => {
		const {name, value, files} = e.target;
		
		if (name === 'Image') {
			setFormData((prevData) => ({...prevData, [name] : files[0]}));
		} else {
			setFormData((prevData) => ({...prevData, [name] : value}));
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		const formDataObject = new FormData();
		Object.keys(formData).forEach((key) => {
			formDataObject.append(key, formData[key]);
		})

		try {
			const res = await api.put(`/AppUsers/${id}`, formDataObject,
				{ 
					headers: { 
						"Content-Type": "multipart/form-data" 
					} 
				}
			);

			if (res.status === 200) {
				navigate('/admin-dashboard/employees');
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>{employeeLoading ? <div>Loading employee...</div> :
			<div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
				<h2 className='text-2xl font-bold mb-6'>Edit Employee</h2>
				<form onSubmit={handleSubmit} autoComplete='off'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{/* Name */}
						<div>
							<label htmlFor="FullName"
								className='block text-sm font-medium text-gray-700'>
									Full name
							</label>
							<input 
								type="text" 
								name="FullName"
								value={formData.FullName}
								onChange={handleChange}
								placeholder='Enter full name' 
								required
								className="mt-1 w-full p-2 block border border-gray-300 rounded-md"/>
						</div>

						{/* Email */}
						<div>
							<label htmlFor="Email"
								className='block text-sm font-medium text-gray-700'>
									Email
							</label>
							<input 
								type="text" 
								name="Email"
								value={formData.Email}
								onChange={handleChange}
								placeholder='Enter employee email' 
								required
								className="mt-1 w-full p-2 block border border-gray-300 rounded-md"/>
						</div>

						{/* Username */}
						<div>
							<label htmlFor="Username"
								className='block text-sm font-medium text-gray-700'>
									Username
							</label>
							<input 
								type="text" 
								name="Username"
								value={formData.Username}
								onChange={handleChange}
								placeholder='Enter employee username' 
								required
								className="mt-1 w-full p-2 block border border-gray-300 rounded-md"/>
						</div>

						{/* Roles */}
						<div>
							<label htmlFor="UserRole"
								className='block text-sm font-medium text-gray-700'>
									Select role
							</label>
							<select
								name='UserRole'
								className={employee.userRole === 'admin' ? 
									'mt-1 p-2 block w-full border rounded-md bg-gray-200 text-gray-600 border-gray-300	cursor-not-allowed opacity-70' : 
									'mt-1 p-2 block w-full border border-gray-300 rounded-md'}
								onChange={handleChange}
								value={formData.UserRole}
								disabled={employee.userRole === 'admin'}
							>
								<option value="">Select role</option>
								<option value="Employee">Employee</option>
								<option value="Storage Manager">Storage Manager</option>
								<option value="HR Manager">HR Manager</option>
							</select>
						</div>

						{/* Salary */}
						<div>
							<label htmlFor="Salary"
								className='text-sm font-medium text-gray-700'>
									Salary
							</label>
							<input 
								type="number"
								step="0.01"
								min="0"
								name="Salary"
								value={formData.Salary}
								onChange={handleChange}
								placeholder='Enter salary' 
								required
								className="mt-1 w-full p-2 block border border-gray-300 rounded-md"/>
						</div>
					</div>
					<button type="submit"
						className='w-full mt-6 bg-teal-600 hover:bg-teal-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'>
							Edit Employee
					</button>
					<button type="submit"
						className='w-full mt-6 bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'
						onClick={() => navigate('/admin-dashboard/employees')}>
							Cancel
					</button>
				</form>
			</div>
		}</>
	)
}

export default EditEmployee
