import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';

import { api } from '../../api.jsx';
import { PayrollColumns, PayrollButtons } from '../../utils/PayrollHelper.jsx';
import autoprefixer from 'autoprefixer';

const PayrollsList = () => {
	const [payrolls, setPayrolls] = useState([]);
	const [payrollsLoading, setPayrollsLoading] = useState(false);
	const [searchText, setSearchText] = useState("");

	const fetchPayrolls = async () => {
		setPayrollsLoading(true);
		try {
			const res = await api.get('/Payrolls');

			if (res.status === 200)
			{
				const data = res.data.map((payroll) => ({
					id: payroll.id,
					employeeName: payroll.user.fullName,
					period: `${payroll.month}-${payroll.year}`,
					baseSalary: payroll.baseSalary,
					bonus: payroll.bonus,
					total: payroll.total,
					actions: (<PayrollButtons id={payroll.id} handleDelete={handleDelete}/>)
				}));
				setPayrolls(data);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setPayrollsLoading(false);
		}
	};
	
	useEffect(() => {
		fetchPayrolls();
	}, []);

	const handleDelete = async (id) => {
		setPayrolls(payrolls.filter(payroll => payroll.id !== id));
		try {
			const res = await api.delete(`/Payrolls/${id}`);
			await fetchPayrolls();
		} catch (error) {
			console.log(error);
			await fetchPayrolls();
		}
	}

  	return (
		<>{payrollsLoading ? <div>Loading...</div> :
			<div className='p-5'>
				<div className='text-center'>
					<h3 className='text-2xl font-bold'>Payrolls</h3>
				</div>
				<div className='flex justify-between items-center'>
					<input type="text" placeholder='Search payrolls by name'
						onChange={(e) => setSearchText(e.target.value)}
						className='px-4 py-0.5 border'>
					</input>
					<Link to="/admin-dashboard/add-payroll" 
						className='px-4 py-1 bg-teal-600 rounded text-white'>
							Add payroll
					</Link>
				</div>
				<div className='mt-5'>
					<DataTable
						columns={PayrollColumns}
						data={payrolls}
						pagination
					/>
				</div>
			</div>
		}</>
	)
}

export default PayrollsList