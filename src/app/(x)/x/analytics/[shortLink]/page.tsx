"use client";

import BasicLineChart from "@/components/BasiLineChart";
import { DeviceStats } from "@/components/DeviceStats";
import { LocationStats } from "@/components/LocationStats";
import axios from "axios";
import chalk from "chalk";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function Page() {
  const params = useParams();
  const shortLink = params.shortLink;

  const [stats, setStats] = useState();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching stats for shortLink: ", shortLink);
        const result = await axios.get(`/api/linkStats?shortLink=${shortLink}`);
        setStats(result.data);
        // console.log("stats Data", result.data);
      } catch (error) {
        console.log("Error details: ", error);
        toast("Error Loading Stats");
      }
    };

    fetchStats();
  }, [shortLink]);

  return (
    <div className="bg-white w-4/5 h-screen overflow-y-auto rounded-lg mt-2 border-[1px] border-gray-300 p-4 items-center justify-center">
      <p className="font-bold p-2 text-2xl">Analytics</p>
      <div className="flex flex-col gap-2">
        <div className="p-2 border rounded-lg">
          <p className="m-2 font-semibold">Clicks</p>
          <BasicLineChart />
        </div>
        <DeviceStats stats={stats} />
        <LocationStats stats={stats} />
      </div>
    </div>
  );
}

export default Page;
