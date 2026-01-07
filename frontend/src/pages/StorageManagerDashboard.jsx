import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/dashboard/Navbar.jsx";
import StorageManagerSidebar from "../components/dashboard/StorageManagerSidebar.jsx";

const StorageManagerDashboard = () => {
	return (
		<div className="flex">
			<StorageManagerSidebar />
			<div className="flex-1 ml-64 bg-gray-100 h-screen">
				<Navbar />
				<Outlet />
			</div>
		</div>
	);
};

export default StorageManagerDashboard;
