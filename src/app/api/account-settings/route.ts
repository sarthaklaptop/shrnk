import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
    try {
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
                name: true,
                email: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ data: user });
    } catch (error: any) {
        console.error("Error fetching user account settings:", error);
        return NextResponse.json(
            { error: "Error fetching user account settings", details: error.message },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const { name } = await request.json();

        if (!name || name.trim() === "") {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                name: name.trim(),
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });

        return NextResponse.json({ data: updatedUser, message: "Name updated successfully" });
    } catch (error: any) {
        console.error("Error updating user name:", error);
        return NextResponse.json(
            { error: "Error updating user name", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Delete user (cascades to accounts, sessions, and links due to onDelete: Cascade)
        await prisma.user.delete({
            where: {
                id: user.id,
            }
        });

        return NextResponse.json({ message: "Account deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting user account:", error);
        return NextResponse.json(
            { error: "Error deleting user account", details: error.message },
            { status: 500 }
        );
    }
}
