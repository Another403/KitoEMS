import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DataTable from "react-data-table-component";

import { api } from "../../api.jsx";
import {
	bestSellerColumns,
	formatCurrency,
	topEmployeeColumns,
} from "../../utils/ReportHelper";
import BestSellerChart from "./BestSellerChart.jsx";
import { ReceiptColumns } from "@/utils/ReceiptHelper.jsx";
import TopEmployeeChart from "./TopEmployeeChart.jsx";

const rangeOptions = [
	{ value: "weekly", label: "This Week" },
	{ value: "monthly", label: "This Month" },
	{ value: "yearly", label: "This Year" },
	{ value: "custom", label: "Custom" },
];

const Reports = () => {
	const [range, setRange] = useState("monthly");
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [salesReport, setSalesReport] = useState(null);
	const [bestSellers, setBestSellers] = useState([]);
	const [topEmployees, setTopEmployees] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Chart data
	const [bestSellersChartData, setBestSellersChartData] = useState([]);
	const [topEmployeesChartData, setTopEmployeesChartData] = useState([]);

	const handleRangeChange = (value) => {
		setRange(value);
		if (value !== "custom") {
			setFromDate(null);
			setToDate(null);
		}
	};

	const normalizeStartOfDayUtc = (date) => {
		return new Date(
			Date.UTC(
				date.getUTCFullYear(),
				date.getUTCMonth(),
				date.getUTCDate()
			)
		);
	};

	const normalizeEndOfDayUtc = (date) => {
		return new Date(
			Date.UTC(
				date.getUTCFullYear(),
				date.getUTCMonth(),
				date.getUTCDate(),
				23,
				59,
				59,
				999
			)
		);
	};

	const resolveRangeParams = () => {
		const now = new Date();

		switch (range) {
			case "weekly": {
				const startOfWeekUtc = normalizeStartOfDayUtc(now);
				startOfWeekUtc.setUTCDate(
					startOfWeekUtc.getUTCDate() - startOfWeekUtc.getUTCDay()
				);
				return {
					from: startOfWeekUtc.toISOString(),
					to: now.toISOString(),
				};
			}
			case "monthly": {
				const startOfMonthUtc = new Date(
					Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
				);
				return {
					from: startOfMonthUtc.toISOString(),
					to: now.toISOString(),
				};
			}
			case "yearly": {
				const startOfYearUtc = new Date(
					Date.UTC(now.getUTCFullYear(), 0, 1)
				);
				return {
					from: startOfYearUtc.toISOString(),
					to: now.toISOString(),
				};
			}
			case "custom": {
				if (!fromDate || !toDate) {
					return {
						error: "Please select both start and end dates for a custom report.",
					};
				}

				const from = normalizeStartOfDayUtc(fromDate).toISOString();
				const to = normalizeEndOfDayUtc(toDate).toISOString();
				return { from, to };
			}
			default:
				return {};
		}
	};

	const fetchReports = async () => {
		setLoading(true);
		setError(null);

		try {
			const { from, to, error: rangeError } = resolveRangeParams();
			if (rangeError) {
				setError(rangeError);
				setLoading(false);
				return;
			}

			const params = {};
			if (from) params.from = from;
			if (to) params.to = to;

			const [salesRes, bestSellerRes, topEmployeesRes] =
				await Promise.all([
					api.get("/Reports/sales", { params }),
					api.get("/Reports/best-sellers", { params }),
					api.get("/Reports/top-employees", { params }),
				]);

			setSalesReport(salesRes.data);
			setBestSellers(bestSellerRes.data ?? []);
			setTopEmployees(topEmployeesRes.data ?? []);

			// Set datas to draw charts
			setBestSellersChartData(
				bestSellerRes.data.map((book) => ({
					name: book.title,
					quantity: book.quantity,
				}))
			);
			setTopEmployeesChartData(
				topEmployeesRes.data.map((employee) => ({
					name: employee.fullName,
					revenue: employee.revenue,
					receiptCount: employee.receiptCount,
				}))
			);
		} catch (err) {
			setError("Failed to load report data.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (range !== "custom" || (fromDate && toDate)) {
			fetchReports();
		}
	}, [range, fromDate, toDate]);

	return (
		<div className="p-6">
			<div className="flex items-center justify-between flex-wrap gap-3">
				<div>
					<h3 className="text-2xl font-bold">Reports</h3>
					<p className="text-sm text-gray-500">
						View sales performance and best sellers
					</p>
				</div>
				<div className="flex items-center gap-3">
					<select
						value={range}
						onChange={(e) => handleRangeChange(e.target.value)}
						className="border border-gray-300 rounded px-3 py-2"
					>
						{rangeOptions.map((option) => (
							<option value={option.value} key={option.value}>
								{option.label}
							</option>
						))}
					</select>
					{range === "custom" && (
						<div className="flex items-center gap-2">
							<DatePicker
								selected={fromDate}
								onChange={setFromDate}
								placeholderText="Start date"
								className="px-3 py-2 border border-gray-300 rounded"
							/>
							<DatePicker
								selected={toDate}
								onChange={setToDate}
								placeholderText="End date"
								className="px-3 py-2 border border-gray-300 rounded"
							/>
						</div>
					)}
					<button
						onClick={fetchReports}
						className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
						disabled={loading}
					>
						{loading ? "Loading..." : "Refresh"}
					</button>
				</div>
			</div>

			{error && (
				<div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
					{error}
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
				<div className="bg-white p-4 shadow rounded">
					<p className="text-gray-500 text-sm">Total Revenue</p>
					<p className="text-2xl font-bold mt-2">
						{formatCurrency(salesReport?.totalRevenue)}
					</p>
				</div>
				<div className="bg-white p-4 shadow rounded">
					<p className="text-gray-500 text-sm">Receipts</p>
					<p className="text-2xl font-bold mt-2">
						{salesReport?.totalReceipts ?? 0}
					</p>
				</div>
				<div className="bg-white p-4 shadow rounded">
					<p className="text-gray-500 text-sm">Employees Ranked</p>
					<p className="text-2xl font-bold mt-2">
						{topEmployees.length}
					</p>
				</div>
			</div>

			<div className="mt-8 bg-white shadow rounded">
				<div className="p-4 border-b">
					<h4 className="text-xl font-semibold">Best Sellers</h4>
					<p className="text-sm text-gray-500">
						Top selling books for the selected period
					</p>
				</div>

				<div className="p-4">
					<DataTable
						columns={bestSellerColumns}
						data={bestSellers}
						highlightOnHover
						noDataComponent="No data available for this range."
						pagination
						paginationPerPage={5}
						striped
					/>

					<div className="mt-6 flex justify-center">
						<div className="w-full max-w-2xl">
							<div className="h-80 w-full">
								<BestSellerChart data={bestSellersChartData} />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-8 bg-white shadow rounded">
				<div className="p-4 border-b">
					<h4 className="text-xl font-semibold">Top Employees</h4>
					<p className="text-sm text-gray-500">
						Employees generating the most revenue
					</p>
				</div>

				<div className="p-4">
					<DataTable
						columns={topEmployeeColumns}
						data={topEmployees}
						highlightOnHover
						noDataComponent="No data available for this range."
						pagination
						paginationPerPage={5}
						striped
					/>

					<div className="mt-6 flex justify-center">
						<div className="w-full max-w-2xl">
							<div className="h-80 w-full">
								<TopEmployeeChart
									data={topEmployeesChartData}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Reports;
