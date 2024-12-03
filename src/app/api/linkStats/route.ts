import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";


export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if(!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Not Authenticated"}, { status:401 })
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user?.email,
            },
            include: {
                userLinks: true,
            },
        })

        if(!user) {
            return NextResponse.json({error: "User not found"}, {status: 401});
        }

        const { searchParams } = new URL(request.url);
        const shortLink = searchParams.get('shortLink');

        if (!shortLink) {
            return NextResponse.json({ error: "shortLink parameter is required" }, { status: 400 });
        }

        const link = user.userLinks.find(link => link.shortLink === shortLink);

        if (!link) {
            return NextResponse.json({ error: "Link not found" }, { status: 404 });
        }

        const clicks = await prisma.click.findMany({
            where: {
                linkId: link.id
            }
        });

        const stats = {
            link: link.shortLink,
            clickCount: clicks.length,
            clicks,
        };

        return NextResponse.json(stats);

    } catch (error: Response | any) {
        console.error("Error creating short URL:", error);
        return NextResponse.json({ error: "Error creating short URL", details: error.message }, { status: 500 });
    }
}