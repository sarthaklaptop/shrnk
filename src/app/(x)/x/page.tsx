'use client';
import { useSession } from 'next-auth/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DialogCloseButton } from '@/components/Dialog';
import axios from 'axios';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BASEURL } from '@/constants/constant';
import { MdContentCopy, MdOutlineSubdirectoryArrowRight } from 'react-icons/md';
import { HoverCardDemo } from '@/components/HoverCard';
import { toast } from 'sonner';
import { HiCursorClick } from 'react-icons/hi';
import { redirect } from 'next/navigation';
import { FaDeleteLeft } from 'react-icons/fa6';
import { QRCodeDialog } from '@/components/ui/QRCode';
import { useRouter } from 'next/navigation';

interface UserLink {
  id: string;
  shortLink: string;
  longLink: string;
  count: number;
}

export default function Page() {
  const { data: session, status } = useSession();
  const [userLinks, setUserLinks] = useState<UserLink[]>([]);
  const [QRUrl, setQRUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return; // Prevent redirect on loading
    }

    if (status === 'unauthenticated') {
      redirect('/'); // Redirect to homepage if unauthenticated
    }
  }, [status]);

  useEffect(() => {
    const fetchUserLinks = async () => {
      try {
        const response = await axios.get('/api/userLinks');
        setUserLinks(response.data.data);
      } catch (error) {
        console.error('Error fetching user links:', error);
      }
    };

    if (status === 'authenticated') {
      fetchUserLinks();
    }
  }, [status]);

  const copyToClipboard = (shortLink: string) => {
    navigator.clipboard.writeText(`${BASEURL}/${shortLink}`);
    toast('Copied to clipboard');
  };

  const handleNavigation = (shortLink: string) => {
    router.push(`/x/analytics/${shortLink}`);
  };

  const deleteLink = async (id: string) => {
    try {
      await axios.delete('/api/link', { data: { id } });
      toast('Link deleted successfully');
      setUserLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Error deleting link');
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>; // Add a loader if needed
  }

  return (
    <div className='bg-white w-full rounded-lg mt-2 border-[1px] border-gray-300 p-2'>
      <div className='w-4/5 flex flex-col mx-auto'>
        <h1 className='font-bold text-2xl'>Links</h1>
        <div className='flex w-full gap-2 items-center justify-end'>
          <DialogCloseButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='border-[1px] rounded-lg px-2 py-2 border-black flex items-center justify-center'>
                <BsThreeDotsVertical className='cursor-pointer' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              <DropdownMenuLabel>Export as CSV</DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ScrollArea className='h-96 w-full m-4'>
          <div className='flex flex-col gap-2'>
            {userLinks.map(({ id, shortLink, longLink, count }: UserLink) => (
              <div key={id} className='relative'>
                <div
                  className='flex flex-col border-red-50 border-2 rounded-lg cursor-pointer p-4 w-full gap-2'
                >
                  <div className='flex justify-between'>
                    <div className='flex items-center gap-2'>
                      <a
                        href={`api/${shortLink}`}
                        className='font-bold'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {BASEURL}/{shortLink}
                      </a>
                      <span
                        className='border-2 p-1 rounded-full bg-zinc-100 hover:bg-zinc-200 cursor-pointer'
                        onClick={() => copyToClipboard(shortLink)}
                      >
                        <MdContentCopy />
                      </span>
                    </div>
                    <div className='flex gap-1 z-10'>
                      <span 
                        className='justify-center border-2 rounded-sm hover:bg-zinc-200 bg-zinc-100 cursor-pointer'
                        onClick={() => handleNavigation(shortLink)}
                      >
                        <a className='flex items-center gap-1 px-1' >
                          <HiCursorClick /> {count} clicks
                        </a>
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className='border-[1px] rounded-lg p-1 border-black flex items-center justify-center'>
                            <BsThreeDotsVertical className='cursor-pointer' />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='w-fit'>
                          <DropdownMenuLabel className='flex cursor-pointer hover:bg-slate-200 rounded-sm items-center justify-between'>
                            <QRCodeDialog QRUrl={`${BASEURL}/${shortLink}`} />
                          </DropdownMenuLabel>
                          <DropdownMenuLabel
                            className='flex hover:bg-red-500 cursor-pointer hover:text-white rounded-sm text-red-400 items-center justify-between'
                            onClick={() => deleteLink(id)}
                          >
                            Delete <FaDeleteLeft />
                          </DropdownMenuLabel>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className='flex items-center text-zinc-500'>
                    <span>
                      <MdOutlineSubdirectoryArrowRight />
                    </span>
                    <a className='hover:underline' target='_blank' href={longLink}>
                      {longLink.length > 70 ? `${longLink.slice(0, 70)}...` : longLink}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
