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
        select: { image: true, email: true, credits: true, userType: true },
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

export async function PATCH(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const id = pathname.split('/')[3];

    if(!id) {
      return NextResponse.json({error: "User ID is required"}, {status: 400});
    }

    const session = await getServerSession(authOptions);

    if(!session || !session.user || !session.user.email) {
      return NextResponse.json({error: "Not authenticated"}, {status: 401});
    }

    console.log(chalk.bgHex("Before DB Call"));

    const { userType } = await request.json();

    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true, credits: true , userType: true},
    })

    if(!user) {
      return NextResponse.json({error: "User not found"}, {status: 404});
    }

    // Prepare to update the user
    const updatedUser: any = {};

    if(userType) {
      updatedUser.userType = userType;
      if(userType === "PREMIUM") {
        updatedUser.credits = user.credits + 1000; // Increased credits for premium users by 1000
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updatedUser,
    });

    console.log(chalk.bgHex("After DB Call / User Data Updated"));

    return NextResponse.json({user: updatedUser}, {status: 200});

  } catch (error) {
    console.log("Error Updating User:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Error Updating User", details: errorMessage },
      { status: 500 }
    );
  }
}