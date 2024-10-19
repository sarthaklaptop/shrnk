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
  
      const session = await getServerSession(authOptions);
  
      console.log(chalk.bgBlue("Inside GET link route"));
  
      if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
      console.log(chalk.bgRed("Inside GET link route"));

      const { searchParams } = new URL(request.url);
      const shortLink = searchParams.get('id');
      console.log(chalk.bgCyan(`Inside GET link route ${shortLink}`));

      if (!shortLink) {
        return NextResponse.json({ error: "No shortLink provided" }, { status: 400 });
      }
  
      const link = await prisma.link.findUnique({
        where: { shortLink }
      });

      console.log(chalk.bgGray("Inside GET link route"));;

  
      console.log(chalk.bgRed("userId from db:", link));
  
      console.log(link);
      
    } catch (error: Response | any) {
      console.error("Error Getting short URL:", error);
      return NextResponse.json(
        { error: "Error Getting short URL", details: error.message },
        { status: 500 }
      );
    }
  }