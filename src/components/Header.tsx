'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FiLoader } from "react-icons/fi";
import { Button } from './ui/button'
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { DropdownMenu, DropdownMenuContent } from './ui/dropdown-menu'
import { NavigationMenuDemo } from './NavigationMenu'
import { userStorage } from '@/store/link'

export default function  Header() {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const {data: session, status} = useSession();
  const setUser = userStorage((state:any) => state.setUser);

  useEffect(() => {
    if(status !== "loading") {
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
    <div className='w-full fixed top-0 h-[60px] text-white p-3 flex justify-between items-center bg-black'>
        <Link href="/">
        <h2 className='font-bold text-xl text-white'>StableGen</h2>
        </Link>

        {/* <NavigationMenuDemo/> */}

        {initialLoading && status === "loading" ? <FiLoader className='animate-spin'/> : (
          !session ? (
            <div className='__menu'>
              <Button onClick={() => signIn("google", { callbackUrl: '/x' })}>
                  Login
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className='cursor-pointer'>
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 cursor-pointer">
                <DropdownMenuLabel><a href="/x">My Account</a></DropdownMenuLabel>
                <DropdownMenuItem onClick={() => signOut()}>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        )}
    </div>
  )
}