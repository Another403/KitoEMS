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

const TopEmployeeChart = ({ data, isAnimationActive = true }) => {
    return (
        <ResponsiveContainer width="90%" height="90%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip cursor={false}/>
                <Legend/>
                <XAxis dataKey="name"/>
                <YAxis width="50" dataKey="revenue" yAxisId="left"/>
                <YAxis width="50" dataKey="receiptCount" yAxisId="right" orientation="right"/>
                <Bar yAxisId="left" barSize="60" dataKey="revenue" fill="#0f766e" isAnimationActive={isAnimationActive}></Bar>
                <Bar yAxisId="right" barSize="60" dataKey="receiptCount" fill="#6366f1" isAnimationActive={isAnimationActive}></Bar>
            </BarChart>
        </ResponsiveContainer>
    )
};

export default TopEmployeeChart;