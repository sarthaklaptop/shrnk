import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";

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
                count: 0,
            },
        });

        return NextResponse.json({ message: "Short URL created", data: redirectUrl });

    } catch (error: Response | any) {
        return NextResponse.json({ error: "Error creating short URL", details: error.message }, { status: 500 });
    }
}