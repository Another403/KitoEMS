import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { api } from "../../api.jsx";

const Returns = () => {
	const [receipts, setReceipts] = useState([]);
	const [selectedReceiptId, setSelectedReceiptId] = useState("");
	const [receiptItems, setReceiptItems] = useState([]);
	const [returnSelections, setReturnSelections] = useState({});
	const [returnsHistory, setReturnsHistory] = useState([]);
	const [loadingReceipts, setLoadingReceipts] = useState(false);
	const [loadingItems, setLoadingItems] = useState(false);
	const [loadingReturns, setLoadingReturns] = useState(false);
	const [statusMessage, setStatusMessage] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	const fetchReceipts = async () => {
		setLoadingReceipts(true);
		try {
			const res = await api.get("/Returns/receipts");
			setReceipts(res.data);
		} catch (error) {
			console.log(error);
			setStatusMessage({
				type: "error",
				text: "Unable to load receipts. Please try again.",
			});
		} finally {
			setLoadingReceipts(false);
		}
	};

	const fetchReceiptItems = async (receiptId) => {
		if (!receiptId) return;
		setLoadingItems(true);
		try {
			const res = await api.get(`/Returns/receipts/${receiptId}/items`);
			setReceiptItems(res.data);
			setReturnSelections({});
		} catch (error) {
			console.log(error);
			setStatusMessage({
				type: "error",
				text:
					error.response?.data?.message ??
					"Unable to load receipt items.",
			});
			setReceiptItems([]);
			setReturnSelections({});
		} finally {
			setLoadingItems(false);
		}
	};

	const fetchReturnsHistory = async () => {
		setLoadingReturns(true);
		try {
			const res = await api.get("/Returns");
			setReturnsHistory(res.data);
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingReturns(false);
		}
	};

	useEffect(() => {
		fetchReceipts();
		fetchReturnsHistory();
	}, []);

	const handleReceiptChange = (e) => {
		const value = e.target.value;
		setSelectedReceiptId(value);
		setStatusMessage(null);
		fetchReceiptItems(value);
	};

	const handleQuantityChange = (bookId, quantity, maxQuantity) => {
		const safeQuantity = Math.max(
			0,
			Math.min(maxQuantity, Number(quantity))
		);
		setReturnSelections((prev) => ({
			...prev,
			[bookId]: { quantity: safeQuantity },
		}));
	};

	const selectedReceipt = useMemo(
		() => receipts.find((receipt) => receipt.id === selectedReceiptId),
		[receipts, selectedReceiptId]
	);

	const totalRefund = useMemo(() => {
		return receiptItems.reduce((sum, item) => {
			const quantity = returnSelections[item.bookId]?.quantity ?? 0;
			return sum + quantity * item.unitPrice;
		}, 0);
	}, [receiptItems, returnSelections]);

	const totalItemsSelected = useMemo(() => {
		return Object.values(returnSelections).reduce(
			(sum, selection) => sum + (selection.quantity ?? 0),
			0
		);
	}, [returnSelections]);

	const handleSubmitReturn = async (e) => {
		e.preventDefault();
		const items = Object.entries(returnSelections)
			.filter(([_, value]) => value.quantity > 0)
			.map(([bookId, value]) => ({
				bookId,
				quantity: value.quantity,
			}));

		if (!selectedReceiptId) {
			setStatusMessage({
				type: "error",
				text: "Please select a receipt first.",
			});
			return;
		}

		if (items.length === 0) {
			setStatusMessage({
				type: "error",
				text: "Please choose at least one item to return.",
			});
			return;
		}

		setSubmitting(true);
		setStatusMessage(null);

		try {
			await api.post("/Returns", {
				receiptId: selectedReceiptId,
				items,
			});

			setStatusMessage({
				type: "success",
				text: "Return processed successfully.",
			});
			setReturnSelections({});
			setSelectedReceiptId("");
			setReceiptItems([]);
			await fetchReturnsHistory();
			await fetchReceipts();
		} catch (error) {
			console.log(error);
			setStatusMessage({
				type: "error",
				text:
					error.response?.data?.message ?? "Unable to submit return.",
			});
		} finally {
			setSubmitting(false);
		}
	};

	const returnColumns = [
		{
			name: "Receipt",
			selector: (row) => row.receiptLabel,
			sortable: true,
		},
		{
			name: "Customer",
			selector: (row) => row.customer,
			sortable: true,
		},
		{
			name: "Returned Items",
			selector: (row) => row.items,
			wrap: true,
			grow: 2,
		},
		{
			name: "Refund",
			selector: (row) => `$${row.totalRefund.toFixed(2)}`,
			sortable: true,
		},
		{
			name: "Date",
			selector: (row) => row.returnDate,
			sortable: true,
		},
	];

	const returnData = useMemo(() => {
		return returnsHistory.map((ret) => ({
			id: ret.id,
			receiptLabel: ret.receipt
				? `#${ret.receipt.id.substring(0, 8)}`
				: "N/A",
			customer: ret.receipt?.customer?.name ?? "Walk-in customer",
			items:
				ret.items
					?.map(
						(item) =>
							`${item.book?.name ?? "Book"} x${item.quantity}`
					)
					.join(", ") ?? "",
			totalRefund: ret.totalRefund ?? 0,
			returnDate: ret.returnDate
				? new Date(ret.returnDate).toLocaleString("en-GB")
				: "",
		}));
	}, [returnsHistory]);

	return (
		<div className="p-5 space-y-6">
			<div className="text-center">
				<h3 className="text-2xl font-bold">Returns</h3>
				<p className="text-gray-600">
					Select a receipt, choose items to return, and submit the
					refund.
				</p>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
				<div className="xl:col-span-2 bg-white p-5 rounded shadow">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h4 className="text-xl font-semibold">
								Create Return
							</h4>
							<p className="text-sm text-gray-500">
								Refund items and adjust customer points from an
								existing receipt.
							</p>
						</div>
						<button
							type="button"
							onClick={() => {
								setSelectedReceiptId("");
								setReturnSelections({});
								setReceiptItems([]);
								setStatusMessage(null);
							}}
							className="text-sm text-teal-700 hover:underline"
						>
							Clear selection
						</button>
					</div>

					<form onSubmit={handleSubmitReturn} className="space-y-4">
						<div>
							<label className="text-sm font-medium text-gray-700">
								Receipt
							</label>
							<select
								value={selectedReceiptId}
								onChange={handleReceiptChange}
								className="mt-1 w-full border border-gray-300 rounded-md p-2"
								disabled={loadingReceipts}
							>
								<option value="" disabled>
									{loadingReceipts
										? "Loading receipts..."
										: "Select a receipt"}
								</option>
								{receipts.map((receipt) => (
									<option key={receipt.id} value={receipt.id}>
										#{receipt.id.substring(0, 8)} -{" "}
										{receipt.customer?.name ??
											"Walk-in customer"}{" "}
										(
										{new Date(
											receipt.createdAt
										).toLocaleDateString("en-GB")}
										)
									</option>
								))}
							</select>
						</div>

						{selectedReceipt && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 border rounded p-4">
								<div className="space-y-1 text-sm">
									<p>
										<span className="font-semibold">
											Customer:
										</span>{" "}
										{selectedReceipt.customer?.name ??
											"Walk-in customer"}
									</p>
									<p>
										<span className="font-semibold">
											Phone:
										</span>{" "}
										{selectedReceipt.customer
											?.phoneNumber ??
											selectedReceipt.customerPhone ??
											"N/A"}
									</p>
									<p>
										<span className="font-semibold">
											Points Earned:
										</span>{" "}
										{selectedReceipt.pointsEarned}
									</p>
								</div>
								<div className="space-y-1 text-sm md:text-right">
									<p>
										<span className="font-semibold">
											Date:
										</span>{" "}
										{new Date(
											selectedReceipt.createdAt
										).toLocaleDateString("en-GB")}
									</p>
									<p>
										<span className="font-semibold">
											Total:
										</span>{" "}
										${selectedReceipt.total?.toFixed(2)}
									</p>
									<p>
										<span className="font-semibold">
											Items:
										</span>{" "}
										{selectedReceipt.items?.length ?? 0}
									</p>
								</div>
							</div>
						)}

						{loadingItems && (
							<div className="text-sm text-gray-600">
								Loading receipt items...
							</div>
						)}

						{receiptItems.length > 0 && (
							<div className="overflow-x-auto">
								<table className="min-w-full text-sm border">
									<thead className="bg-gray-100">
										<tr>
											<th className="px-3 py-2 text-left border">
												Book
											</th>
											<th className="px-3 py-2 text-left border">
												Unit Price
											</th>
											<th className="px-3 py-2 text-left border">
												Purchased
											</th>
											<th className="px-3 py-2 text-left border">
												Return Qty
											</th>
											<th className="px-3 py-2 text-left border">
												Refund
											</th>
										</tr>
									</thead>
									<tbody>
										{receiptItems.map((item) => {
											const selectedQty =
												returnSelections[item.bookId]
													?.quantity ?? 0;
											const refund =
												selectedQty * item.unitPrice;
											return (
												<tr
													key={item.id}
													className="border-b"
												>
													<td className="px-3 py-2 border">
														{item.book?.name}
													</td>
													<td className="px-3 py-2 border">
														$
														{item.unitPrice.toFixed(
															2
														)}
													</td>
													<td className="px-3 py-2 border">
														{item.quantity}
													</td>
													<td className="px-3 py-2 border">
														<input
															type="number"
															min="0"
															max={item.quantity}
															value={selectedQty}
															onChange={(e) =>
																handleQuantityChange(
																	item.bookId,
																	e.target
																		.value,
																	item.quantity
																)
															}
															className="w-24 border rounded p-1"
														/>
													</td>
													<td className="px-3 py-2 border">
														${refund.toFixed(2)}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						)}

						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 border rounded p-4 text-sm">
							<div>
								<p className="font-semibold">
									Items selected: {totalItemsSelected}
								</p>
								<p className="text-gray-600">
									Total refund will be deducted from receipt
									totals and customer points.
								</p>
							</div>
							<div className="text-right">
								<p className="text-lg font-bold">
									Refund: ${totalRefund.toFixed(2)}
								</p>
								<button
									type="submit"
									disabled={submitting || loadingItems}
									className={`mt-2 px-4 py-2 rounded text-white hover:cursor-pointer disabled:cursor-not-allowed 
                                    ${
										submitting || loadingItems
											? "bg-teal-300 cursor-not-allowed"
											: "bg-teal-600 hover:bg-teal-700"
									}`}
								>
									{submitting
										? "Processing..."
										: "Submit Return"}
								</button>
							</div>
						</div>

						{statusMessage && (
							<div
								className={`border px-3 py-2 rounded text-sm ${
									statusMessage.type === "error"
										? "border-red-500 text-red-700 bg-red-50"
										: "border-green-500 text-green-700 bg-green-50"
								}`}
							>
								{statusMessage.text}
							</div>
						)}
					</form>
				</div>

				<div className="bg-white p-5 rounded shadow">
					<h4 className="text-xl font-semibold mb-3">
						Recent Returns
					</h4>
					<DataTable
						columns={returnColumns}
						data={returnData}
						progressPending={loadingReturns}
						highlightOnHover
						dense
						pagination
						noDataComponent={
							<div className="p-3 text-gray-500">
								No returns have been processed yet.
							</div>
						}
					/>
				</div>
			</div>
		</div>
	);
};

export default Returns;
