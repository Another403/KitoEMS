import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import StorageManagerDashboard from './pages/StorageManagerDashboard';
import HrManagerDashboard from './pages/HrManagerDashboard';
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
import EditLeave from './components/leave/EditLeave';
import AdminAddLeave from './components/leave/AdminAddLeave';
import AdminEditLeave from './components/leave/AdminEditLeave';
import AddReceipt from './components/receipt/AddReceipt';
import ReceiptList from './components/receipt/ReceiptsList';
import ViewReceipt from './components/receipt/ViewReceipt';
import AddReceiptItem from './components/receiptItem/AddReceiptItem';
import EditReceiptItem from './components/receiptItem/EditReceiptItem';
import RejectLeave from './components/leave/RejectLeave';
import WorkshiftScheduler from './components/workshift/WorkshiftScheduler';
import Reports from './components/report/Reports';
import Returns from './components/return/Returns';
//import Calendar from './components/workshift/Calendar';

import { useAuth } from './contexts/AuthContext.jsx';
import { getDashboardBasePath } from './utils/dashboardPaths';

const HomeRedirect = () => {
	const { user, loading } = useAuth();

	if (loading) return <div>Loading...</div>;
	if (!user) return <Navigate to="/login" replace />;

	return <Navigate to={getDashboardBasePath(user.userRole)} replace />;
};

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				{/* ADMIN DASHBOARD */}
				<Route path = "/" element={<HomeRedirect/>}/>
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
					<Route path="/admin-dashboard/leaves/:id/reject" element={<RejectLeave/>}></Route>

					{/* Receipts */}
					<Route path="/admin-dashboard/receipts" element={<ReceiptList/>}></Route>
					<Route path="/admin-dashboard/receipts/add" element={<AddReceipt/>}></Route>
					<Route path="/admin-dashboard/receipts/view/:id" element={<ViewReceipt/>}></Route>
					<Route path="/admin-dashboard/receipts/:id/items/add" element={<AddReceiptItem/>}></Route>
					<Route path="/admin-dashboard/receipts/item/edit/:id" element={<EditReceiptItem/>}></Route>

					{/* Work shifts */}
					<Route path="/admin-dashboard/workshifts" element={<WorkshiftScheduler/>}></Route>

					{/* Reports */}
					<Route path="/admin-dashboard/reports" element={<Reports/>}></Route>

					{/* Returns */}
					<Route path="/admin-dashboard/returns" element={<Returns/>}></Route>

				</Route>

				{/* EMPLOYEE DASHBOARD */}
				<Route path = "/employee-dashboard" element={
					<PrivateRoutes>
						<RoleBasedRoutes requiredRoles={["employee"]}>
							<EmployeeDashboard/>
						</RoleBasedRoutes>
					</PrivateRoutes>
				}>
					<Route index element={<AdminSummary/>}></Route>

					{/* Customers */}
					<Route path="/employee-dashboard/customers" element={<CustomersList/>}></Route>
					<Route path="/employee-dashboard/customers/add" element={<AddCustomer/>}></Route>
					<Route path="/employee-dashboard/customers/edit/:id" element={<EditCustomer/>}></Route>

					{/* Leaves */}
					<Route path="/employee-dashboard/leaves" element={<LeavesList/>}></Route>
					<Route path="/employee-dashboard/leaves/add" element={<AddLeave/>}></Route>
					<Route path="/employee-dashboard/leaves/edit/:id" element={<EditLeave/>}></Route>

					{/* Storage */}
					<Route path="/employee-dashboard/storage" element={<BooksList/>}></Route>

					{/* Payrolls */}
					<Route path="/employee-dashboard/payrolls" element={<PayrollsList/>}></Route>
					<Route path="/employee-dashboard/add-payroll" element={<AddPayroll/>}></Route>
					<Route path="/employee-dashboard/payrolls/edit/:id" element={<EditPayroll/>}></Route>

					{/* Receipts */}
					<Route path="/employee-dashboard/receipts" element={<ReceiptList/>}></Route>
					<Route path="/employee-dashboard/receipts/add" element={<AddReceipt/>}></Route>
					<Route path="/employee-dashboard/receipts/view/:id" element={<ViewReceipt/>}></Route>
					<Route path="/employee-dashboard/receipts/:id/items/add" element={<AddReceiptItem/>}></Route>
					<Route path="/employee-dashboard/receipts/item/edit/:id" element={<EditReceiptItem/>}></Route>

					{/* Returns */}
					<Route path="/employee-dashboard/returns" element={<Returns/>}></Route>

					{/* Work shifts */}
					<Route path="/employee-dashboard/workshifts" element={<WorkshiftScheduler readOnly/>}></Route>
				</Route>

				{/* STORAGE MANAGER DASHBOARD */}
				<Route path = "/storage-manager-dashboard" element={
					<PrivateRoutes>
						<RoleBasedRoutes requiredRoles={["storage_manager"]}>
							<StorageManagerDashboard/>
						</RoleBasedRoutes>
					</PrivateRoutes>
				}>
					<Route index element={<AdminSummary/>}></Route>

					{/* Storage */}
					<Route path="/storage-manager-dashboard/storage" element={<BooksList/>}></Route>
					<Route path="/storage-manager-dashboard/add-book" element={<AddBook/>}></Route>
					<Route path="/storage-manager-dashboard/storage/:id" element={<EditBook/>}></Route>
					<Route path="/storage-manager-dashboard/storage/import" element={<ImportBook/>}></Route>

					{/* Leaves */}
					<Route path="/storage-manager-dashboard/leaves" element={<LeavesList/>}></Route>
					<Route path="/storage-manager-dashboard/leaves/add" element={<AddLeave/>}></Route>
					<Route path="/storage-manager-dashboard/leaves/edit/:id" element={<EditLeave/>}></Route>

					{/* Payrolls */}
					<Route path="/storage-manager-dashboard/payrolls" element={<PayrollsList/>}></Route>
					<Route path="/storage-manager-dashboard/add-payroll" element={<AddPayroll/>}></Route>
					<Route path="/storage-manager-dashboard/payrolls/edit/:id" element={<EditPayroll/>}></Route>

					{/* Customers */}
					<Route path="/storage-manager-dashboard/customers" element={<CustomersList/>}></Route>
					<Route path="/storage-manager-dashboard/customers/add" element={<AddCustomer/>}></Route>
					<Route path="/storage-manager-dashboard/customers/edit/:id" element={<EditCustomer/>}></Route>

					{/* Receipts */}
					<Route path="/storage-manager-dashboard/receipts" element={<ReceiptList/>}></Route>
					<Route path="/storage-manager-dashboard/receipts/add" element={<AddReceipt/>}></Route>
					<Route path="/storage-manager-dashboard/receipts/view/:id" element={<ViewReceipt/>}></Route>
					<Route path="/storage-manager-dashboard/receipts/:id/items/add" element={<AddReceiptItem/>}></Route>
					<Route path="/storage-manager-dashboard/receipts/item/edit/:id" element={<EditReceiptItem/>}></Route>

					{/* Returns */}
					<Route path="/storage-manager-dashboard/returns" element={<Returns/>}></Route>

					{/* Work shifts */}
					<Route path="/storage-manager-dashboard/workshifts" element={<WorkshiftScheduler readOnly/>}></Route>
				</Route>

				{/* HR MANAGER DASHBOARD */}
				<Route path = "/hr-manager-dashboard" element={
					<PrivateRoutes>
						<RoleBasedRoutes requiredRoles={["hr_manager"]}>
							<HrManagerDashboard/>
						</RoleBasedRoutes>
					</PrivateRoutes>
				}>
					<Route index element={<AdminSummary/>}></Route>

					{/* Employees */}
					<Route path="/hr-manager-dashboard/employees" element={<EmployeeList/>}></Route>
					<Route path="/hr-manager-dashboard/employees/:id" element={<ViewEmployee/>}></Route>
					<Route path="/hr-manager-dashboard/employees/edit/:id" element={<EditEmployee/>}></Route>
					<Route path="/hr-manager-dashboard/add-employee" element={<AddEmployee/>}></Route>

					{/* AdminLeaves */}
					<Route path="/hr-manager-dashboard/leaves" element={<AdminLeavesList/>}></Route>
					<Route path="/hr-manager-dashboard/leaves/add" element={<AdminAddLeave/>}></Route>
					<Route path="/hr-manager-dashboard/leaves/edit/:id" element={<AdminEditLeave/>}></Route>
					<Route path="/hr-manager-dashboard/leaves/:id/reject" element={<RejectLeave/>}></Route>

					{/* Storage */}
					<Route path="/hr-manager-dashboard/storage" element={<BooksList/>}></Route>

					{/* Payrolls */}
					<Route path="/hr-manager-dashboard/payrolls" element={<PayrollsList/>}></Route>
					<Route path="/hr-manager-dashboard/add-payroll" element={<AddPayroll/>}></Route>
					<Route path="/hr-manager-dashboard/payrolls/edit/:id" element={<EditPayroll/>}></Route>

					{/* Customers */}
					<Route path="/hr-manager-dashboard/customers" element={<CustomersList/>}></Route>
					<Route path="/hr-manager-dashboard/customers/add" element={<AddCustomer/>}></Route>
					<Route path="/hr-manager-dashboard/customers/edit/:id" element={<EditCustomer/>}></Route>

					{/* Receipts */}
					<Route path="/hr-manager-dashboard/receipts" element={<ReceiptList/>}></Route>
					<Route path="/hr-manager-dashboard/receipts/add" element={<AddReceipt/>}></Route>
					<Route path="/hr-manager-dashboard/receipts/view/:id" element={<ViewReceipt/>}></Route>
					<Route path="/hr-manager-dashboard/receipts/:id/items/add" element={<AddReceiptItem/>}></Route>
					<Route path="/hr-manager-dashboard/receipts/item/edit/:id" element={<EditReceiptItem/>}></Route>

					{/* Returns */}
					<Route path="/hr-manager-dashboard/returns" element={<Returns/>}></Route>

					{/* Work shifts */}
					<Route path="/hr-manager-dashboard/workshifts" element={<WorkshiftScheduler/>}></Route>
				</Route>

				<Route path = "/login" element={<Login/>}/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
