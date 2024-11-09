import Image from 'next/image'
import React from 'react'
import { useSession } from "next-auth/react";

function page() {

  const {data: session, status} = useSession();

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

export default page