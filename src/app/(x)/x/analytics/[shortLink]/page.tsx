"use client";

import BasicLineChart from "@/components/BasiLineChart";
import { DeviceStats } from "@/components/DeviceStats";
import { LocationStats } from "@/components/LocationStats";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function Page() {
  const params = useParams();
  const shortLink = params.shortLink;

  const [stats, setStats] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        console.log("Fetching stats for shortLink: ", shortLink);
        const result = await axios.get(
          `/api/linkStats?shortLink=${shortLink}&range=${timeRange}`
        );
        setStats(result.data);
        console.log("stats Data", result.data);
      } catch (error) {
        console.log("Error details: ", error);
        toast.error("Error Loading Stats");
      } finally {
        setLoading(false);
      }
    };

    if (shortLink) {
      fetchStats();
    }
  }, [shortLink, timeRange]);

  if (loading) {
    return (
      <div className="bg-white w-4/5 h-screen flex items-center justify-center rounded-lg mt-2 border-[1px] border-gray-300">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="bg-white w-4/5 h-screen overflow-y-auto rounded-lg mt-2 border-[1px] border-gray-300 p-4">
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-2xl">Analytics</p>

        {/* Time Range Filter */}
        <div className="flex gap-2">
          {["30d", "90d", "6m", "1y", "all"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                timeRange === range
                  ? "bg-red-300 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {range === "30d"
                ? "30 Days"
                : range === "90d"
                ? "90 Days"
                : range === "6m"
                ? "6 Months"
                : range === "1y"
                ? "1 Year"
                : "All Time"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="p-2 border rounded-lg">
          <p className="m-2 font-semibold">
            Clicks {stats?.clickCount ? `(${stats.clickCount} total)` : ""}
          </p>
          {/* ✅ Pass chartData as prop */}
          <BasicLineChart chartData={stats?.chartData || []} />
        </div>
        <DeviceStats stats={stats} />
        <LocationStats stats={stats} />
      </div>
    </div>
  );
}

export default Page;