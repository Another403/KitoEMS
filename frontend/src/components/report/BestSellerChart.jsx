import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from "recharts";

const truncate = (s, n = 14) => (s?.length > n ? s.slice(0, n) + "…" : s);

const BestSellerChart = ({ data, isAnimationActive = true }) => {
	return (
		<ResponsiveContainer width="90%" height="90%">
			<BarChart data={data}>
				<CartesianGrid strokeDasharray="3 3"/>
				<Tooltip/>
				<Legend/>
				<XAxis
					dataKey="name" 
					tick={{ fontSize: 12 }}
					interval={0}
					tickFormatter={(v) => truncate(v, 14)}
				/>
				<YAxis width="auto" dataKey="quantity"/>
				<Bar barSize="60" dataKey="quantity" fill="#14b8a6" isAnimationActive={isAnimationActive}></Bar>
			</BarChart>
		</ResponsiveContainer>
	)
};

export default BestSellerChart;
