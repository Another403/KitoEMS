import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path = "/" element={<Navigate to="/admin-dashboard"/>}/>
				<Route path = "/admin-dashboard" element={<AdminDashboard/>}/>
				<Route path = "/login" element={<Login/>}/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
