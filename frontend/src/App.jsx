import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import PrivateRoutes from './utils/PrivateRoutes';
import RoleBasedRoutes from './utils/RoleBasedRoutes';
import AdminSummary from './components/dashboard/AdminSummary';
import BooksList from './components/storage/BooksList';
import AddBook from './components/storage/AddBook';
import EditBook from './components/storage/EditBook';
import EmployeeList from './components/employee/EmployeeList';
import AddEmployee from './components/employee/AddEmployee';
import ViewEmployee from './components/employee/ViewEmployee';
import EditEmployee from './components/employee/EditEmployee';
import PayrollsList from './components/payrolls/PayrollsList';
import AddPayroll from './components/payrolls/AddPayroll';
import EditPayroll from './components/payrolls/EditPayroll';
import ImportBook from './components/storage/ImportBook';
import CustomersList from './components/customer/CustomersList';
import AddCustomer from './components/customer/AddCustomer';
import EditCustomer from './components/customer/EditCustomer';
import LeavesList from './components/leave/LeavesList';
import AdminLeavesList from './components/leave/AdminLeavesList';
import AddLeave from './components/leave/AddLeave';
import AdminAddLeave from './components/leave/AdminAddLeave';
import AdminEditLeave from './components/leave/AdminEditLeave';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				{/* ADMIN DASHBOARD */}
				<Route path = "/" element={<Navigate to="/admin-dashboard"/>}/>
				<Route path = "/admin-dashboard" element={
					<PrivateRoutes>
						<RoleBasedRoutes requiredRoles={["admin"]}>
							<AdminDashboard/>
						</RoleBasedRoutes>
					</PrivateRoutes>
				}>
					<Route index element={<AdminSummary/>}></Route>
					{/* Storage */}
					<Route path="/admin-dashboard/storage" element={<BooksList/>}></Route>
					<Route path="/admin-dashboard/add-book" element={<AddBook/>}></Route>
					<Route path="/admin-dashboard/storage/:id" element={<EditBook/>}></Route>
					<Route path="/admin-dashboard/storage/import" element={<ImportBook/>}></Route>

					{/* Employees */}
					<Route path="/admin-dashboard/employees" element={<EmployeeList/>}></Route>
					<Route path="/admin-dashboard/employees/:id" element={<ViewEmployee/>}></Route>
					<Route path="/admin-dashboard/employees/edit/:id" element={<EditEmployee/>}></Route>
					<Route path="/admin-dashboard/add-employee" element={<AddEmployee/>}></Route>

					{/* Payrolls */}
					<Route path="/admin-dashboard/payrolls" element={<PayrollsList/>}></Route>
					<Route path="/admin-dashboard/add-payroll" element={<AddPayroll/>}></Route>
					<Route path="/admin-dashboard/payrolls/edit/:id" element={<EditPayroll/>}></Route>

					{/* Customers */}
					<Route path="/admin-dashboard/customers" element={<CustomersList/>}></Route>
					<Route path="/admin-dashboard/customers/add" element={<AddCustomer/>}></Route>
					<Route path="/admin-dashboard/customers/edit/:id" element={<EditCustomer/>}></Route>

					{/* AdminLeaves */}
					<Route path="/admin-dashboard/leaves" element={<AdminLeavesList/>}></Route>
					<Route path="/admin-dashboard/leaves/add" element={<AdminAddLeave/>}></Route>
					<Route path="/admin-dashboard/leaves/edit/:id" element={<AdminEditLeave/>}></Route>
				</Route>

				{/* EMPLOYEE DASHBOARD */}
				<Route path = "/employee-dashboard" element={
					<PrivateRoutes>
						<RoleBasedRoutes requiredRoles={["admin, employee"]}>
							<EmployeeDashboard/>
						</RoleBasedRoutes>
					</PrivateRoutes>
				}>
					<Route index element={<></>}></Route>
					<Route path="/employee-dashboard/profile/:id" element={<ViewEmployee/>}></Route>

					{/* Customers */}
					<Route path="/employee-dashboard/customers" element={<CustomersList/>}></Route>
					<Route path="/employee-dashboard/customers/add" element={<AddCustomer/>}></Route>
					<Route path="/employee-dashboard/customers/edit/:id" element={<EditCustomer/>}></Route>

					{/* Leaves */}
					<Route path="/employee-dashboard/leaves" element={<LeavesList/>}></Route>
					<Route path="/employee-dashboard/leaves/add" element={<AddLeave/>}></Route>
				</Route>

				<Route path = "/login" element={<Login/>}/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
