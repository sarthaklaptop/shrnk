"use client";

import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

export default function BasiLineChart() {
  const params = useParams();
  const shortLink = params.shortLink;

  const [chartData, setChartData] = useState<
    { date: string; clicks: number }[]
  >([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
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

        const formattedData = Object.entries(groupedData).map(
          ([date, clicks]) => ({
            date,
            clicks: clicks as number,
          }),
        );
        setChartData(formattedData);
      } catch (error) {
        console.log("Error details: ", error);
        toast("Error Loading Stats");
      }
    };

    fetchStats();
  }, [shortLink]);

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
            type: 'piecewise',
            thresholds: [],
            colors: ['rgb(252 165 165)'],
          }
        },
      ]}
      yAxis={[{ dataKey: "clicks", label: "Clicks" }]}
      series={[{ dataKey: "clicks", label: "Clicks per Date", color: "rgb(252 165 165)" }]}
      height={300}
    />
    
  );
}
