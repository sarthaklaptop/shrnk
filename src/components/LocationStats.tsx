
import React from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  

export function LocationStats({stats}:any) {

    // console.log("Stats from Location Stats: ",stats);

    const cityCount = stats && Array.isArray(stats.clicks) 
    ? stats.clicks.reduce((acc:any, item:any) => {
        if (acc[item.city]) {
          acc[item.city] += 1;
        } else {
          acc[item.city] = 1;
        }
        return acc;
      }, {})
      : {};
    
      const cities = Object.entries(cityCount).map(([city, count]) => ({
        city,
        count,
      }));
    
      return (
        <div className="p-2 border rounded-lg h-96 max-h-80">
          <p className='font-semibold m-2'>Location Stats</p>
          <ResponsiveContainer>
            <LineChart data={cities.slice(0, 5)}>
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip labelStyle={{color: "green"}} />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    
}