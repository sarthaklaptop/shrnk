import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface LocationData {
  location: string;
  count: number;
}

interface LocationStatsProps {
  stats?: any;
}

export function LocationStats({ stats }: LocationStatsProps) {

  // Process location data
  const locationCount = stats && Array.isArray(stats.clicks)
    ? stats.clicks.reduce((acc: any, item: any) => {
        const location = item.country || item.city || 'Unknown';
        if (acc[location]) {
          acc[location] += 1;
        } else {
          acc[location] = 1;
        }
        return acc;
      }, {})
    : {
        'United States': 85,
        'United Kingdom': 45,
        'Canada': 32,
        'Germany': 28,
        'Australia': 21,
        'France': 18,
        'India': 15,
        'Japan': 12,
      }; // Fallback data for demonstration

  const locations: LocationData[] = Object.entries(locationCount)
    .map(([location, count]) => ({
      location,
      count: count as number,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Show top 8 locations

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{data.location}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.count} clicks
          </p>
        </div>
      );
    }
    return null;
  };

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={locations}
          layout="horizontal"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <XAxis
            type="number"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="location"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={75}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            radius={[0, 4, 4, 0]}
          >
            {locations.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Location Summary */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <p className="text-gray-600 dark:text-gray-400">Total Countries</p>
          <p className="font-semibold text-gray-900 dark:text-white">{locations.length}</p>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <p className="text-gray-600 dark:text-gray-400">Top Location</p>
          <p className="font-semibold text-gray-900 dark:text-white truncate">
            {locations[0]?.location || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}