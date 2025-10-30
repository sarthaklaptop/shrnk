'use client'

import Image from 'next/image'
import React from 'react'
import { BackgroundLines } from '@/components/ui/background-lines'
import { useSession } from 'next-auth/react'
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute'

export default function ProfilePage() {
  const { data: session } = useSession()
  const status = useProtectedRoute()

  /* ------------------- LOADING ------------------- */
  if (status === 'loading') {
    return (
      <BackgroundLines className="relative bg-white rounded-lg overflow-hidden mt-2 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="w-12 h-12 text-gray-300 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>

          <div className="space-y-2 text-center">
            <div className="h-3 bg-gray-300 rounded w-32 animate-pulse" />
            <div className="h-2 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
        </div>
      </BackgroundLines>
    )
  }

  /* ------------------- CONTENT ------------------- */
  return (
    <BackgroundLines className="relative bg-white  rounded-lg overflow-hidden mt-2 flex items-center justify-center p-4">
      {/* optional subtle overlay – keep the lines visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-5 text-center max-w-sm w-full">
        {/* Avatar */}
        <Image
          src={session?.user?.image ?? 'https://avatar.iran.liara.run/public/15'}
          width={80}
          height={80}
          alt="Avatar"
          className="rounded-full border-4 border-red-200 shadow-lg"
        />

        {/* Name + Email */}
        <div>
          <h1 className="font-mono font-bold text-2xl text-zinc-900">
            {session?.user?.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 underline decoration-red-300 underline-offset-4">
            {session?.user?.email}
          </p>
        </div>
      </div>
    </BackgroundLines>
  )
}