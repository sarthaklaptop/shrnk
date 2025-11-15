"use client";

import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

interface ChartData {
  date: string;
  clicks: number;
}

interface BasicLineChartProps {
  chartData: ChartData[];
}

export default function BasicLineChart({ chartData }: BasicLineChartProps) {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-gray-500">No click data available</p>
      </div>
    );
  }

  return (
    <BarChart
      dataset={chartData}
      xAxis={[
        {
          scaleType: "band",
          dataKey: "date",
          label: "Date",
          tickPlacement: "middle",
          colorMap: {
            type: "piecewise",
            thresholds: [],
            colors: ["rgb(252 165 165)"],
          },
        },
      ]}
      yAxis={[{ label: "Clicks" }]}
      series={[
        {
          dataKey: "clicks",
          label: "Clicks per Date",
          color: "rgb(252 165 165)",
        },
      ]}
      height={300}
      margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
    />
  );
}