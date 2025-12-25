import React, { useState, useMemo, useEffect } from "react";
import Select from "react-select";

import Calendar from "./Calendar";

import { api } from "../../api";

const WorkshiftScheduler = () => {
	const [employees, setEmployees] = useState([]);
	const [editingId, setEditingId] = useState("");

	const fetchEmployees = async () => {
		try {
			const res = await api.get("/AppUsers");

			const data = res.data.map((employee) => ({
				value: employee.id,
				label: employee.fullName,
			}));

			setEmployees(data);
		} catch (error) {
			console.log(error);
			// error handling
		}
	};

	const [workshift, setWorkshift] = useState({
		employeeId: "",
		employee: null,
		shiftType: "",
		startTime: "",
		date: "",
		endTime: "",
		location: "Warehouse",
		note: "",
	});

	const [events, setEvents] = useState([]);

	const fetchEvents = async () => {
		try {
			const res = await api.get("/Workshifts");

			const data = res.data.map((event) => ({
				id: event.id,
				start: event.start,
				end: event.end,
				title: `${event.employee?.fullName || "Unknown"} - ${
					event.shiftType || "Shift"
				}`,

				employeeId: event.employeeId,
				shiftType: event.shiftType,
				location: event.location,
				note: event.note,
			}));

			setEvents(data);
		} catch (error) {
			console.log(error);
			// add error handling
		}
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	useEffect(() => {
		fetchEmployees();
	}, []);

	const upcomingShifts = useMemo(
		() =>
			events
				.slice()
				.sort((a, b) => new Date(a.start) - new Date(b.start))
				.slice(0, 5),
		[events]
	);

	const handleEditStart = async (shiftId) => {
		console.log(shiftId);
		setEditingId(shiftId);

		var shift = events.find((x) => x.id === shiftId);

		//console.log(shift);

		setWorkshift((prev) => ({
			...prev,
			id: shift.id,
			employeeId: shift.employeeId,
			employee: employees.find((x) => x.value === shift.employeeId),
			shiftType: shift.shiftType,
			startTime: shift.start.split("T")[1].slice(0, 5),
			date: shift.start.split("T")[0],
			endTime: shift.end.split("T")[1].slice(0, 5),
			location: shift.location,
			note: shift.note,
		}));

		//console.log(workshift);
		//console.log(shift);
	};

	const handleCancelEdit = () => {
		setEditingId("");
		setWorkshift((prev) => ({
			...prev,
			employeeId: "",
			employee: null,
			startTime: "",
			date: "",
			endTime: "",
			location: "Warehouse",
			note: "",
		}));
	};

	const handleDelete = async () => {
		if (!editingId) return;

		const id = editingId;
		const prevEvents = events;

		setEvents((prev) => prev.filter((e) => e.id !== id));
		resetForm();

		try {
			await api.delete(`/Workshifts/${id}`);
		} catch (error) {
			console.log(error);
			setEvents(prevEvents);
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setWorkshift((prev) => ({
			...prev,
			[name]: value,
		}));

		//console.log(workshift);
	};

	const resetForm = () => {
		setWorkshift((prev) => ({
			...prev,
			employeeId: "",
			employee: null,
			shiftType: "",
			date: "",
			startTime: "",
			endTime: "",
			location: "Warehouse",
			note: "",
		}));
		setEditingId(null);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (
			!workshift.employeeId ||
			!workshift.date ||
			!workshift.startTime ||
			!workshift.endTime
		) {
			return;
		}

		const start = `${workshift.date}T${workshift.startTime}`;
		const end = `${workshift.date}T${workshift.endTime}`;

		const nextEvent = {
			id: editingId || crypto.randomUUID(),
			start,
			end,
			title: `${workshift.employee?.label || "Unknown"} - ${
				workshift.shiftType || "Shift"
			}`,

			employeeId: workshift.employeeId,
			shiftType: workshift.shiftType,
			location: workshift.location,
			note: workshift.note,
		};

		setEvents((prev) =>
			editingId
				? prev.map((item) => (item.id === editingId ? nextEvent : item))
				: [...prev, nextEvent]
		);

		resetForm();

		try {
			var payload = {
				id: editingId || nextEvent.id,
				employeeId: workshift.employeeId,
				location: workshift.location,
				start: `${workshift.date}T${workshift.startTime}`,
				end: `${workshift.date}T${workshift.endTime}`,
				note: workshift.note,
				shiftType: workshift.shiftType,
			};

			const res = await (editingId
				? api.put(`/Workshifts/${payload.id}`, payload)
				: api.post("/Workshifts", payload));
		} catch (error) {
			console.log(error);
			//add error handling
		}
	};

	return (
		<div className="flex flex-col gap-6 p-5">
			<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl font-semibold text-slate-800">
							Workshift Scheduler
						</h1>
						<p className="text-sm text-slate-500">
							Plan coverage, assign roles, and keep everyone
							aligned for the week.
						</p>
					</div>
					<div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
						<div>
							<p className="text-xs text-slate-500">
								Total scheduled shifts
							</p>
							<p className="text-xl font-semibold text-slate-800">
								{events.length}
							</p>
						</div>
						<div className="h-8 w-px bg-slate-200" />
						<div>
							<p className="text-xs text-slate-500">
								Active employees
							</p>
							<p className="text-xl font-semibold text-slate-800">
								{employees.length}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="grid gap-6 xl:grid-cols-[360px_1fr]">
				<form
					className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
					onSubmit={handleSubmit}
				>
					<div>
						<h2 className="text-lg font-semibold text-slate-800">
							Schedule a new shift
						</h2>
						<p className="text-xs text-slate-500">
							Add the shift details and assign an employee.
						</p>
					</div>

					<div className="text-sm font-medium text-slate-600">
						<p>Employee</p>
						<div className="mt-1">
							<Select
								options={employees}
								onChange={(e) =>
									setWorkshift((prev) => ({
										...prev,
										employee: e,
										employeeId: e.value,
									}))
								}
								value={workshift.employee}
								placeholder="Select employee"
								isSearchable={true}
							/>
						</div>
					</div>

					<label className="block text-sm font-medium text-slate-600">
						Role / Shift type
						<input
							type="text"
							name="shiftType"
							value={workshift.shiftType}
							onChange={handleChange}
							placeholder="Morning shift, Audit, Support"
							className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
						/>
					</label>

					<div className="grid gap-4 md:grid-cols-2">
						<label className="block text-sm font-medium text-slate-600">
							Date
							<input
								type="date"
								name="date"
								value={workshift.date}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
							/>
						</label>
						<label className="block text-sm font-medium text-slate-600">
							Location
							<select
								name="location"
								value={workshift.location}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
							>
								<option>Warehouse</option>
								<option>Downtown Store</option>
								<option>Remote Support</option>
							</select>
						</label>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<label className="block text-sm font-medium text-slate-600">
							Start time
							<input
								type="time"
								name="startTime"
								value={workshift.startTime}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
							/>
						</label>
						<label className="block text-sm font-medium text-slate-600">
							End time
							<input
								type="time"
								name="endTime"
								value={workshift.endTime}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
							/>
						</label>
					</div>

					<label className="block text-sm font-medium text-slate-600">
						Note
						<textarea
							name="note"
							value={workshift.note}
							onChange={handleChange}
							rows={3}
							placeholder="Coverage goals, break times, special instructions."
							className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
						/>
					</label>

					<button
						type="submit"
						disabled={
							!workshift.employeeId ||
							!workshift.date ||
							!workshift.startTime ||
							!workshift.endTime
						}
						className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-200"
					>
						{editingId ? "Edit" : "Add shift to schedule"}
					</button>
					{editingId && (
						<button
							type="button"
							className="w-full rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-700 disabled:cursor-not-allowed disabled:bg-yellow-200"
							onClick={handleCancelEdit}
						>
							Cancel edit
						</button>
					)}
					{editingId && (
						<button
							type="button"
							className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-200"
							onClick={handleDelete}
						>
							Delete
						</button>
					)}
				</form>

				<div className="flex flex-col gap-6">
					<Calendar events={events} onEventClick={handleEditStart} />

					<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
						<div className="mb-3 flex items-center justify-between">
							<h3 className="text-sm font-semibold text-slate-800">
								Upcoming shifts
							</h3>
							<span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
								Next 5 shifts
							</span>
						</div>
						<div className="space-y-3">
							{upcomingShifts.map((shift) => (
								<div
									key={shift.id}
									className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
								>
									<div className="flex flex-wrap items-center justify-between gap-2">
										<div>
											<p className="text-sm font-semibold text-slate-700">
												{shift.title}
											</p>
											<p className="text-xs text-slate-500">
												{new Date(
													shift.start
												).toLocaleString("en-GB", {
													weekday: "short",
													month: "short",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})}
											</p>
											<p className="text-[11px] text-slate-500">
												Role: {shift.role} • Location:{" "}
												{shift.location || "N/A"}
											</p>
										</div>
									</div>
									{shift.notes && (
										<p className="mt-2 text-[11px] text-slate-500">
											Notes: {shift.notes}
										</p>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WorkshiftScheduler;
