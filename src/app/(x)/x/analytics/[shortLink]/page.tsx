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
      <div className="bg-white w-4/5 h-screen flex flex-col items-center justify-center rounded-lg mt-2 border-[1px] border-gray-300 gap-4">
        <Spinner size="lg" />
      </div>
    );
  }
  return (
    <div className="bg-white w-4/5 h-screen overflow-y-auto rounded-lg mt-2 border-[1px] border-gray-300 p-4">
      <div className="flex flex-col justify-between items-left mb-4">
        <p className="text-content-emphasis min-w-0 text-lg font-semibold leading-7 mb-2">
          Analytics
        </p>

        <hr className="mb-4" />

        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/x"
                  className="
                    relative
                    text-base font-semibold leading-7 text-neutral-900
                    cursor-pointer transition-all ease-in-out
                    before:absolute before:bottom-0 before:left-[50%]
                    before:h-[1px] before:w-0 before:bg-red-400 before:origin-center
                    before:transition-[width] before:ease-in-out before:duration-700
                    after:absolute after:bottom-0 after:right-[50%]
                    after:h-[1px] after:w-0 after:bg-red-400 after:origin-center
                    after:transition-[width] after:ease-in-out after:duration-700
                    hover:before:w-[50%] hover:after:w-[50%]
                    hover:text-red-400
                  "
                >
                  Links
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-base font-semibold leading-7">
                {shortLink}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <hr className="mb-4" />

        <div>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="group peer flex cursor-pointer appearance-none items-center gap-x-2 truncate rounded-md border px-3 h-10 outline-none text-sm bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 transition-all disabled:pointer-events-none disabled:bg-neutral-100 disabled:text-neutral-400 focus-visible:border-neutral-500 data-[state=open]:border-neutral-500 data-[state=open]:ring-4 data-[state=open]:ring-neutral-200 sm:inline-flex w-full sm:min-w-[160px] md:w-fit lg:min-w-[200px]"
                type="button"
                disabled={!isPremium && timeRange !== "30d"}
              >
                <Calendar className="h-4 w-4 shrink-0 text-neutral-900" />
                <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left text-neutral-900">
                  {getTimeRangeLabel(timeRange)}
                </span>
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 text-neutral-400 transition-transform duration-75 ${
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
                    className={`cursor-pointer ${
                      timeRange === range ? "bg-red-100" : ""
                    }`}
                  >
                    {getTimeRangeLabel(range)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
        {/* Time Range Filter */}
      </div>

      <div className="flex flex-col gap-2">
        <div className="p-2 border rounded-lg">
          <p className="m-2 font-semibold">
            Clicks {stats?.clickCount ? `(${stats.clickCount} total)` : ""}
          </p>
          {/* ✅ Pass chartData as prop */}
          <BasicLineChart chartData={stats?.chartData || []} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <DeviceStats stats={stats} />
          <LocationStats stats={stats} />
        </div>
      </div>
    </div>
  );
}

export default Page;
