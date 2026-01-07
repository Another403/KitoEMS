import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext.jsx';
import { getDashboardBasePath } from './dashboardPaths';
const RoleBasedRoutes = ({ children, requiredRoles }) => {
	const {user, loading} = useAuth();
	
	if (loading) return <div>Loading...</div>;
	if (!user) return <Navigate to="/login"/>;
	if (!requiredRoles.includes(user.userRole)) {
		return <Navigate to={getDashboardBasePath(user.userRole)} />;
	}

	return children;
}

export default RoleBasedRoutes
