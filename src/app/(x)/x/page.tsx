'use client'
import { useSession } from 'next-auth/react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>; // You can add a loader here
  }

  return (
    <div className='bg-white w-full rounded-lg mt-2 border-[1px] border-gray-300 p-2'>
      <div className='w-4/5 flex  flex-col mx-auto'>
        <h1 className='font-bold text-2xl'>Links</h1>
        <div className='flex w-full items-center justify-end'>
          <button 
            className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
          >
            Create
          </button>
          <button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button>
                    <BsThreeDotsVertical className='cursor-pointer' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 cursor-pointer">
                  <DropdownMenuLabel>
                    Export as CSV
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
          </button>
        </div>
      </div>
    </div>
  );
}
