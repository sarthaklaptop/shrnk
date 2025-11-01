import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { shortLink, password } = await request.json();

    if (!shortLink || !password) {
      return NextResponse.json(
        { error: "Short link and password are required" },
        { status: 400 }
      );
    }

    // Find the link
    const link = await prisma.link.findUnique({
      where: { shortLink },
      select: { id: true, password: true, expiresAt: true },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    // Check if link is expired
    const now = new Date();
    if (now > new Date(link.expiresAt)) {
      return NextResponse.json(
        { error: "This link has expired" },
        { status: 410 }
      );
    }

    // Check if link has password protection
    if (!link.password) {
      return NextResponse.json(
        { error: "This link is not password protected" },
        { status: 400 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, link.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Set cookie to remember verification (expires in 1 hour)
    const cookieStore = await cookies();
    cookieStore.set(`verified_${shortLink}`, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return NextResponse.json(
      { message: "Password verified successfully", verified: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Password verification error:", error);
    return NextResponse.json(
      { error: "Error verifying password", details: error.message },
      { status: 500 }
    );
  }
}

