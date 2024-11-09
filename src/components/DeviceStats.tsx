import React from 'react'
import {PieChart, Pie, Cell, ResponsiveContainer} from "recharts";


export function DeviceStats({stats}:any) {

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    console.log("Stats from DeviceStats: ",stats);

    const deviceCount = stats && Array.isArray(stats.clicks)
    ? stats.clicks.reduce((acc: any, click: any) => {
        const device = click.deviceType;
        if (!acc[device]) {
          acc[device] = 0;
        }
        acc[device]++;
        return acc;
      }, {})
    : {};

    const result = Object.keys(deviceCount).map((device) => ({
        device,
        count: deviceCount[device],
      }));
    


  return (
    <div>
        <div>DeviceStats</div>
        <div style={{width: "100%", height: 300}}>
            <ResponsiveContainer>
                <PieChart width={700} height={400}>
                <Pie
                    data={result}
                    labelLine={false}
                    label={({device, percent}) =>
                    `${device}: ${(percent * 100).toFixed(0)}%`
                    }
                    dataKey="count"
                >
                    {result.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                    />
                    ))}
                </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
  )
}
