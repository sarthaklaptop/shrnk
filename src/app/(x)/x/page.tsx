'use client';

import { Download, Search, MoreHorizontal, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DialogCloseButton } from '@/components/Dialog';
import { BASEURL } from '@/constants/constant';
import { toast } from 'sonner';
import { mkConfig, generateCsv, download } from "export-to-csv";
import Links from '@/components/analytics/Links';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { userStorage } from '@/store/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';


interface UserLink {
  id: string;
  shortLink: string;
  longLink: string;
  count: number;
  [key: string]: any;
}

export default function Page() {
  const [userLinks, setUserLinks] = useState<UserLink[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);

  const { data: session, status } = useSession();
  const { user, setUser } = userStorage(); 

  const csvConfig = mkConfig({ useKeysAsHeaders: true });

  useProtectedRoute();

  const fetchUserLinks = async () => {
    try {
      const response = await axios.get<{ data: UserLink[] }>('/api/userLinks');
      return response.data.data || []; 
    } catch (error) {
      console.error('Error fetching user links:', error);
      toast('Failed to fetch links');
      return []; 
    }   
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearching(false);
      // When search is cleared, fetch normal links
      const fetchNormalLinks = async () => {
        try {
          const response = await axios.get<{ data: UserLink[] }>('/api/userLinks');
          setUserLinks(response.data.data || []);
        } catch (error) {
          console.error('Error fetching user links:', error);
          setUserLinks([]);
        }
      };
      
      if (status === 'authenticated') {
        fetchNormalLinks();
      }
      return;
    }

    const searchLinks = async () => {
      setSearching(true);
      try {
        const res = await axios.get('/api/link', {
          params: { search: debouncedQuery },
        });
        setUserLinks(res.data.data || []);
      } catch (error: any) {
        console.error('Search error:', error);
        toast.error(error.response?.data?.error || 'Search failed');
        setUserLinks([]);
      } finally {
        setSearching(false);
      }
    };

    searchLinks();
  }, [debouncedQuery, status]);

  useEffect(() => {
    if(status == 'authenticated' && session?.user?.id) {
      const fetchUserData = async () => {
        try {
          // console.log("Before response from /x")
          const response = await axios.get(`api/user/${session.user.id}`);
          // console.log('response data from /x', {response});
          
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
      } ;
      fetchUserData();
      
      // Initial fetch of links if not searching
      if (!searchQuery.trim() && !debouncedQuery.trim()) {
        const fetchInitialLinks = async () => {
          try {
            const response = await axios.get<{ data: UserLink[] }>('/api/userLinks');
            setUserLinks(response.data.data || []);
          } catch (error) {
            console.error('Error fetching initial links:', error);
          }
        };
        fetchInitialLinks();
      }
    }
  }, [status, session?.user?.id, setUser, debouncedQuery, searchQuery])

  const downloadCSV = async () => {
    setIsLoading(true);
    try {
      const links = await fetchUserLinks(); // Fetch data directly here
  
      if (links.length === 0) {
        toast('No data available for export');
        return;
      }
  
      const csvData = links.map((link: UserLink) => ({
        id: link.id.toString(),
        shortLink: BASEURL + link.shortLink.toString(),
        longLink: link.longLink.toString(),
        count: link.count.toString(),
      }));
  
      const csv = generateCsv(csvConfig)(csvData);
      download(csvConfig)(csv as any);
      toast('CSV file downloaded successfully');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Links</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage and track your shortened links
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <DialogCloseButton label="Create Link" />
          </div>
        </div>

        {/* Search and Actions Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by short link or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-10"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full border-t-transparent animate-spin"></div>
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="h-10"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full border-t-transparent animate-spin" />
                ) : (
                  <MoreHorizontal className="w-4 h-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => downloadCSV()}>
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Links Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <Links
          searchQuery={searchQuery}
          searchResults={userLinks}
          isSearching={searching}
        />
      </div>
    </div>
  );
}
