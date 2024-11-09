import prisma from "@/utils/prisma";
import chalk from "chalk";
import { NextRequest, NextResponse } from "next/server";
import {UAParser} from "ua-parser-js";

export async function GET(request: NextRequest, { params }: { params: { shortLink: string } }) {
    
    console.log(chalk.red("inside get function"));
    const parser = new UAParser();
    try {
        const {shortLink} = params;

        const linkRecord = await prisma.link.findUnique({
            where: {shortLink}
        });

        if (linkRecord) {
            console.log(chalk.blue("before db call"));

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
            
            const res = parser.getDevice();
            const device = res.type || "desktop";

            try {
                const response = await fetch("https://ipapi.co/json");
                const { city, country_name: country } = await response.json();

                // Create a new Click record with device type, city, and country data
                await prisma.click.create({
                    data: {
                        deviceType: device,
                        city,
                        country,
                        link: { connect: { id: linkRecord.id } },
                    }
                });

                console.log(chalk.gray(city, country));
            } catch (fetchError) {
                console.error("Failed to fetch location data", fetchError);
            }

            return NextResponse.redirect(linkRecord.longLink);
        }   
        else {
            return NextResponse.json({error: "Short URL not found"}, {status: 404});
        }
    } catch (error:any) {
        return NextResponse.json({error: "Internal Server Error", details: error.message }, {status: 500});
    }
}