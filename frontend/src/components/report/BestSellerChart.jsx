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

const BestSellerChart = ({ data, isAnimationActive = true }) => {
	return (
		<ResponsiveContainer width="90%" height="90%">
			<BarChart data={data}>
				<CartesianGrid strokeDasharray="3 3"/>
				<Tooltip/>
				<Legend/>
				<XAxis dataKey="name"/>
				<YAxis width="auto"/>
				<Bar dataKey="quantity" fill="#82ca9d" isAnimationActive={isAnimationActive}></Bar>
			</BarChart>
		</ResponsiveContainer>
	)
};

export default BestSellerChart;
