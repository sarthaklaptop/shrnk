"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { DiHaskell } from "react-icons/di";
import { MdLogout } from "react-icons/md";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import { IoMdSettings } from "react-icons/io";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import TabsDemo from "@/app/(x)/x/page";
import { Button } from "./ui/button";
import ProfilePage from "@/app/(x)/profile/page";
import Page from "@/app/(x)/x/analytics/[shortLink]/page";
import { usePathname } from "next/navigation"; // Ensure you have this import
import { FaLink } from "react-icons/fa6";
import { userStorage } from "@/store/link";
import { useStore } from "zustand";

export function SidebarDemo() {

  const pathname = usePathname();
  // const { setUser } = userStorage.getState();
  const { credits } = useStore(userStorage, (state) => state.user);

  const links = [
    {
      label: "Links",
      href: "/x",
      icon: (
        <FaLink />
      ),
    },
    {
      label:    "Profile",
      href: "/profile",
      icon: (
        <PersonIcon />
      ),
    }
  ];
  const [open, setOpen] = useState(false);

  const {data: session, status} = useSession();
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-red-500 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-8 flex flex-col gap-2 ">
              {/* {links.map((link, idx) => (
                <SidebarLink className="hover:bg-gray-200 rounded-lg p-2" key={idx} link={link} />
              ))} */}
              {links.map((link, idx) => {
                const isActive = pathname === link.href; // Check if link is active
                return (
                  <SidebarLink
                    key={idx}
                    link={link}
                    className={cn(
                      "rounded-lg p-2 hover:bg-gray-200",
                      isActive && "bg-red-300 font-medium text-red-700" 
                    )}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="border-2 border-gray-400 w-fit p-1 rounded-full">
              <div className="flex gap-1 font-mono">Credits <p className="underline"><span className="font-bold">{credits}</span>/10</p></div>
            </div>
            <SidebarLink
              link={{
                label: ``,
                href: "#",
                icon: (
                  <Image
                    src={session?.user?.image || "https://avatar.iran.liara.run/public/15"}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
            <div className=" flex gap-2">
                <Button
                onClick={() => signOut()}
                className="flex-shrink-0 relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full px-4 cursor-pointer items-center justify-center rounded-full bg-slate-100 p-2 text-sm font-medium text-black backdrop-blur-3xl">
                    Logout
                </span>
                </Button>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-red-400 dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-red-500 whitespace-pre"
      >
        Shrnk
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href=""
      className="font-normal flex space-x-2 items-center text-sm text-red-500 py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-red-400 dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

const Dashboard = () => {
  const pathname = usePathname();

  if (pathname === '/profile') {
    return <ProfilePage />;
  }

  if(pathname.startsWith('/x/analytics')) {
    return < Page/>;
  }

  return (
    <div className="flex flex-1 gap-0">
      <TabsDemo/>
    </div>
  );
};