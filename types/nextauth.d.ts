// next-auth.d.ts
import NextAuth from "next-auth";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add id to user object
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User extends PrismaUser {
    // Add any other fields you might want from Prisma User model
    id: string;
  }
}
