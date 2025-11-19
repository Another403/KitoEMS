import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import PrivateRoutes from './utils/PrivateRoutes';
import RoleBasedRoutes from './utils/RoleBasedRoutes';

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
				}/>
				<Route path = "/employee-dashboard" element={<EmployeeDashboard/>}/>
				<Route path = "/login" element={<Login/>}/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
