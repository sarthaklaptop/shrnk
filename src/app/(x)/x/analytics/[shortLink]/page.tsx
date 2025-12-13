"use client";

import BasicLineChart from "@/components/BasiLineChart";
import { DeviceStats } from "@/components/DeviceStats";
import { LocationStats } from "@/components/LocationStats";
import Spinner from "@/components/ui/spinner";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function Page() {
  const params = useParams();
  const shortLink = params.shortLink as string;

  const [stats, setStats] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("30d"); // Default to 30d for free users
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "30d":
        return "Last 30 days";
      case "90d":
        return "Last 90 days";
      case "6m":
        return "Last 6 months";
      case "1y":
        return "Last 1 year";
      case "all":
        return "All time";
      default:
        return "Last 30 days";
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        console.log("Fetching stats for shortLink: ", shortLink);
        const result = await axios.get(
          `/api/linkStats?shortLink=${shortLink}&range=${timeRange}`
        );
        setStats(result.data);
        setIsPremium(result.data.isPremium || false);
        // For free users, ensure timeRange is 30d
        if (!result.data.isPremium && timeRange !== "30d") {
          setTimeRange("30d");
        }
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
      <div className="bg-white w-full h-[60vh] flex flex-col items-center justify-center rounded-xl mt-4 border border-neutral-200 gap-4">
        <Spinner size="lg" />
      </div>
    );
  }
  return (
    <div className="bg-white w-full min-h-screen rounded-xl mt-4 border border-neutral-200 dark:border-neutral-800 p-4 md:p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <p className="text-content-emphasis text-xl md:text-2xl font-bold leading-tight">
            Analytics
          </p>
          
          <Breadcrumb className="mt-1">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/x"
                    className="
                      relative
                      text-sm md:text-base font-medium text-neutral-500 hover:text-red-500
                      transition-colors
                    "
                  >
                    Links
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm md:text-base font-semibold text-neutral-900">
                  {shortLink}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="w-full md:w-auto">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="group flex w-full md:w-auto cursor-pointer items-center justify-between gap-x-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                disabled={!isPremium && timeRange !== "30d"}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neutral-500" />
                  <span>{getTimeRangeLabel(timeRange)}</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </DropdownMenuTrigger>
            {isPremium && (
              <DropdownMenuContent align="end" className="w-[200px]">
                {["30d", "90d", "6m", "1y", "all"].map((range) => (
                  <DropdownMenuItem
                    key={range}
                    onClick={() => {
                      setTimeRange(range);
                      setDropdownOpen(false);
                    }}
                    className={`cursor-pointer font-medium ${
                      timeRange === range ? "bg-red-50 text-red-600" : ""
                    }`}
                  >
                    {getTimeRangeLabel(range)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="border-b border-neutral-200 bg-neutral-50/50 px-4 py-3 md:px-6 md:py-4">
             <h3 className="font-semibold text-neutral-900 flex items-center gap-2 text-sm md:text-base">
                Total Clicks
                {stats?.clickCount !== undefined && (
                   <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                     {stats.clickCount}
                   </span>
                )}
             </h3>
          </div>
          <div className="p-0">
             <BasicLineChart chartData={stats?.chartData || []} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
          <DeviceStats stats={stats} />
          <LocationStats stats={stats} />
        </div>
      </div>
    </div>
  );
}

export default Page;
