import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar = ({ events, onEventClick }) => {
	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-2">
				<div>
					<h2 className="text-lg font-semibold text-slate-800">
						Schedule
					</h2>
					<p className="text-xs text-slate-500">
						Track upcoming shifts and events.
					</p>
				</div>
				<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
					Workshifts calendar
				</span>
			</div>
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView={"dayGridMonth"}
				headerToolbar={{
					start: "today prev,next",
					center: "title",
					end: "dayGridMonth timeGridWeek timeGridDay",
				}}
				height="auto"
				events={events}
				themeSystem="bootstrap"
				dayHeaderClassNames={() =>
					"text-[11px] font-bold uppercase tracking-wide text-slate-500"
				}
				dayCellClassNames={() =>
					"border border-slate-100 bg-white text-sm text-slate-700 hover:bg-slate-50 font-semibold"
				}
				nowIndicatorClassNames={() => "border border-slate-900"}
				buttonClassNames={() =>
					"rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
				}
				buttonText={{
					today: "Today",
					month: "Month",
					week: "Week",
					day: "Day",
				}}
				eventClassNames={() =>
					"rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700"
				}
				dayMaxEventRows={5}
				eventClick={(e) => {
					if (!onEventClick) return;
					var shiftId = e.event.id;
					onEventClick(shiftId);
				}}
				slotEventOverlap='false'
				// Time format
				eventTimeFormat={{
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				}}
				slotLabelFormat={{
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				}}
			/>
		</div>
	);
};

export default Calendar;
