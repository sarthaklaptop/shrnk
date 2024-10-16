import { Chalk } from "./../../../../node_modules/chalk/source/index.d";
import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { BASEURL } from "@/constants/constant";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 6);

export async function POST(request: NextRequest) {
  try {
    // console.log(chalk.bgBlue("Inside POST route"));
    const session = await getServerSession(authOptions);
    const { longLink } = await request.json();

    
    if (!longLink) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }
    
    const shortLink = nanoid();
    let userId: string | null = null;
    
    if (session && session.user && session.user.email) {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });
      userId = user ? user.id : null;
    }
    let redirectUrl;
    
    // chalk.bgGreen(console.log(userId));
    
    if (userId) {
      console.log(chalk.bgBlue("No User",userId));
      redirectUrl = await prisma.link.create({
        data: {
          longLink,
          shortLink,
          fullShortLink: `${BASEURL}/${shortLink}`,
          count: 0,
          clickLimit: 0,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          userId: userId,
        },
      });
    } else {
      console.log(chalk.bgRed("No User", userId));
      redirectUrl = await prisma.link.create({
        data: {
          longLink,
          shortLink,
          fullShortLink: `${BASEURL}/${shortLink}`,
          count: 0,
          clickLimit: 0,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        },
      });
    }
    console.log(chalk.bgGreen("Url Created Successfully"));

    return NextResponse.json({
      message: "Short URL created",
      data: redirectUrl,
    });
  } catch (error: Response | any) {
    console.error("Error creating short URL:", error);
    return NextResponse.json(
      { error: "Error creating short URL", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log(chalk.bgBlue("Inside DELETE route"));

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const link = await prisma.link.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    console.log(chalk.bgRed("userId from db:", link.userId));
    console.log(chalk.bgRed(JSON.stringify(session)));

    if (link.userId !== session.user?.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this link" },
        { status: 403 }
      );
    }

    await prisma.link.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Link deleted successfully" });
  } catch (error: Response | any) {
    console.error("Error Deleteing short URL:", error);
    return NextResponse.json(
      { error: "Error Deleteing short URL", details: error.message },
      { status: 500 }
    );
  }
}