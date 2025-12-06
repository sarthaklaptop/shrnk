import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Provider from "./provider";
import { Providers } from "./providers";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner"
import GridPattern from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ShortLink - URL Shortener with Tracking",
  description: "Create shortened URLs and track their performance with our easy-to-use link management tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Providers>
          <Provider>
            <main>
              <Toaster />
              {children}
            </main>
          </Provider>
        </Providers>
      </body>
    </html>
  );
}
