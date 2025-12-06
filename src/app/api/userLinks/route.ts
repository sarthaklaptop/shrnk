import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { BASEURL } from "@/constants/constant";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user?.email,
            }
        })

        if(!user) {
            return NextResponse.json({error: "User not found"}, {status: 401});
        }

        const userLinks = await prisma.link.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json({ data: userLinks });
    } catch (error: Response | any) {
        console.error("Error creating short URL:", error);
        return NextResponse.json({ error: "Error creating short URL", details: error.message }, { status: 500 });
    }
}