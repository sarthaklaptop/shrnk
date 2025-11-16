"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  date: string;
  clicks: number;
}

interface BasicLineChartProps {
  chartData: ChartData[];
}

// Custom Tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const date = new Date(payload[0].payload.date);
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2">
        <p className="text-xs text-gray-500 mb-1">{formattedDate}</p>
        <p className="text-sm font-semibold text-red-600">
          {payload[0].value} {payload[0].value === 1 ? "click" : "clicks"}
        </p>
      </div>
    );
  }
  return null;
};

// Format date for X-axis
const formatXAxis = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export default function BasicLineChart({ chartData }: BasicLineChartProps) {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[384px] flex items-center justify-center">
        <p className="text-gray-400">No click data available</p>
      </div>
    );
  }

  // Show only first and last date on X-axis
  const firstDate = chartData[0]?.date;
  const lastDate = chartData[chartData.length - 1]?.date;

  const formatXAxisTick = (value: string) => {
    if (value === firstDate || value === lastDate) {
      const date = new Date(value);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
    return "";
  };

  return (
    <div className="relative w-full h-[384px] overflow-hidden border-x border-b border-neutral-200 sm:rounded-b-xl">
      <div className="p-5 pt-10 sm:p-10">
        <ResponsiveContainer width="100%" height={384}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <CartesianGrid
              strokeDasharray="5 5"
              stroke="#00000026"
              vertical={false}
            />

            {/* X Axis */}
            <XAxis
              dataKey="date"
              axisLine={{ stroke: "#00000026" }}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#00000066" }}
              tickFormatter={formatXAxisTick}
              dy={10}
            />

            {/* Y Axis */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#00000066" }}
              domain={[0, "dataMax"]}
              allowDecimals={false}
            />

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#ef4444", strokeWidth: 1 }} />

            {/* Area */}
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#ef4444"
              strokeWidth={2}
              strokeOpacity={0.8}
              fill="url(#colorClicks)"
              animationDuration={800}
              dot={false}
              activeDot={{
                r: 4,
                fill: "#ef4444",
                strokeWidth: 0,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}