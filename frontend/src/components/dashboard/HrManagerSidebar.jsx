import React from "react";
import { NavLink } from "react-router-dom";
import {
	FaTachometerAlt,
	FaUndo,
	FaCalendarTimes,
	FaRegMoneyBillAlt,
	FaReceipt,
	FaCalendarDay,
	FaUserFriends,
} from "react-icons/fa";

const HrManagerSidebar = () => {
	return (
		<div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
			<div className="bg-teal-600 h-12 flex items-center justify-center">
				<h3 className="text-2xl text-center font-pacifico">KitoERP</h3>
			</div>
			<div className="px-4">
				<NavLink
					to="/hr-manager-dashboard"
					className={({ isActive }) =>
						`${
							isActive ? "bg-teal-500" : " "
						} flex items-center space-x-4 block py-2.5 px-4 rounded`
					}
					end
				>
					<FaTachometerAlt />
					<span>Dashboard</span>
				</NavLink>
				<NavLink
					to="/hr-manager-dashboard/leaves"
					className={({ isActive }) =>
						`${
							isActive ? "bg-teal-500" : " "
						} flex items-center space-x-4 block py-2.5 px-4 rounded`
					}
				>
					<FaCalendarTimes />
					<span>Admin Leaves</span>
				</NavLink>
				<NavLink
					to="/hr-manager-dashboard/payrolls"
					className={({ isActive }) =>
						`${
							isActive ? "bg-teal-500" : " "
						} flex items-center space-x-4 block py-2.5 px-4 rounded`
					}
				>
					<FaRegMoneyBillAlt />
					<span>Payrolls</span>
				</NavLink>
				<NavLink
					to="/hr-manager-dashboard/customers"
					className={({ isActive }) =>
						`${
							isActive ? "bg-teal-500" : " "
						} flex items-center space-x-4 block py-2.5 px-4 rounded`
					}
				>
					<FaUserFriends />
					<span>Customers</span>
				</NavLink>
				<NavLink
					to="/hr-manager-dashboard/receipts"
					className={({ isActive }) =>
						`${
							isActive ? "bg-teal-500" : " "
						} flex items-center space-x-4 block py-2.5 px-4 rounded`
					}
				>
					<FaReceipt />
					<span>Receipts</span>
				</NavLink>
				<NavLink
					to="/hr-manager-dashboard/returns"
					className={({ isActive }) =>
						`${
							isActive ? "bg-teal-500" : " "
						} flex items-center space-x-4 block py-2.5 px-4 rounded`
					}
				>
					<FaUndo />
					<span>Returns</span>
				</NavLink>
				<NavLink
					to="/hr-manager-dashboard/workshifts"
					className={({ isActive }) =>
						`${
							isActive ? "bg-teal-500" : " "
						} flex items-center space-x-4 block py-2.5 px-4 rounded`
					}
				>
					<FaCalendarDay />
					<span>Workshifts</span>
				</NavLink>
			</div>
		</div>
	);
};

export default HrManagerSidebar;
