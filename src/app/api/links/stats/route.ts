import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { validateApiKey } from "@/utils/apiAuth";

/**
 * GET /api/links/stats
 *
 * Get click statistics for links filtered by batchId.
 * Requires API key authentication.
 *
 * Query Parameters:
 * - batchId (required): Filter by batch ID from metadata
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "batchId": "...",
 *     "totalLinks": 2,
 *     "totalClicks": 127,
 *     "uniqueClickedEmails": 45,
 *     "topLinks": [...],
 *     "links": [...]
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = await validateApiKey(request);
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get("batchId");

    if (!batchId) {
      return NextResponse.json(
        { success: false, error: "batchId query parameter is required" },
        { status: 400 }
      );
    }

    // Find all links with this batchId in metadata
    // Prisma Json filtering: metadata->batchId = batchId
    const links = await prisma.link.findMany({
      where: {
        metadata: {
          path: ["batchId"],
          equals: batchId,
        },
      },
      include: {
        clicks: {
          select: {
            id: true,
            createdAt: true,
            country: true,
            city: true,
            deviceType: true,
            browser: true,
            os: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (links.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          batchId,
          totalLinks: 0,
          totalClicks: 0,
          uniqueClickedEmails: 0,
          topLinks: [],
          links: [],
        },
      });
    }

    // Calculate statistics
    let totalClicks = 0;
    const linkStats = links.map((link) => {
      totalClicks += link.clicks.length;

      const firstClick = link.clicks[link.clicks.length - 1];
      const lastClick = link.clicks[0];

      return {
        id: link.id,
        originalUrl: link.longLink,
        shortCode: link.shortLink,
        clickCount: link.clicks.length,
        firstClickedAt: firstClick?.createdAt || null,
        lastClickedAt: lastClick?.createdAt || null,
      };
    });

    // Calculate unique emails clicked (links with at least one click)
    const uniqueClickedEmails = links.filter(
      (link) => link.clicks.length > 0
    ).length;

    // Get top links by clicks
    const topLinks = linkStats
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 10)
      .map((link) => ({
        url: link.originalUrl,
        clicks: link.clickCount,
      }));

    return NextResponse.json({
      success: true,
      data: {
        batchId,
        totalLinks: links.length,
        totalClicks,
        uniqueClickedEmails,
        topLinks,
        links: linkStats,
      },
    });
  } catch (error: any) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
