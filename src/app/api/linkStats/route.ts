import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const shortLink = searchParams.get("shortLink");
    const timeRange = searchParams.get("range") || "all";

    if (!shortLink) {
      return NextResponse.json(
        { error: "shortLink parameter is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, userType: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // For free users, enforce 30-day limit
    if (user.userType === "FREE" && timeRange !== "30d" && timeRange !== "all") {
      return NextResponse.json(
        { error: "Free users can only access 30 days of analytics data" },
        { status: 403 }
      );
    }

    // For free users, if "all" is selected, default to 30d
    let effectiveTimeRange = timeRange;
    if (user.userType === "FREE" && timeRange === "all") {
      effectiveTimeRange = "30d";
    }

    // Get link
    const link = await prisma.link.findUnique({
      where: { shortLink },
      select: {
        id: true,
        userId: true,
        shortLink: true,
        longLink: true,
        clickCount: true,
      },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (link.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Calculate time filter using effectiveTimeRange
    let dateFilter: Date | undefined;
    switch (effectiveTimeRange) {
      case "30d":
        dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        dateFilter = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "6m":
        dateFilter = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        dateFilter = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      case "all":
        dateFilter = undefined;
        break;
    }

    // Get clicks
    const clicks = await prisma.click.findMany({
      where: {
        linkId: link.id,
        ...(dateFilter ? { createdAt: { gte: dateFilter } } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate stats
    const dailyClicks: Record<string, number> = {};
    const stats = {
      byCountry: {} as Record<string, number>,
      byDevice: {} as Record<string, number>,
      byOS: {} as Record<string, number>,
      byCity: {} as Record<string, number>,
      byBrowser: {} as Record<string, number>,
    };

    clicks.forEach((click) => {
      const dateKey = new Date(click.createdAt).toISOString().split("T")[0];
      dailyClicks[dateKey] = (dailyClicks[dateKey] || 0) + 1;

      if (click.country) stats.byCountry[click.country] = (stats.byCountry[click.country] || 0) + 1;
      if (click.deviceType) stats.byDevice[click.deviceType] = (stats.byDevice[click.deviceType] || 0) + 1;
      if (click.os) stats.byOS[click.os] = (stats.byOS[click.os] || 0) + 1;
      if (click.city) stats.byCity[click.city] = (stats.byCity[click.city] || 0) + 1;
      if (click.browser) stats.byBrowser[click.browser] = (stats.byBrowser[click.browser] || 0) + 1;
    });

    // Convert to array
    const dailyClicksArray = Object.entries(dailyClicks)
      .map(([date, clicks]) => ({ date, clicks }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Fill missing days if needed
    let chartData = dailyClicksArray;
    if (effectiveTimeRange !== "all") {
      const daysMap: Record<string, number> = {
        "30d": 30,
        "90d": 90,
        "6m": 180,
        "1y": 365,
      };
      const days = daysMap[effectiveTimeRange] || 30;
      
      const result: Array<{ date: string; clicks: number }> = [];
      const today = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split("T")[0];
        const existing = dailyClicksArray.find((d) => d.date === dateKey);
        result.push({ date: dateKey, clicks: existing ? existing.clicks : 0 });
      }
      
      chartData = result;
    }

    return NextResponse.json({
      link: link.shortLink,
      clickCount: clicks.length,
      clicks,
      stats,
      chartData,
      timeRange: effectiveTimeRange,
      isPremium: user.userType === "PREMIUM",
    });
  } catch (error: any) {
    console.error("Error in linkStats:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}