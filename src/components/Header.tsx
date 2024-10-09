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

export default function  Header() {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const {data: session, status} = useSession();

  useEffect(() => {
    if(status !== "loading") {
      setInitialLoading(false);
    }

  }, [status, session]);


  return (
    <div className='w-full fixed top-0 h-[60px] text-white p-3 flex justify-between items-center bg-black'>
        <Link href="/">
        <h2 className='font-bold text-xl text-white'>StableGen</h2>
        </Link>

        {/* <NavigationMenuDemo/> */}

        {initialLoading && status === "loading" ? <FiLoader className='animate-spin'/> : (
          !session ? (
            <div className='__menu'>
              <Button onClick={() => signIn("google")}>
                  Login
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
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