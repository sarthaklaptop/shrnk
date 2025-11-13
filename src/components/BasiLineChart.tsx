"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

interface ChartData {
  date: string;
  clicks: number;
}

export default function BasicLineChart() {
  const params = useParams();
  const shortLink = params.shortLink;

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const result = await axios.get(`/api/link?id=${shortLink}`);
        const timestamps = result.data.mainData;
        if (!Array.isArray(timestamps)) {
          throw new Error("Invalid data format");
        }

        const groupedData = timestamps.reduce(
          (acc, timestamp) => {
            const date = new Date(timestamp).toISOString().split("T")[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        const formattedData = Object.entries(groupedData)
          .map(([date, clicks]) => ({
            date: new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            }),
            clicks: clicks as number,
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(-30); // Show last 30 days

        setChartData(formattedData);
      } catch (error) {
        console.error("Error loading chart data:", error);
        toast.error("Error loading click statistics");
      } finally {
        setLoading(false);
      }
    };

    if (shortLink) {
      fetchStats();
    }
  }, [shortLink]);

  if (loading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="animate-pulse w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>No click data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--muted))"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{
              color: "hsl(var(--foreground))",
              fontWeight: 500,
            }}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorClicks)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
