import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../contexts/authContext.jsx';
const RoleBasedRoutes = ({ children, requiredRoles }) => {
	const {user, loading} = useAuth();
	
	if (loading) return <div>Loading...</div>;

	useEffect(() => {
		if (!requiredRoles.includes(user.userRole)) {
			<Navigate to="/"/>
		}
	});

	return user ? children : <Navigate to="/login"/>;
}

export default RoleBasedRoutes
