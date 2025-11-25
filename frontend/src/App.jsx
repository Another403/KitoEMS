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

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path = "/" element={<Navigate to="/admin-dashboard"/>}/>
				<Route path = "/admin-dashboard" element={
					<PrivateRoutes>
						<RoleBasedRoutes requiredRoles={["admin"]}>
							<AdminDashboard/>
						</RoleBasedRoutes>
					</PrivateRoutes>
				}>
					<Route index element={<AdminSummary/>}></Route>
					<Route path="/admin-dashboard/storage" element={<BooksList/>}></Route>
					<Route path="/admin-dashboard/add-book" element={<AddBook/>}></Route>
					<Route path="/admin-dashboard/storage/:id" element={<EditBook/>}></Route>

					<Route path="/admin-dashboard/employees" element={<EmployeeList/>}></Route>
					<Route path="/admin-dashboard/add-employee" element={<AddEmployee/>}></Route>
				</Route>
				<Route path = "/employee-dashboard" element={<EmployeeDashboard/>}/>
				<Route path = "/login" element={<Login/>}/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
