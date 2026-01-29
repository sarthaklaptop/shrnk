import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: { shortLink: string } },
) {
  const { shortLink } = params;

  try {
    const linkRecord = await prisma.link.findUnique({
      where: { shortLink },
      select: {
        id: true,
        longLink: true,
        expiresAt: true,
        userId: true,
        password: true,
      },
    });

    if (!linkRecord) {
      return NextResponse.redirect(new URL("/link-not-found", request.url));
    }

    if (new Date() > new Date(linkRecord.expiresAt)) {
      if (!linkRecord.userId) {
        await prisma.link.delete({ where: { id: linkRecord.id } });
      }
      return NextResponse.json(
        { error: "This link has expired" },
        { status: 410 },
      );
    }

    if (linkRecord.password) {
      const verifiedCookie = request.cookies.get(`verified_${shortLink}`);
      if (!verifiedCookie || verifiedCookie.value !== "true") {
        return NextResponse.redirect(
          new URL(`/verify-password/${shortLink}`, request.url),
        );
      }
    }

    // Use waitUntil for reliable background click logging
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host") || "localhost:3000";

    waitUntil(
      fetch(`${protocol}://${host}/api/log-click`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Forward all relevant headers
          "x-forwarded-for": request.headers.get("x-forwarded-for") || "",
          "x-real-ip": request.headers.get("x-real-ip") || "",
          "x-vercel-ip-country":
            request.headers.get("x-vercel-ip-country") || "",
          "x-vercel-ip-city": request.headers.get("x-vercel-ip-city") || "",
        },
        body: JSON.stringify({
          linkId: linkRecord.id,
          userAgent: request.headers.get("user-agent"),
        }),
      }).catch(console.error),
    );

    return NextResponse.redirect(linkRecord.longLink);
  } catch (error: any) {
    console.error("Redirect error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
