'use client'

import Image from 'next/image'
import React from 'react'
import { useSession } from "next-auth/react";
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';

function ProfilePage() {

  const {data: session } = useSession();

  const status = useProtectedRoute();

  if(status == "loading") {
    return (
      <div className='bg-white w-full rounded-lg mt-2 border-[1px] border-gray-300 p-2 flex items-center justify-center flex-col gap-4'>
        <div className="flex flex-col gap-4 items-center mt-4">
          <svg className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
            </svg>
            <div>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  return (
    <div className='bg-white w-full rounded-lg mt-2 border-[1px] border-gray-300 p-2 flex items-center justify-center flex-col gap-4'>
      <div>
        <Image
            src={session?.user?.image || "https://avatar.iran.liara.run/public/15"}
            className="h-15 w-15 flex-shrink-0 rounded-full"
            width={70}
            height={70}
            alt="Avatar"
          />
      </div>
      <div className=' flex flex-col gap-1'>
        <div className='mx-auto font-mono font-bold text-xl'>
          {session?.user?.name}
        </div>
        <div className='mx-auto font-sans underline'>
          {session?.user?.email}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage;