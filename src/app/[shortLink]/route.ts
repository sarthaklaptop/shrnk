// import prisma from "@/utils/prisma";
// import { NextRequest, NextResponse } from "next/server";

// export const runtime = "edge";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { shortLink: string } }
// ) {
//   const { shortLink } = params;

//   try {
//     console.log("=== REDIRECT ROUTE START ===");
//     console.log(`Short link: ${shortLink}`);

//     const linkRecord = await prisma.link.findUnique({
//       where: { shortLink },
//       select: {
//         id: true,
//         longLink: true,
//         expiresAt: true,
//         userId: true,
//         password: true,
//       },
//     });

//     if (!linkRecord) {
//       console.log("Link not found");
//       return NextResponse.redirect(new URL('/link-not-found', request.url));
//     }

//     console.log(`Found link: ${linkRecord.id}`);
//     if (new Date() > new Date(linkRecord.expiresAt)) {
//       console.log("Link expired");
//       if (!linkRecord.userId) {
//         prisma.link.delete({ where: { id: linkRecord.id } }).catch(console.error);
//       }
//       return NextResponse.json(
//         { error: "This link has expired" },
//         { status: 410 }
//       );
//     }

//     if (linkRecord.password) {
//       const verifiedCookie = request.cookies.get(`verified_${shortLink}`);
//       if (!verifiedCookie || verifiedCookie.value !== "true") {
//         console.log("Password verification required");
//         return NextResponse.redirect(new URL(`/verify-password/${shortLink}`, request.url));
//       }
//     }

//     // Construct full URL for log-click
//     const protocol = request.headers.get('x-forwarded-proto') || 'http';
//     const host = request.headers.get('host') || 'localhost:3000';
//     const logClickUrl = `${protocol}://${host}/api/log-click`;
    
//     console.log(`Calling log-click API: ${logClickUrl}`);
    
//     // Fire-and-forget click logging
//     fetch(logClickUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         linkId: linkRecord.id,
//         userAgent: request.headers.get("user-agent"),
//         country: request.headers.get("x-vercel-ip-country"),
//         city: request.headers.get("x-vercel-ip-city"),
//       }),
//     })
//     .then(res => {
//       console.log(`log-click response status: ${res.status}`);
//       return res.json();
//     })
//     .then(data => {
//       console.log("log-click response:", JSON.stringify(data));
//     })
//     .catch((error) => {
//       console.error("Failed to call log-click:", error);
//     });

//     console.log(`Redirecting to: ${linkRecord.longLink}`);
//     return NextResponse.redirect(linkRecord.longLink);
    
//   } catch (error: any) {
//     console.error("Redirect error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }


// src/app/[shortLink]/route.ts
import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

// export const runtime = "edge"; // ← This makes it fast

export async function GET(
  request: NextRequest,
  { params }: { params: { shortLink: string } }
) {
  const { shortLink } = params;

  console.log("SHORT LINK HIT:", shortLink); // ← YOU WILL SEE THIS

  try {
    const link = await prisma.link.findUnique({
      where: { shortLink },
      select: { id: true, longLink: true, password: true, expiresAt: true, userId: true },
    });

    if (!link) {
      console.log("Not found → redirect to /link-not-found");
      return NextResponse.redirect(new URL("/link-not-found", request.url));
    }

    // Expired?
    if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
      if (!link.userId) await prisma.link.delete({ where: { id: link.id } }).catch(() => {});
      return NextResponse.json({ error: "Link expired" }, { status: 410 });
    }

    // Password?
    if (link.password) {
      const cookie = request.cookies.get(`verified_${shortLink}`);
      if (!cookie || cookie.value !== "true") {
        return NextResponse.redirect(new URL(`/verify-password/${shortLink}`, request.url));
      }
    }

    // Log click (fire and forget)
    fetch(`${request.headers.get("origin") || "http://localhost:3000"}/api/log-click`, {
      method: "POST",
      body: JSON.stringify({ linkId: link.id }),
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});

    console.log("REDIRECTING TO:", link.longLink);
    return NextResponse.redirect(link.longLink);
  } catch (error) {
    console.error("Redirect error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}