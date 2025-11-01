import prisma from "@/utils/prisma";
import chalk from "chalk";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

export async function GET(
  request: NextRequest,
  { params }: { params: { shortLink: string } }
) {
  console.log(chalk.red("Inside GET redirect handler"));
  const { shortLink } = params;

  try {
    // 1. DB Check 
    const linkRecord = await prisma.link.findUnique({
      where: { shortLink },
      select: {
        id: true,
        longLink: true,
        expiresAt: true,
        userId: true,
      },
    });

    if (!linkRecord) {
      return NextResponse.json(
        { error: "Short URL not found" },
        { status: 404 }
      );
    }

    // 2. Check Expiry
    const now = new Date();
    if (now > new Date(linkRecord.expiresAt)) {
      if (!linkRecord.userId) {
        // Delete in bg, don't wait
        prisma.link.delete({ where: { id: linkRecord.id } }).catch(console.error);
      }
      return NextResponse.json(
        { error: "This link has expired" },
        { status: 410 }
      );
    }

    // 3. Process in Background
    // This runs AFTER the redirect is sent
    processClickAnalytics(linkRecord.id, shortLink, request).catch((error) => {
      console.error(chalk.red("Analytics processing failed:"), error);
    });

    // 4. Redirect Immediately
    return NextResponse.redirect(linkRecord.longLink);
    
  } catch (error: any) {
    console.error(chalk.red("Redirect error:"), error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// === Bg  Processing ===
async function processClickAnalytics(
  linkId: string,
  shortLink: string,
  request: NextRequest
) {
  const startTime = Date.now();
  
  try {
    // Parse device info
    const parser = new UAParser(request.headers.get("user-agent") || "");
    const deviceResult = parser.getDevice();
    const deviceType = deviceResult.type || "desktop";
    
    let city = "Unknown";
    let country = "Unknown";

    // Fetch GeoIP data
    try {
      const geoResponse = await fetch("https://ipapi.co/json/", {
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(3000),
      });
      
      if (geoResponse.ok) {
        const geo = await geoResponse.json();
        city = geo.city || "Unknown";
        country = geo.country_name || "Unknown";
      }
    } catch (geoError) {
      console.warn(chalk.yellow("GeoIP fetch failed (background):"), geoError);
    }

    // Update database
    await prisma.$transaction(async (tx) => {
      // Get current data
      const link = await tx.link.findUnique({
        where: { id: linkId },
        select: { count: true, clickHistory: true },
      });

      if (!link) return;

      const currentCount = link.count ?? 0;
      const currentClickHistory = Array.isArray(link.clickHistory) 
        ? link.clickHistory 
        : [];
      
      const updatedClickHistory = [
        ...currentClickHistory, 
        new Date().toISOString()
      ];

      // Update link
      await tx.link.update({
        where: { id: linkId },
        data: {
          count: currentCount + 1,
          clickHistory: updatedClickHistory,
        },
      });

      // Create click record
      await tx.click.create({
        data: {
          deviceType,
          city,
          country,
          linkId,
        },
      });
    });
    
  } catch (error: any) {
    console.error(chalk.red("Background analytics error:"), error.message);
  }
}