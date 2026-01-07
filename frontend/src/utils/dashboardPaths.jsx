export const getDashboardBasePath = (role) => {
	const roleMap = {
		admin: "/admin-dashboard",
		employee: "/employee-dashboard",
		storage_manager: "/storage-manager-dashboard",
		hr_manager: "/hr-manager-dashboard",
	};

	return roleMap[role] || "/employee-dashboard";
};