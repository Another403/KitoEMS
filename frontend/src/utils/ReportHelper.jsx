export const formatCurrency = (value) => {
	return (
		value?.toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
		}) ?? "$0"
	);
};

export const bestSellerColumns = [
	{
		name: "Rank",
		selector: (_row, index) => index + 1,
		width: "120px",
	},
	{
		name: "Title",
		selector: (row) => row.title,
		sortable: true,
		grow: 2,
	},
	{
		name: "Quantity Sold",
		selector: (row) => row.quantity,
		sortable: true,
		right: true,
		width: "180px",
	},
];

export const topEmployeeColumns = [
	{
		name: "Rank",
		selector: (_row, index) => index + 1,
		width: "120px",
	},
	{
		name: "Employee",
		selector: (row) => row.fullName,
		sortable: true,
		grow: 2,
	},
	{
		name: "Receipts",
		selector: (row) => row.receiptCount,
		sortable: true,
		right: true,
		width: "160px",
	},
	{
		name: "Revenue",
		selector: (row) => row.revenue,
		format: (row) => formatCurrency(row.revenue),
		sortable: true,
		right: true,
		width: "180px",
	},
];
