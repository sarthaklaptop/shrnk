import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { BASEURL } from "@/constants/constant";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import chalk from "chalk";


export async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
    const shortLink = searchParams.get('id');

    if (!shortLink) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("Before DB Call");

    const data = await prisma.link.findUnique({
      where: { shortLink }
    });

    const mainData = data?.clickHistory;
    console.log(chalk.green(mainData));

    console.log("After DB Call");

    if(!data) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json(
      {mainData},
      {status: 200}
    )
      
    } catch (error: Response | any) {
      console.error("Error Getting short URL:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        { error: "Error Getting short URL", details: errorMessage },
        { status: 500 }
      );
    }
  }