import prisma from "@/utils/prisma";
import chalk from "chalk";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

export const runtime = "nodejs";

async function getGeolocation(request: NextRequest): Promise<{ country: string; city: string }> {
  console.log(chalk.yellow("Using IP-API for geolocation (bypassing Vercel headers for accuracy)..."));
  
  try {
    const clientIp = 
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
      request.headers.get('x-real-ip') ||
      '';

    console.log(chalk.blue(`Client IP: ${clientIp || 'not found'}`));

    // Skip truly local IPs
    if (!clientIp || clientIp === '127.0.0.1' || clientIp === '::1' || clientIp.startsWith('192.168.') || clientIp.startsWith('10.')) {
      console.log(chalk.yellow("Local development IP detected, fetching from external IP..."));
      
      // Get public IP for localhost testing
      const publicIpResponse = await fetch('https://api.ipify.org?format=json', {
        signal: AbortSignal.timeout(3000),
      });
      const { ip: publicIp } = await publicIpResponse.json();
      console.log(chalk.blue(`Public IP: ${publicIp}`));
      
      // Use public IP for geolocation
      const geoResponse = await fetch(`http://ip-api.com/json/${publicIp}?fields=status,countryCode,city`, {
        signal: AbortSignal.timeout(3000),
      });
      
      const geoData = await geoResponse.json();
      
      if (geoData.status === 'success') {
        const country = geoData.countryCode || "Unknown";
        const city = geoData.city || "Unknown";
        console.log(chalk.green(`Geo from IP-API (public): ${country}, ${city}`));
        return { country, city };
      }
    } else {
      // Use client IP for geolocation (non-local)
      const geoResponse = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,countryCode,city`, {
        signal: AbortSignal.timeout(3000),
      });
      
      const geoData = await geoResponse.json();
      
      if (geoData.status === 'success') {
        const country = geoData.countryCode || "Unknown";
        const city = geoData.city || "Unknown";
        console.log(chalk.green(`Geo from IP-API: ${country}, ${city}`));
        return { country, city };
      }
    }
  } catch (error) {
    console.log(chalk.red("Geo lookup failed:", error instanceof Error ? error.message : 'Unknown error'));
  }

  console.log(chalk.yellow("Fallback to Unknown"));
  return { country: "Unknown", city: "Unknown" };
}

export async function POST(request: NextRequest) {
  try {
    console.log(chalk.bgCyan("=== LOG-CLICK ROUTE START ==="));
    
    const body = await request.json();
    console.log(chalk.yellow("Received body:", JSON.stringify(body)));
    
    const { linkId, userAgent } = body;

    // ✅ Validate linkId first
    if (!linkId || typeof linkId !== 'string') {
      console.error(chalk.red("Invalid or missing linkId"));
      return NextResponse.json({ error: "linkId is required" }, { status: 400 });
    }

    // Get geolocation (auto-detects environment)
    const { country, city } = await getGeolocation(request);

    const parser = new UAParser(userAgent || "");
    const deviceType = parser.getDevice().type || "desktop";
    const os = parser.getOS().name || "Unknown";
    const browser = parser.getBrowser().name || "Unknown";

    console.log(chalk.blue(`Parsed: device=${deviceType}, os=${os}, browser=${browser}, country=${country}, city=${city}`));

    // ✅ Use transaction to ensure both operations succeed or both fail
    const result = await prisma.$transaction(async (tx) => {
      // Save click
      console.log(chalk.yellow("Creating click record..."));
      const click = await tx.click.create({
        data: {
          linkId, // ✅ TypeScript knows linkId is string now
          country,
          city,
          deviceType,
          os,
          browser,
        },
      });
      console.log(chalk.green("Click created:", click.id));

      // Increment counter
      console.log(chalk.yellow("Incrementing click count..."));
      await tx.link.update({
        where: { id: linkId },
        data: { clickCount: { increment: 1 } },
      });
      console.log(chalk.green("Counter incremented"));

      return click;
    });

    console.log(chalk.bgGreen("=== LOG-CLICK SUCCESS ==="));
    return NextResponse.json({ success: true, clickId: result.id });

  } catch (error: any) {
    console.error(chalk.bgRed("=== LOG-CLICK ERROR ==="));
    console.error(chalk.red("Error details:"), error);
    
    return NextResponse.json({ 
      error: error.message,
    }, { status: 500 });
  }
}