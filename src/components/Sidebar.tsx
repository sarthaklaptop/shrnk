"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { User, Settings, Link2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import TabsDemo from "@/app/(x)/x/page";
import { Button } from "./ui/button";
import ProfilePage from "@/app/(x)/profile/page";
import Page from "@/app/(x)/x/analytics/[shortLink]/page";
import { usePathname } from "next/navigation";
import { userStorage } from "@/store/link";
import { useStore } from "zustand";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import AccountSettingsPage from "@/app/(x)/account-settings/page";
import axios from "axios";

export function SidebarDemo() {
  const pathname = usePathname();
  const { credits } = useStore(userStorage, (state) => state.user);
  const { setUser } = userStorage();
  const [creditsLoading, setCreditsLoading] = useState(true);

  const links = [
    {
      label: "Links",
      href: "/x",
      icon: <Link2 className="w-4 h-4" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <User className="w-4 h-4" />,
    },
    {
      label: "Account Settings",
      href: "/account-settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];
  const [open, setOpen] = useState(false);

  const { data: session, status } = useSession();

  // Fetch user data including credits when authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setCreditsLoading(true);
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`api/user/${session.user.id}`);
          
          const { image, email, credits, userType } = response.data.user;
          
          setUser({
            image,
            email,
            id: session.user.id,
            credits,
            userType
          });
        } catch (error) {
          console.error('Error fetching user data in Sidebar:', error);
        } finally {
          setCreditsLoading(false);
        }
      };
      fetchUserData();
    }
  }, [status, session?.user?.id, setUser]);
  return (
    <div className={cn("h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700")}>
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-8 flex flex-col gap-1">
              {links.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <SidebarLink
                    key={idx}
                    link={link}
                    className={cn(
                      "rounded-md transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
                      isActive && "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
                    )}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3">
            <div className="hidden lg:block">
              <HoverCard>
                <HoverCardTrigger>
                  <div className="border border-gray-200 dark:border-gray-700 cursor-pointer w-fit p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Credits</span>
                      {creditsLoading ? (
                        <span className="inline-block w-8 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                      ) : (
                        <span className="font-semibold text-gray-900 dark:text-white">{credits}</span>
                      )}
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 cursor-pointer border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Upgrade to Pro</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get 25 additional monthly credits and unlock premium features
                      </p>
                      <div className="flex mx-auto items-center justify-center w-full pt-2">
                        <Link href="/pricing" className="w-full">
                          <Button className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                            Upgrade to Pro
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>

            <SidebarLink
              link={{
                label: "",
                href: "#",
                icon: (
                  <Image
                    src={
                      session?.user?.image ||
                      "https://avatar.iran.liara.run/public/15"
                    }
                    className="h-8 w-8 flex-shrink-0 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => signOut()}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Logout
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

  if (pathname === "/profile") {
    return <ProfilePage />;
  }

  if (pathname.startsWith("/x/analytics")) {
    return <Page />;
  }

  if (pathname === "/account-settings") {
    return <AccountSettingsPage />;
  }

  return (
    <div className="flex flex-1 gap-0">
      <TabsDemo />
    </div>
  );
};
