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
    console.log(chalk.bgBlue("Inside POST route"));
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
        select: {
          id: true,
          credits: true,
          image: true,
          userType: true,
          name: true,
          email: true,
          emailVerified: true,
        }
      });

      console.log(chalk.bgCyan('User: ', JSON.stringify(user)));
      userId = user ? user.id : null;

      const credits = user?.credits;

      console.log(chalk.bgGray("Retrieved credits:- ", credits));

      if (credits === undefined || credits === null) {
        return NextResponse.json(
          { error: "Credits field not found for user" },
          { status: 500 }
        );
      }

      if(credits == 0) {
        return NextResponse.json(
          { error: 'Insufficient credits to create a short URL' },
          { status: 403 }
        );
      }

      if(userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { credits: { decrement: 1 } },
        });
      }
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
          // userId: userId,
          user: { connect: { id: userId } }, 
          clickHistory: [],
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
          clickHistory: [],
        },
      });
    }
    console.log(chalk.bgGreen("Url Created Successfully"));

    return NextResponse.json({
      message: "Short URL created",
      data: redirectUrl,
    });
  } catch (error: Response | any) {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shortLink = searchParams.get('id');
    const searchQuery = searchParams.get('search');

    // Handle search query
    if (searchQuery) {
      const session = await getServerSession(authOptions);

      if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }

      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        select: {
          id: true,
        }
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
      }

      // let searchTerm = searchQuery.trim();
      let searchTerm = decodeURIComponent(searchQuery).trim();

      searchTerm = searchTerm.replace(/^https?:\/\//, '');
      console.log("After removing protocol:", searchTerm);

      // If searchQuery contains a URL, extract the last part (short code)
      if (searchTerm.includes('shrnk-six.vercel.app') || 
          searchTerm.includes('localhost:3000')) {
        // Extract everything after the last slash
        const parts = searchTerm.split('/');
        searchTerm = parts[parts.length - 1];
        console.log("Extracted short code:", searchTerm);
      }

      // Search by shortLink or longLink
      const searchResults = await prisma.link.findMany({
        where: {
          userId: user.id,
          OR: [
            {
              shortLink: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              longLink: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
          ],
        },
      });

      return NextResponse.json({ data: searchResults }, { status: 200 });
    }

    // Handle existing ID-based query
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