import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import { sendWebhook, LinkClickedPayload } from "@/utils/webhook";

export const runtime = "nodejs";

async function getGeolocation(
  request: NextRequest
): Promise<{ country: string; city: string }> {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";

    // Skip truly local IPs
    if (
      !clientIp ||
      clientIp === "127.0.0.1" ||
      clientIp === "::1" ||
      clientIp.startsWith("192.168.") ||
      clientIp.startsWith("10.")
    ) {
      // Get public IP for localhost testing
      const publicIpResponse = await fetch(
        "https://api.ipify.org?format=json",
        { signal: AbortSignal.timeout(3000) }
      );
      const { ip: publicIp } = await publicIpResponse.json();

      const geoResponse = await fetch(
        `http://ip-api.com/json/${publicIp}?fields=status,countryCode,city`,
        { signal: AbortSignal.timeout(3000) }
      );

      const geoData = await geoResponse.json();

      if (geoData.status === "success") {
        return {
          country: geoData.countryCode || "Unknown",
          city: geoData.city || "Unknown",
        };
      }
    } else {
      // Use client IP for geolocation (non-local)
      const geoResponse = await fetch(
        `http://ip-api.com/json/${clientIp}?fields=status,countryCode,city`,
        { signal: AbortSignal.timeout(3000) }
      );

      const geoData = await geoResponse.json();

      if (geoData.status === "success") {
        return {
          country: geoData.countryCode || "Unknown",
          city: geoData.city || "Unknown",
        };
      }
    }
  } catch (error) {
    // Silently fail, return Unknown
  }

  return { country: "Unknown", city: "Unknown" };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { linkId, userAgent } = body;

    // Validate linkId
    if (!linkId || typeof linkId !== "string") {
      return NextResponse.json(
        { error: "linkId is required" },
        { status: 400 }
      );
    }

    // Get geolocation
    const { country, city } = await getGeolocation(request);

    const parser = new UAParser(userAgent || "");
    const deviceType = parser.getDevice().type || "desktop";
    const os = parser.getOS().name || "Unknown";
    const browser = parser.getBrowser().name || "Unknown";

    // Use transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      const click = await tx.click.create({
        data: {
          linkId,
          country,
          city,
          deviceType,
          os,
          browser,
        },
      });

      await tx.link.update({
        where: { id: linkId },
        data: { clickCount: { increment: 1 } },
      });

      return { click, linkId };
    });

    // Fetch link to check for FWD metadata and send webhook
    const link = await prisma.link.findUnique({
      where: { id: result.linkId },
      select: {
        id: true,
        shortLink: true,
        longLink: true,
        metadata: true,
      },
    });

    // Send webhook if link has FWD metadata
    if (link?.metadata && typeof link.metadata === "object") {
      const metadata = link.metadata as {
        source?: string;
        batchId?: string;
        userId?: string;
        emailId?: string;
      };

      if (metadata.source === "fwd") {
        // Find API key with webhook URL
        const apiKey = await prisma.apiKey.findFirst({
          where: {
            isActive: true,
            webhookUrl: { not: null },
          },
        });

        if (apiKey?.webhookUrl && apiKey?.webhookSecret) {
          const webhookPayload: LinkClickedPayload = {
            event: "link.clicked",
            data: {
              linkId: link.id,
              shortCode: link.shortLink,
              originalUrl: link.longLink,
              metadata: { ...metadata, source: metadata.source! },
              click: {
                timestamp: result.click.createdAt.toISOString(),
                userAgent: browser,
                country,
                city,
                deviceType,
                browser,
                os,
              },
            },
          };

          // Fire-and-forget webhook
          sendWebhook(
            apiKey.webhookUrl,
            apiKey.webhookSecret,
            webhookPayload
          ).catch(() => {}); // Silently ignore webhook errors
        }
      }
    }

    return NextResponse.json({ success: true, clickId: result.click.id });
  } catch (error: any) {
    console.error("Log-click error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
