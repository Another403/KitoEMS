import React, { useState, useMemo } from 'react'
import Calendar from './Calendar' 

const WorkshiftScheduler = () => {
	const employees = useMemo(
		() => [
			'Alex Morgan',
			'Jordan Lee',
			'Priya Singh',
			'Sam Rodriguez',
			'Taylor Brooks'
		],
		[]
	);

	const [formData, setFormData] = useState({
		employee: '',
		role: '',
		date: '',
		startTime: '',
		endTime: '',
		location: 'Main Warehouse',
		notes: ''
	});

	const [events, setEvents] = useState([
		{
			title: 'Alex Morgan • Morning Shift',
			start: '2025-12-18T08:00:00',
			end: '2025-12-18T12:00:00'
		},
		{
			title: 'Priya Singh • Inventory Audit',
			start: '2025-12-19T13:00:00',
			end: '2025-12-19T17:00:00'
		},
		{
			title: 'Jordan Lee • Closing Shift',
			start: '2025-12-20T15:00:00',
			end: '2025-12-20T20:00:00'
		}
	]);

	const upcomingShifts = useMemo(
		() =>
			events
				.slice()
				.sort((a, b) => new Date(a.start) - new Date(b.start))
				.slice(0, 5),
		[events]
	);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!formData.employee || !formData.date || !formData.startTime) {
			return;
		}

		const start = `${formData.date}T${formData.startTime}`;
		const end = formData.endTime ? `${formData.date}T${formData.endTime}` : undefined;
		const title = `${formData.employee} • ${formData.role || 'Shift'}`;

		setEvents((prev) => [
			...prev,
			{
				title,
				start,
				end
			}
		]);

		setFormData((prev) => ({
			...prev,
			role: '',
			date: '',
			startTime: '',
			endTime: '',
			notes: ''
		}));
	}

	return (
		<div className="flex flex-col gap-6 p-5">
			<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl font-semibold text-slate-800">Workshift Scheduler</h1>
						<p className="text-sm text-slate-500">
							Plan coverage, assign roles, and keep everyone aligned for the week.
						</p>
					</div>
					<div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
						<div>
							<p className="text-xs text-slate-500">Total scheduled shifts</p>
							<p className="text-xl font-semibold text-slate-800">{events.length}</p>
						</div>
						<div className="h-8 w-px bg-slate-200" />
						<div>
							<p className="text-xs text-slate-500">Active employees</p>
							<p className="text-xl font-semibold text-slate-800">{employees.length}</p>
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
						<h2 className="text-lg font-semibold text-slate-800">Schedule a new shift</h2>
						<p className="text-xs text-slate-500">
							Add the shift details and assign an employee.
						</p>
					</div>

					<label className="block text-sm font-medium text-slate-600">
						Employee
						<select
							name="employee"
							value={formData.employee}
							onChange={handleChange}
							className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
						>
							<option value="">Select employee</option>
							{employees.map((employee) => (
								<option key={employee} value={employee}>
									{employee}
								</option>
							))}
						</select>
					</label>

					<label className="block text-sm font-medium text-slate-600">
						Role / Shift type
						<input
							type="text"
							name="role"
							value={formData.role}
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
								value={formData.date}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
							/>
						</label>
						<label className="block text-sm font-medium text-slate-600">
							Location
							<select
								name="location"
								value={formData.location}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
							>
								<option>Main Warehouse</option>
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
								value={formData.startTime}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
							/>
						</label>
						<label className="block text-sm font-medium text-slate-600">
							End time
							<input
								type="time"
								name="endTime"
								value={formData.endTime}
								onChange={handleChange}
								className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
							/>
						</label>
					</div>

					<label className="block text-sm font-medium text-slate-600">
						Notes
						<textarea
							name="notes"
							value={formData.notes}
							onChange={handleChange}
							rows={3}
							placeholder="Coverage goals, break times, special instructions."
							className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
						/>
					</label>

					<button
						type="submit"
						disabled={!formData.employee || !formData.date || !formData.startTime}
						className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-200"
					>
						Add shift to schedule
					</button>
				</form>

				<div className="flex flex-col gap-6">
					<Calendar events={events} />

					<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
						<div className="mb-3 flex items-center justify-between">
							<h3 className="text-sm font-semibold text-slate-800">Upcoming shifts</h3>
							<span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
								Next 5 shifts
							</span>
						</div>
						<div className="space-y-3">
							{upcomingShifts.map((shift) => (
								<div
									key={`${shift.title}-${shift.start}`}
									className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
								>
									<p className="text-sm font-semibold text-slate-700">{shift.title}</p>
									<p className="text-xs text-slate-500">
										{new Date(shift.start).toLocaleString('en-US', {
											weekday: 'short',
											month: 'short',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default WorkshiftScheduler
