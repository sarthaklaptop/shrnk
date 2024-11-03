import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }: { params: { shortLink: string } }) {
    try {
        const {shortLink} = params;

        const linkRecord = await prisma.link.findUnique({
            where: {shortLink}
        });

        console.log(linkRecord);
        if (linkRecord) {
            console.log("before db call");

            const now = Date.now();

            if(linkRecord.expiresAt && now > linkRecord.expiresAt.getTime()){
                return NextResponse.json({error: "Link has expired"}, {status: 404});
            } 

            const currentCount = linkRecord.count ?? 0;

            const currentClickHistory = (linkRecord.clickHistory as string[]) ?? [];

            const updatedClickHistory = [...currentClickHistory, new Date().toISOString()];

            await prisma.link.update({
                where: { shortLink },
                data: { 
                    count: currentCount + 1,
                    clickHistory: updatedClickHistory,
                } 
            });
            
            return NextResponse.redirect(linkRecord.longLink);
        }   
        else {
            return NextResponse.json({error: "Short URL not found"}, {status: 404});
        }
    } catch (error:any) {
        return NextResponse.json({error: "Internal Server Error", details: error.message }, {status: 500});
    }
}