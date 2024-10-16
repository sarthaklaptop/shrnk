'use client'
import { useSession } from 'next-auth/react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog } from '@radix-ui/react-dialog';
import { DialogCloseButton } from '@/components/Dialog';
import axios from 'axios';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BASEURL } from '@/constants/constant';
import { MdContentCopy, MdOutlineSubdirectoryArrowRight } from 'react-icons/md';
import { HoverCardDemo } from '@/components/HoverCard';
import { toast } from 'sonner';
import { HiCursorClick } from "react-icons/hi";
import { redirect } from 'next/navigation';
import { FaDeleteLeft } from "react-icons/fa6";
import { QRCodeDialog } from '@/components/ui/QRCode';


export default function Page() {

  const { data: session, status } = useSession();
  const [userLinks, setUserLinks] = useState([]);
  const [QRUrl, setQRUrl] = useState("");

  useEffect(() => {
    if (status === "loading") {
      return; // Prevent loading state from triggering redirect
    }
    
    if (status === "unauthenticated") {
      redirect('/'); // Change '/login' to your login page route
    }
  }, [status]);

  useEffect(() => {
    const fetchUserLinks = async () => {
      try {
        const response = await axios.get('/api/userLinks');
        console.log("User Links:", response.data.data); 
        setUserLinks(response.data.data);
      } catch (error) {
        console.error("Error details: ", error);
        console.error("Error fetching user links:", error);
      }
    };
  
    // Call the fetch function only if the session is available
    if (status === "authenticated") {
      fetchUserLinks();
    }
  }, [status]);

  const copyClipBoard = ({shortLink}: {shortLink: string}) => {
    navigator.clipboard.writeText(`${BASEURL}/${shortLink}`);
    toast("Copied to clipboard");
  }

  const deleteLink = ({id}: {id: string}) => {
    console.log("Inside deleteLink function");
    axios.delete(`/api/link`, {data: {id}})
    .then(response => {
      console.log(response.data);
      toast("Link deleted successfully");
      setQRUrl("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${BASEURL}/${shortLink}");
      setUserLinks(prevLinks => prevLinks.filter(link => link.id !== id));
    })
    .catch(error => {
      console.error("Error deleting link:", error);
      toast.error("Error deleting link");
    });
  }

  if (status === "loading") {
    return <p>Loading...</p>; // You can add a loader here
  }

  return (
    <div className='bg-white w-full rounded-lg mt-2 border-[1px] border-gray-300 p-2'>
      <div className='w-4/5 flex  flex-col mx-auto'>
        <h1 className='font-bold text-2xl'>Links</h1>
        <div className='flex w-full gap-2 items-center justify-end'>
          <DialogCloseButton/>

            <DropdownMenu>
              <DropdownMenuTrigger asChild className='border-[1px] rounded-lg px-2 py-2 border-black flex items-center justify-center'>
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
        </div>
        
        <ScrollArea className="h-96 w-full m-4">
        

          <div className="flex flex-col gap-2">
            {
              userLinks.map(({shortLink, longLink, count}: {shortLink: string, longLink: string, count: number}, index: number) => (
                <div key={index} className="relative">
                  <div className=" flex flex-col  border-2 rounded-lg p-4 w-full gap-2">
                    <div className=" flex justify-between">
                      <div className="flex items-center gap-2">
                        <a href={`api/${shortLink}`} className="font-bold" target="_blank" rel="noopener noreferrer">
                          {BASEURL}{shortLink}
                        </a>
                        <span className="border-2 p-1 rounded-full bg-zinc-100 hover:bg-zinc-200 cursor-pointer" onClick={() => copyClipBoard({shortLink})}>
                          <MdContentCopy/>
                        </span>
                      </div> 
                      <div className='flex gap-1'>
                        <span className='  justify-center border-2 rounded-sm hover:bg-zinc-200 bg-zinc-100 cursor-pointer'>
                          <a className='flex items-center gap-1 px-1' href={`api/${shortLink}`}>
                            <HiCursorClick /> {count} clicks
                          </a>
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild className='border-[1px] rounded-lg p-1 border-black flex items-center justify-center'>
                            <button>
                              <BsThreeDotsVertical className='cursor-pointer' />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-fit cursor-pointer">
                            <DropdownMenuLabel 
                            className=' flex hover:bg-slate-200 rounded-sm items-center justify-between'
                            // onClick={() => {
                            //   const link = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${BASEURL}/${shortLink}`;
                            //   window.open(link, '_blank');
                            // }}
                            >
                              <QRCodeDialog QRUrl={`${BASEURL}/${shortLink}`}/>
                            </DropdownMenuLabel>
                            <DropdownMenuLabel
                            className=' flex hover:bg-red-500 hover:text-white rounded-sm text-red-400 items-center justify-between'
                            onClick={() => deleteLink({id: userLinks[index].id})}
                            >
                              Delete <FaDeleteLeft/>
                            </DropdownMenuLabel>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex items-center text-zinc-500">
                      <span>
                        <MdOutlineSubdirectoryArrowRight/>
                      </span>
                      <a className="hover:underline" target="_blank" href={longLink}>
                        {longLink.length > 70 ? longLink.slice(0, 70) + '...' : longLink}
                      </a>
                    </div>
                    <div className="">
                    </div>
                  </div>
                </div>
              ))                  }
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}

