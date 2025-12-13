"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiLoader } from "react-icons/fi";
import { Button } from "./ui/button";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenu, DropdownMenuContent } from "./ui/dropdown-menu";
import { userStorage } from "@/store/link";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();
  const setUser = userStorage((state: any) => state.setUser);

  const [active, setActive] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (status !== "loading") {
      setInitialLoading(false);
    }
  }, [status, session]);

  useEffect(() => {
    if (session && !initialLoading) {
      // Store user data in Zustand
      setUser(session.user?.image || null, session.user?.email || null);
    }
  }, [session, initialLoading, setUser]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const MobileLink = ({
    href,
    children,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 p-3 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200"
    >
      {children}
    </Link>
  );

  return (
    <>
      <div
        className={cn(
          "w-11/12 fixed z-50 p-3 py-6 flex justify-between items-center transition-all duration-300 ease-in-out left-1/2 -translate-x-1/2",
          isScrolled
            ? "top-4 rounded-xl bg-white/60 backdrop-blur-md border border-neutral-200/50 shadow-sm py-3"
            : "top-0 bg-transparent text-white"
        )}
      >
        <Link href="/">
          <h2 className="font-bold text-xl md:text-2xl text-red-500">Shrnk</h2>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center gap-x-4 p-2 px-10 w-fit rounded-full shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]">
          <div className=" flex items-center justify-center">
            {/* <a href="id="features-section"></a> */}
            <div className="relative text-black hover:text-red-400 font-semibold cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-red-400 before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-red-400 after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]">
              <Link href="#features-section">Features</Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <a href="/pricing">
              <div className="relative text-black hover:text-red-400 font-semibold cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-red-400 before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-red-400 after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]">
                <span>Pricing</span>
              </div>
            </a>
          </div>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-black"
            onClick={() => setOpen(true)}
          >
            <IconMenu2 className="h-6 w-6 text-neutral-800 dark:text-neutral-200" />
          </Button>
        </div>

        {/* Desktop auth area */}
        <div className="hidden md:block">
          {status === "loading" ? (
            <Button disabled>
              <FiLoader className="mr-2 animate-spin" />
              Verifying...
            </Button>
          ) : !session ? (
            <div className="__menu">
              <Button onClick={() => signIn("google", { callbackUrl: "/x" })}>
                Login
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 cursor-pointer">
                <DropdownMenuLabel className="p-2 rounded-lg hover:bg-red-300 hover:text-red-700 transition-all duration-200">
                  <a href="/x">My Account</a>
                </DropdownMenuLabel>
                <DropdownMenuItem className="border-none outline-none focus:outline-none">
                  <DropdownMenuLabel
                    className="p-2 rounded-lg hover:bg-red-300 hover:text-red-700 transition-all duration-200 border-none"
                    onClick={() => signOut()}
                  >
                    <span>Log out</span>
                  </DropdownMenuLabel>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="fixed inset-0 z-[100] h-full w-full bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <Link
                  href="/"
                  className="font-bold text-xl md:text-2xl text-red-500"
                  onClick={() => setOpen(false)}
                >
                  Shrnk
                </Link>
                <div
                  className="text-neutral-800 dark:text-neutral-200 cursor-pointer p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <IconX className="h-6 w-6" />
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2">
                <MobileLink href="#features-section" onClick={() => setOpen(false)}>
                  <span className="font-medium text-base">Features</span>
                </MobileLink>
                <MobileLink href="/pricing" onClick={() => setOpen(false)}>
                  <span className="font-medium text-base">Pricing</span>
                </MobileLink>
              </nav>

              {/* Auth Section at bottom or after nav */}
              <div className="mt-8 border-t border-neutral-200 dark:border-neutral-700 pt-6 flex flex-col gap-4">
                {status === "loading" ? (
                  <Button disabled className="w-full justify-center relative overflow-hidden bg-red-500/10 text-red-500">
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] border-t border-white/10" />
                    <FiLoader className="mr-2 animate-spin" />
                    Verifying...
                  </Button>
                ) : !session ? (
                  <Button
                    className="w-full justify-center text-base font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-all active:scale-[0.98]"
                    size="lg"
                    onClick={() => {
                      signIn("google", { callbackUrl: "/x" });
                      setOpen(false);
                    }}
                  >
                    Login to start
                  </Button>
                ) : (
                  <Link href="/x" onClick={() => setOpen(false)} className="w-full">
                    <Button 
                      className="w-full justify-center text-base font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-all active:scale-[0.98]"
                      size="lg"
                    >
                      My Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            {/* Optional filler for bottom spacing */}
            <div className="h-10" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
