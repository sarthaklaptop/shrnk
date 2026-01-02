import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { validateApiKey } from "@/utils/apiAuth";
import { customAlphabet } from "nanoid";
import { BASEURL } from "@/constants/constant";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 6);

/**
 * POST /api/links/bulk
 *
 * Create multiple short links with metadata for FWD integration.
 * Requires API key authentication.
 *
 * Request:
 * {
 *   "links": [
 *     {
 *       "url": "https://example.com",
 *       "metadata": { "source": "fwd", "batchId": "...", "userId": "..." }
 *     }
 *   ]
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "links": [
 *       { "id": "...", "originalUrl": "...", "shortUrl": "...", "shortCode": "..." }
 *     ]
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = await validateApiKey(request);
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { links } = body;

    // Validate request
    if (!links || !Array.isArray(links)) {
      return NextResponse.json(
        { success: false, error: "links array is required" },
        { status: 400 }
      );
    }

    if (links.length === 0) {
      return NextResponse.json(
        { success: false, error: "links array cannot be empty" },
        { status: 400 }
      );
    }

    if (links.length > 100) {
      return NextResponse.json(
        { success: false, error: "Maximum 100 links per request" },
        { status: 400 }
      );
    }

    // Validate each link
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      if (!link.url || typeof link.url !== "string") {
        return NextResponse.json(
          { success: false, error: `links[${i}].url is required` },
          { status: 400 }
        );
      }
    }

    // Create links in a transaction
    const createdLinks = await prisma.$transaction(async (tx) => {
      const results = [];

      for (const linkData of links) {
        const shortCode = nanoid();

        const link = await tx.link.create({
          data: {
            longLink: linkData.url,
            shortLink: shortCode,
            fullShortLink: `https://${BASEURL}/${shortCode}`,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
            metadata: linkData.metadata || null,
            isActive: true,
          },
        });

        results.push({
          id: link.id,
          originalUrl: link.longLink,
          shortUrl: link.fullShortLink,
          shortCode: link.shortLink,
        });
      }

      return results;
    });

    return NextResponse.json({
      success: true,
      data: {
        links: createdLinks,
      },
    });
  } catch (error: any) {
    console.error("Bulk link creation error:", error);
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
