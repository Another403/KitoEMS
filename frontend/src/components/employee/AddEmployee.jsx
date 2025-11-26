import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '../../api.jsx';

const AddEmployee = () => {
	const [formData, setFormData] = useState({
		FullName: '',
		Username: '',
		Password: '',
		Password2: '',
		Email: '',
		Image: null,
		Salary: 0,
		UserRole: ''
	});
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();

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

		if (formData.Password !== formData.Password2) {
			alert('Password mismatch');
			return;
		}
		
		const formDataObject = new FormData();
		Object.keys(formData).forEach((key) => {
			if (key !== 'Password2') {
				formDataObject.append(key, formData[key]);
			}
		})

		try {
			const res = await api.post(`/AppUsers/register`, formDataObject,
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
		<div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
			<h2 className='text-2xl font-bold mb-6'>Add Employee</h2>
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
							onChange={handleChange}
							placeholder='Enter employee username' 
							required
							className="mt-1 w-full p-2 block border border-gray-300 rounded-md"/>
					</div>
					
					{/* Password */}
					<div>
						<label htmlFor="Password"
							className='block text-sm font-medium text-gray-700'>
								Password
						</label>
						<input 
							type={showPassword ? "text" : "password"}
							name="Password"
							onChange={handleChange}
							placeholder='Enter employee password' 
							required
							className="mt-1 w-full p-2 block border border-gray-300 rounded-md"/>
					</div>
					<div>
						<label htmlFor="Password2"
							className='block text-sm font-medium text-gray-700'>
								Confirm password
						</label>
						<input 
							type={showPassword ? "text" : "password"}
							name="Password2"
							onChange={handleChange}
							placeholder='Re-enter employee password' 
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
							className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
							onChange={handleChange}
							required
						>
							<option value="">Select role</option>
							<option value="employee">Employee</option>
							<option value="storage_manager">Storage Manager</option>
							<option value="hr_manager">HR Manager</option>
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
							onChange={handleChange}
							placeholder='Enter salary' 
							required
							className="mt-1 w-full p-2 block border border-gray-300 rounded-md"/>
					</div>

					{/* Upload Image */}
					<div>
						<label htmlFor="Image"
							className='block text-sm font-medium text-gray-700'>
								Upload Image
						</label>
						<input 
							type="file" 
							name="Image"
							onChange={handleChange}
							placeholder='Upload image' 
							accept='image/*'
							className="mt-1 w-full p-2 block border border-gray-300 rounded-md
									file:border-0 file:bg-teal-600 file:text-white file:px-1 file:py-0.5 file:rounded-md
									file:cursor-pointer hover:file:bg-teal-700"/>
					</div>
				</div>
				<div>
					<label className="inline-flex items-center">
						<input type="checkbox" className='form-checkbox'
							checked={showPassword}
							onChange={() => setShowPassword(!showPassword)}></input>
						<span className="ml-2 text-gray-700">Show Password</span>
					</label>
				</div>
				<button type="submit"
					className='w-full mt-6 bg-teal-600 hover:bg-teal-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'>
						Add Employee
				</button>
			</form>
		</div>
	)
}

export default AddEmployee
