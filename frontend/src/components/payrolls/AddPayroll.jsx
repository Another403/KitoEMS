import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

import "react-datepicker/dist/react-datepicker.css";
import { api } from '../../api'
import CustomInput from '../CustomInput';

const AddPayroll = () => {
	const [payroll, setPayroll] = useState({});

	const [users, setUsers] = useState([]);
	const [usersLoading, setUsersLoading] = useState(false);
	const [date, setDate] = useState(new Date());

	const navigate = useNavigate();

	useEffect(() => {
		const fetchUsers = async () => {
			setUsersLoading(true);
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
			} finally {
				setUsersLoading(false);
			}
		};
		fetchUsers();
	}, [])

	const handleChange = (e) => {
		const {name, value} = e.target;
		setPayroll({...payroll, [name] : value});
	}

	const handleAddPayroll = async (e) => {
		e.preventDefault();
		try {
			const res = await api.post("/Payrolls", payroll);

			if (res.data)
				navigate("/admin-dashboard/payrolls");
		} catch (error) {
			alert("Error");
		}
	}

	const handleUserSelect = (e) => {
		setPayroll({...payroll, userId: e.value});
	}

	const handleDateChange = (selectedDate) => {
		setDate(selectedDate);

		setPayroll({
			...payroll,
			month: selectedDate.getMonth() + 1,
			year: selectedDate.getFullYear()
		});
	}

	return (
		<div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-100'>
			<h2 className='text-2xl font-bold mb-6'>Add payroll</h2>
			<form onSubmit={handleAddPayroll}>
				<div className='mb-4'>
					<label className='text-sm font-medium text-gray-700 mb-2 block'>
						Select User
					</label>
					<Select
						options={users}
						onChange={handleUserSelect}
						placeholder="Type to search user by name..."
						isSearchable={true}
					/>
				</div>
				<div className='grid grid-cols-2 gap-6'>
					<div>
						<label htmlFor="Base salary"
							className='text-sm font-medium text-gray-700'>
								Base salary
						</label>
						<input 
							type="number" 
							step="0.01" 
							min="0" 
							name="baseSalary"
							onChange={handleChange}
							placeholder='Enter base salary' 
							className="mt-1 w-full p-2 border border-gray-300 rounded-md">
						</input>
					</div>
					<div>
						<label htmlFor="Bonus"
							className='text-sm font-medium text-gray-700'>
								Bonus
						</label>
						<input 
							type="number" 
							step="0.01" 
							min="0" 
							name="bonus" 
							onChange={handleChange}
							placeholder='Enter bonus' 
							className="mt-1 w-full p-2 border border-gray-300 rounded-md">
						</input>
					</div>
					<div>
						<label className='text-sm font-medium block text-gray-700'>
							Period
						</label>
						<DatePicker
							selected={date}
							onChange={handleDateChange}
							dateFormat="MM/yyyy"
							showMonthYearPicker
							customInput={<CustomInput/>}
							className="w-full p-2 border border-gray-300 rounded-md"
						/>
					</div>
				</div>
				<button type="submit"
					className='w-full mt-6 bg-teal-600 hover:bg-teal-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'>
						Add payroll
				</button>
				<button
					className='w-full mt-6 bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded'
					onClick={() => navigate('/admin-dashboard/payrolls')}>
						Cancel
				</button>
			</form>
		</div>
	)
}

export default AddPayroll
