import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import chalk from "chalk";

export async function GET(request: NextRequest) {
  try {
    console.log(chalk.bgBlue("Inside GET /api/tags"));

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const tags = await prisma.tag.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, createdAt: true },
    });

    return NextResponse.json({ data: tags }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Error fetching tags", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log(chalk.bgBlue("Inside POST /api/tags"));

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, userType: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const { name } = await request.json();
    if (!name || typeof name !== "string" || name.trim().length < 1 || name.trim().length > 50) {
      return NextResponse.json({ error: "Invalid tag name (1-50 characters)" }, { status: 400 });
    }

    const trimmedName = name.trim().toLowerCase();

    // Check uniqueness per user
    const existingTag = await prisma.tag.findUnique({
      where: { userId_name: { userId: user.id, name: trimmedName } },
    });

    if (existingTag) {
      return NextResponse.json({ error: "Tag already exists" }, { status: 409 });
    }

    // Enforce limit for FREE users
    const tagCount = await prisma.tag.count({ where: { userId: user.id } });
    if (user.userType === "FREE" && tagCount >= 5) {
      return NextResponse.json(
        { error: "Free users can only create up to 5 tags. Upgrade to PREMIUM for unlimited." },
        { status: 403 }
      );
    }

    const tag = await prisma.tag.create({
      data: { name: trimmedName, userId: user.id },
      select: { id: true, name: true, createdAt: true },
    });

    console.log(chalk.bgGreen("Tag Created Successfully"));

    return NextResponse.json({ message: "Tag created", data: tag }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Error creating tag", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(chalk.bgBlue("Inside DELETE /api/tags"));

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    if (tag.userId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this tag" },
        { status: 403 }
      );
    }

    // Delete tag (automatically unlinks from all links via relation)
    await prisma.tag.delete({
      where: { id: params.id },
    });

    console.log(chalk.bgGreen("Tag Deleted Successfully"));

    return NextResponse.json({ message: "Tag deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Error deleting tag", details: error.message },
      { status: 500 }
    );
  }
}