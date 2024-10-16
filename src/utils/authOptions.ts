import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import prisma from "./prisma"
// import prisma from "./prisma"

export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    adapter: PrismaAdapter(prisma),
    callbacks: {
      async session({ session, user }: { session: any; user: any }) {
        // Add the user ID to the session object
        session.user.id = user.id;
        return session;
      },  
      async redirect() {
        return '/x'; 
      },  
    },
    secret: process.env.NEXTAUTH_SECRET,
}