import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { BASEURL } from "@/constants/constant";

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 6);

export async function POST(request: NextRequest) {
    try {
        const { longLink } = await request.json();
        
        if (!longLink) {
            return NextResponse.json({ error: "No URL provided" }, { status: 400 });
        }
        
        const shortLink = nanoid();
        
        const redirectUrl = await prisma.link.create({
            data: {
                longLink,
                shortLink,
                fullShortLink: `${BASEURL}/${shortLink}`,
                count: 0,
                clickLimit: 0,
                expiresAt: new Date(Date.now() + 30 * 60 * 1000),
            },
        });
        console.log("Bedfore try/catch block")

        return NextResponse.json({ message: "Short URL created", data: redirectUrl });

    } catch (error: Response | any) {
        return NextResponse.json({ error: "Error creating short URL", details: error.message }, { status: 500 });
    }
}