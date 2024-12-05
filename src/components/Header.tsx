"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiLoader } from "react-icons/fi";
import { Button } from "./ui/button";
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
    <div className="w-11/12 fixed top-0 h-[60px] text-white p-3 flex justify-between items-center ">
      <Link href="/">
        <h2 className="font-bold text-2xl text-red-500">Shrnk</h2>
      </Link>

      <div className="flex items-center justify-center gap-x-4 p-2 w-1/3 rounded-full shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]">
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

      <div>
        {initialLoading && status === "loading" ? (
          <FiLoader className="animate-spin" />
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
              <DropdownMenuLabel>
                <a href="/x">My Account</a>
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => signOut()}>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
