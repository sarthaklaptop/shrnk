'use client';

import { BsThreeDotsVertical } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DialogCloseButton } from '@/components/Dialog';
import { BASEURL } from '@/constants/constant';
import { toast } from 'sonner';
import { mkConfig, generateCsv, download } from "export-to-csv";
import { PiFileCsvDuotone } from "react-icons/pi";
import { IoSearchOutline } from 'react-icons/io5';
import Links from '@/components/analytics/Links';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { userStorage } from '@/store/link';
import { Input } from '@/components/ui/input';
import { useLinks } from '@/hooks/useLinks';
import { useQueryClient } from '@tanstack/react-query';

interface UserLink {
  id: string;
  shortLink: string;
  longLink: string;
  clickCount: number;
  [key: string]: any;
}

export default function Page() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<UserLink[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: session, status } = useSession();
  const { user, setUser } = userStorage();
  const queryClient = useQueryClient();

  const csvConfig = mkConfig({ useKeysAsHeaders: true });

  useProtectedRoute();

  // Use React Query to fetch links
  const { data: links = [], isLoading: linksLoading, isError: linksError } = useLinks();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearching(false);
      setSearchResults([]);
      return;
    }

    const searchLinks = async () => {
      setSearching(true);
      try {
        const res = await axios.get('/api/link', {
          params: { search: debouncedQuery },
        });
        setSearchResults(res.data.data || []);
      } catch (error: any) {
        console.error('Search error:', error);
        toast.error(error.response?.data?.error || 'Search failed');
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    };

    if (status === 'authenticated') {
      searchLinks();
    }
  }, [debouncedQuery, status]);

  useEffect(() => {
    if(status == 'authenticated' && session?.user?.id) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`api/user/${session.user.id}`);
          console.log('response data from /x', {response});
          
          const { image, email, credits, userType } = response.data.user;
          
          setUser({
            image,
            email,
            id: session.user.id,
            credits,
            userType
          })
          console.log(userStorage.getState().user.userType); 
          console.log("User State:", userStorage.getState().user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, [status, session?.user?.id, setUser]);

  const downloadCSV = async () => {
    setIsLoading(true);
    try {
      // Get links from React Query cache or fetch fresh
      const cachedLinks = queryClient.getQueryData<UserLink[]>(['links']);
      const linksToExport = cachedLinks || links;

      if (linksToExport.length === 0) {
        toast('No data available for export');
        return;
      }

      console.log(`links to be downloaded as csv: ${JSON.stringify(linksToExport)}`);

      const csvData = linksToExport.map((link: UserLink) => ({
        id: link.id.toString(),
        shortLink: BASEURL + '/' + link.shortLink.toString(),
        longLink: link.longLink.toString(),
        count: (link.clickCount || 0).toString(),
      }));

      const csv = generateCsv(csvConfig)(csvData);
      download(csvConfig)(csv as any);
      toast('CSV file downloaded successfully');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Determine which links to display: search results or regular links
  const displayLinks = searchQuery.trim() ? searchResults : links;
  const isDisplayLoading = searchQuery.trim() ? searching : linksLoading;

  return (
    <div className='bg-white w-full rounded-lg mt-2 border-[1px] border-gray-300 p-2 py-4'>
      <div className='w-11/12 m-2 p-2 flex flex-col mx-auto'>
        <h1 className='font-bold text-2xl'>Links</h1>
        <div className='flex w-full gap-2 items-center justify-end'>
          <div className='relative flex-1 max-w-md'>
            <IoSearchOutline className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <Input
              type='text'
              placeholder='Search by short link OR URL'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 pr-4'
            />
            {searching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full border-t-transparent animate-spin"></div>
              </div>
            )}
          </div>
          <DialogCloseButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className='border-[1px] rounded-lg px-2 py-2 border-black flex items-center justify-center'
                disabled={isLoading}
              >
              {isLoading ? (
                  <span className="loader w-4 h-4 border-2 border-gray-300 rounded-full border-t-transparent animate-spin"></span>
                ) : (
                  <BsThreeDotsVertical className='cursor-pointer' />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 cursor-pointer '>
              <DropdownMenuLabel onClick={() => downloadCSV()}>
              <a href="#_" className="relative inline-flex items-center justify-center p-1 px-2 py-2 overflow-hidden font-medium text-red-600 transition duration-300 ease-out border-2 border-red-500 rounded-full shadow-md group">
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-red-500 group-hover:translate-x-0 ease">
                      <PiFileCsvDuotone className='w-5 h-5'/>
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-red-500 transition-all duration-300 transform group-hover:translate-x-full ease">Download CSV</span>
                  <span className="re1lative invisible">Download CSV</span>
              </a>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Links 
          searchQuery={searchQuery} 
          searchResults={displayLinks}
          isSearching={isDisplayLoading}
        />

      </div>
    </div>
  );
}
