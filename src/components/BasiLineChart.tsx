'use client'

import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';


export default function BasiLineChart() {
  // console.log("From Baselinechart ",stats)
  const params = useParams();
  const shortLink = params.shortLink;

  const [chartData, setChartData] = useState<{ date: string; clicks: number }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // console.log("Fetching stats for BasiLineChart: ", shortLink)
        console.log("ShortLink value: ", shortLink);
        const result = await axios.get(`/api/link?id=${shortLink}`);
        const timestamps = result.data.mainData;
        console.log("from baseLineChart ", timestamps);
        if (!Array.isArray(timestamps)) {
          throw new Error("Invalid data format");
        }

        const groupedData = timestamps.reduce((acc, timestamp) => {
          const date = new Date(timestamp).toISOString().split('T')[0]; // Extract date part (YYYY-MM-DD)
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        console.log("grouped data ", groupedData);

        const formattedData = Object.entries(groupedData).map(([date, clicks]) => ({
          date,
          clicks: clicks as number
        }));

        console.log("formatted data, ", formattedData);

        setChartData(formattedData);
      } catch (error) {
        console.log("Error details: ",error)
        toast("Error Loading Stats")
      }
    }

    fetchStats();
  }, [])



  return (
    <BarChart
    dataset={chartData}
    xAxis={[
      {
        scaleType: 'band',
        dataKey: 'date',
        label: 'Date',
        tickPlacement: 'middle',
      },
    ]}
    yAxis={[
      { dataKey: 'clicks', label: 'Clicks' },
    ]}
    series={[
      { dataKey: 'clicks', label: 'Clicks per Date' },
    ]}
      width={500}
      height={300}
    />
  );
}
