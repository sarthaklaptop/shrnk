"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiLoader } from "react-icons/fi";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { FiMenu } from "react-icons/fi";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenu, DropdownMenuContent } from "./ui/dropdown-menu";
import { userStorage } from "@/store/link";

export default function Header() {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();
  const setUser = userStorage((state: any) => state.setUser);

  const [active, setActive] = useState<string | null>(null);

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

  return (
    <div className="w-11/12 fixed top-0 z-50 h-[60px] text-white p-3 flex justify-between items-center ">
      <Link href="/">
        <h2 className="font-bold text-2xl text-red-500">Shrnk</h2>
      </Link>

      <div className="hidden md:flex items-center justify-center gap-x-4 p-2 w-1/3 rounded-full shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]">
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

      {/* Mobile menu trigger on the right; auth moved inside drawer */}
      <div className="md:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-black">
              <FiMenu />
            </Button>
          </DialogTrigger>
          <DialogContent className="fixed left-0 top-0 h-full w-3/4 max-w-xs translate-x-0 translate-y-0 rounded-none p-0 border-0">
            <div className="h-full flex flex-col">
              <div className="bg-red-500 text-white px-4 py-4">
                <h3 className="text-base font-semibold">Menu</h3>
              </div>
              <nav className="flex-1 p-4 space-y-3">
                <a
                  href="#features-section"
                  className="block text-zinc-800 font-medium"
                >
                  Features
                </a>
                <a href="/pricing" className="block text-zinc-800 font-medium">
                  Pricing
                </a>
              </nav>
              <div className="p-4 border-t">
                {status === "loading" ? (
                  <Button disabled className="w-full">
                    <FiLoader className="mr-2 animate-spin" />
                    Verifying...
                  </Button>
                ) : !session ? (
                  <Button
                    className="w-full"
                    onClick={() => signIn("google", { callbackUrl: "/x" })}
                  >
                    Login
                  </Button>
                ) : (
                  <a
                    href="/x"
                    className="block w-full text-center font-medium text-red-600"
                  >
                    My Account
                  </a>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* Desktop auth area only */}
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
  );
}
