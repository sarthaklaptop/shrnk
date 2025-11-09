import prisma from "@/utils/prisma";
import chalk from "chalk";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    console.log(chalk.bgCyan("=== LOG-CLICK ROUTE START ==="));
    
    const body = await request.json();
    console.log(chalk.yellow("Received body:", JSON.stringify(body)));
    
    const { linkId, userAgent, country, city } = body;

    const parser = new UAParser(userAgent || "");
    const deviceType = parser.getDevice().type || "desktop";
    const os = parser.getOS().name || "Unknown";
    const browser = parser.getBrowser().name || "Unknown";

    console.log(chalk.blue(`Parsed: device=${deviceType}, os=${os}, browser=${browser}`));

    // Save click
    console.log(chalk.yellow("Creating click record..."));
    const click = await prisma.click.create({
      data: {
        linkId,
        country: country || "Unknown",
        city: city || "Unknown",
        deviceType,
        os,
        browser,
      },
    });
    console.log(chalk.green("Click created:", click.id));

    // Increment counter
    console.log(chalk.yellow("Incrementing click count..."));
    await prisma.link.update({
      where: { id: linkId },
      data: { clickCount: { increment: 1 } },
    });
    console.log(chalk.green("Counter incremented"));

    console.log(chalk.bgGreen("=== LOG-CLICK SUCCESS ==="));
    return NextResponse.json({ success: true, clickId: click.id });
  } catch (error: any) {
    console.error(chalk.bgRed("=== LOG-CLICK ERROR ==="));
    console.error(chalk.red("Error details:"), error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}