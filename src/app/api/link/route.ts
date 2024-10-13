import { Chalk } from './../../../../node_modules/chalk/source/index.d';
import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { BASEURL } from "@/constants/constant";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import chalk from 'chalk';
// import { PrismaClient } from "@prisma/client";

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
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
        let userId = null;
        
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
        
        if(userId) {
            redirectUrl = await prisma.link.create({
                data: {
                    longLink,
                    shortLink,
                    fullShortLink: `${BASEURL}/${shortLink}`,
                    count: 0,
                    clickLimit: 0,
                    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                    userId,                
                },
            });

        }
        else {
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
        // console.log("Bedfore try/catch block")

        return NextResponse.json({ message: "Short URL created", data: redirectUrl });

    } catch (error: Response | any) {
        console.error("Error creating short URL:", error);
        return NextResponse.json({ error: "Error creating short URL", details: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        
    } catch (error : Response | any) {
        console.error("Error Deleteing short URL:", error);
        return NextResponse.json({ error: "Error Deleteing short URL", details: error.message }, { status: 500 });
    }
}