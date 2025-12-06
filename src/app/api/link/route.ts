import { Chalk } from "./../../../../node_modules/chalk/source/index.d";
import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { BASEURL } from "@/constants/constant";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import chalk from "chalk";
import bcrypt from "bcryptjs";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 6);

export async function POST(request: NextRequest) {
  try {
    console.log(chalk.bgBlue("Inside POST route"));

    const session = await getServerSession(authOptions);
    const { longLink, password } = await request.json();

    if (!longLink) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const shortLink = nanoid();
    let userId: string | null = null;

    // ✅ Fetch user if logged in
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          credits: true,
          userType: true,
        },
      });

      console.log(chalk.bgCyan("User:", JSON.stringify(user)));

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
      }

      userId = user.id;

      // ✅ Check credits
      if (user.credits <= 0) {
        return NextResponse.json(
          { error: "Insufficient credits to create a short URL" },
          { status: 403 }
        );
      }

      // ✅ Check password protection rule
      if (password && user.userType !== "PREMIUM") {
        return NextResponse.json(
          { error: "Password protection is a premium feature" },
          { status: 403 }
        );
      }

      // ✅ Decrement credits
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      });
    }

    // ✅ Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // ✅ Expiry times
    const expiresAt = userId
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year for logged-in
      : new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day for guests

    // ✅ Create link (schema-correct)
    const redirectUrl = await prisma.link.create({
      data: {
        longLink,
        shortLink,
        fullShortLink: `${BASEURL}/${shortLink}`,
        clickLimit: 0,
        expiresAt,
        password: hashedPassword,
        clickCount: 0,
        ...(userId ? { user: { connect: { id: userId } } } : {}),
      },
    });

    console.log(chalk.bgGreen("URL Created Successfully"));

    return NextResponse.json(
      {
        message: "Short URL created",
        data: redirectUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating short URL:", error);
    return NextResponse.json(
      {
        error: "Error creating short URL",
        details: error.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    console.log(chalk.bgBlue("Inside PATCH route"));

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id, longLink, password, removePassword } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Link ID is required" }, { status: 400 });
    }

    if (!longLink) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, userType: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Find the link and verify ownership
    const existingLink = await prisma.link.findUnique({
      where: { id },
      select: { userId: true, password: true },
    });

    if (!existingLink) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (existingLink.userId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to update this link" },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: any = { longLink };

    // Handle password changes
    if (password !== undefined) {
      // If password is provided (add or change), hash it
      // Note: If password is empty string, treat as remove, but frontend sends null/undefined for no change
      if (password && password.trim() !== "") {
        if (user.userType !== "PREMIUM") {
          return NextResponse.json(
            { error: "Password protection is a premium feature" },
            { status: 403 }
          );
        }
        updateData.password = await bcrypt.hash(password, 10);
      } else if (removePassword) {
        // Explicit remove
        updateData.password = null;
      }
      // If password is null/undefined and no removePassword, no change to password
    } else if (removePassword) {
      updateData.password = null;
    }

    // Update the link
    const updatedLink = await prisma.link.update({
      where: { id },
      data: updateData,
    });

    console.log(chalk.bgGreen("Link Updated Successfully"));

    return NextResponse.json(
      {
        message: "Link updated successfully",
        data: updatedLink,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      {
        error: "Error updating link",
        details: error.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log(chalk.bgBlue("Inside DELETE route"));

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const link = await prisma.link.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    console.log(chalk.bgRed("userId from db:", link.userId));
    console.log(chalk.bgRed(JSON.stringify(session)));

    if (link.userId !== session.user?.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this link" },
        { status: 403 }
      );
    }

    await prisma.link.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Link deleted successfully" });
  } catch (error: Response | any) {
    console.error("Error Deleteing short URL:", error);
    return NextResponse.json(
      { error: "Error Deleteing short URL", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shortLink = searchParams.get("id");
    const searchQuery = searchParams.get("search");
    const timeRange = searchParams.get("range");

    // Handle search query
    if (searchQuery) {
      const session = await getServerSession(authOptions);

      if (!session || !session.user || !session.user.email) {
        return NextResponse.json(
          { error: "Not authenticated" },
          { status: 401 }
        );
      }

      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
      }

      // let searchTerm = searchQuery.trim();
      let searchTerm = decodeURIComponent(searchQuery).trim();

      searchTerm = searchTerm.replace(/^https?:\/\//, "");

      if (
        searchTerm.includes("shrnk-six.vercel.app") ||
        searchTerm.includes("localhost:3000")
      ) {
        const parts = searchTerm.split("/");
        searchTerm = parts[parts.length - 1];
      }

      // Search by shortLink or longLink
      const searchResults = await prisma.link.findMany({
        where: {
          userId: user.id,
          OR: [
            {
              shortLink: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              longLink: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          ],
        },
      });

      return NextResponse.json({ data: searchResults }, { status: 200 });
    }

    // Handle existing ID-based query
    if (!shortLink) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("Before DB Call");

    const data = await prisma.link.findUnique({
      where: { shortLink },
    });

    if (!data) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (data.userId !== user?.id) {
      return NextResponse.json(
        { error: "Not authorized to view this link's analytics" },
        { status: 403 }
      );
    }

    let dateFilter: Date | undefined;

    switch (timeRange) {
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
      default:
        dateFilter = undefined;
    }

    const clicks = await prisma.click.findMany({
      where: {
        linkId: data?.id,
        ...(dateFilter ? { createdAt: { gte: dateFilter } } : {}),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        country: true,
        city: true,
        deviceType: true,
        os: true,
        browser: true,
      },
    });

    const dailyClicks: Record<string, number> = {};

    const stats = {
      totalClicks: clicks.length,
      byCountry: {} as Record<string, number>,
      byDevice: {} as Record<string, number>,
      byOS: {} as Record<string, number>,
      byCity: {} as Record<string, number>,
      byBrowser: {} as Record<string, number>,
    };

    clicks.forEach((click) => {
      // Daily Clicks
      const dateKey = new Date(click.createdAt).toISOString().split("T")[0];
      dailyClicks[dateKey] = (dailyClicks[dateKey] || 0) + 1;

      // Country
      if (click.country) {
        stats.byCountry[click.country] =
          (stats.byCountry[click.country] || 0) + 1;
      }

      // Device
      if (click.deviceType) {
        stats.byDevice[click.deviceType] =
          (stats.byDevice[click.deviceType] || 0) + 1;
      }

      // OS
      if (click.os) {
        stats.byOS[click.os] = (stats.byOS[click.os] || 0) + 1;
      }

      // City
      if (click.city) {
        stats.byCity[click.city] = (stats.byCity[click.city] || 0) + 1;
      }

      // Browser
      if (click.browser) {
        stats.byBrowser[click.browser] =
          (stats.byBrowser[click.browser] || 0) + 1;
      }
    });

    const dailyClicksArray = Object.entries(dailyClicks)
      .map(([date, clicks]) => ({ date, clicks }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const fillMissingDays = (
      data: Array<{ date: string; clicks: number }>,
      days: number
    ) => {
      const result: Array<{ date: string; clicks: number }> = [];
      const today = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split("T")[0];

        const existing = data.find((d) => d.date === dateKey);
        result.push({
          date: dateKey,
          clicks: existing ? existing.clicks : 0,
        });
      }

      return result;
    };

    let daysToFill = 30;
    switch (timeRange) {
      case "30d":
        daysToFill = 30;
        break;
      case "90d":
        daysToFill = 90;
        break;
      case "6m":
        daysToFill = 180;
        break;
      case "1y":
        daysToFill = 365;
        break;
      case "all":
        daysToFill = 0;
        break;
    }

    const chartData =
      daysToFill > 0
        ? fillMissingDays(dailyClicksArray, daysToFill)
        : dailyClicksArray;

    const sortedStats = {
      totalClicks: stats.totalClicks,
      byCountry: Object.entries(stats.byCountry)
        .sort(([, a], [, b]) => b - a)
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {}),
      byDevice: Object.entries(stats.byDevice)
        .sort(([, a], [, b]) => b - a)
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {}),
      byOS: Object.entries(stats.byOS)
        .sort(([, a], [, b]) => b - a)
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {}),
      byCity: Object.entries(stats.byCity)
        .sort(([, a], [, b]) => b - a)
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {}),
      byBrowser: Object.entries(stats.byBrowser)
        .sort(([, a], [, b]) => b - a)
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {}),
    };

    return NextResponse.json(
      {
        data,
        clicks,
        stats: sortedStats,
        chartData,
        timeRange: timeRange || "all",
      },
      { status: 200 }
    );
  } catch (error: Response | any) {
    console.error("Error Getting short URL:", error);
    return NextResponse.json(
      { error: "Error Getting short URL", details: error.message },
      { status: 500 }
    );
  }
}
