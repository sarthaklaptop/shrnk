import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface DeviceData {
  device: string;
  count: number;
  percentage: number;
}

interface DeviceStatsProps {
  stats?: any;
}

export function DeviceStats({ stats }: DeviceStatsProps) {
  // Use neutral colors that match our design system
  const COLORS = [
    "hsl(var(--chart-1))",  // Primary blue-gray
    "hsl(var(--chart-2))",  // Secondary blue
    "hsl(var(--chart-3))",  // Accent blue
    "hsl(var(--chart-4))",  // Light gray
    "hsl(var(--chart-5))",  // Lighter gray
  ];

  // Process device data
  const deviceCount = stats && Array.isArray(stats.clicks)
    ? stats.clicks.reduce((acc: any, click: any) => {
        const device = click.deviceType || 'Unknown';
        if (!acc[device]) {
          acc[device] = 0;
        }
        acc[device]++;
        return acc;
      }, {})
    : {
        'Desktop': 45,
        'Mobile': 35,
        'Tablet': 20,
      }; // Fallback data for demonstration

  const totalClicks = Object.values(deviceCount).reduce((sum: number, count: any) => sum + count, 0);

  const result: DeviceData[] = Object.keys(deviceCount)
    .map((device) => ({
      device,
      count: deviceCount[device] as number,
      percentage: ((deviceCount[device] as number) / totalClicks) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{data.device}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.count} clicks ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percentage < 5) return null; // Don't show label for very small slices

    return (
      <text
        x={x}
        y={y}
        fill="hsl(var(--foreground))"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={result}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
          >
            {result.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Device Legend */}
      <div className="mt-4 space-y-2">
        {result.map((device, index) => (
          <div key={device.device} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-700 dark:text-gray-300">{device.device}</span>
            </div>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {device.count} ({device.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
