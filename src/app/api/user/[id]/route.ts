import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import chalk from "chalk";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {

    // console.log(chalk.bgGreen("Inside /api/user/[id]/route.ts"));

    // const { searchParams } = new URL(request.url);

    // const id = searchParams.get("userId");

    const { pathname } = request.nextUrl;
    const id = pathname.split('/')[3];

    console.log(chalk.green(id));
    // const { id } = req.query;

    if (!id) {
        return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log(chalk.bgHex("Before DB Call"));

    const user = await prisma.user.findUnique({
        where: { id },
        select: { image: true, email: true, credits: true },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
        {user},
        {status: 200},
    )
  } catch (error) {
    console.error("Error Getting User Data:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        { error: "Error Getting short URL", details: errorMessage },
        { status: 500 }
      );
  }
}
