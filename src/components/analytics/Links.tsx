"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BASEURL } from "@/constants/constant";
import { MdContentCopy, MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { HiCursorClick } from "react-icons/hi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { QRCodeDialog } from "../ui/QRCode";
import { FaDeleteLeft } from "react-icons/fa6";
import { Lock } from "lucide-react";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import { DialogCloseButton } from "@/components/Dialog";
import { Check } from "lucide-react";

interface UserLink {
  id: string;
  shortLink: string;
  longLink: string;
  clickCount: number;
  password?: string | null;
  [key: string]: any;
}

interface LinksProps {
  searchQuery?: string;
  searchResults?: UserLink[];
  isSearching?: boolean;
}

export default function Links({ searchQuery = '', searchResults = [], isSearching = false}: LinksProps) {
  const [userLinks, setUserLinks] = useState<UserLink[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();

  const status = useProtectedRoute();

  useEffect(() => {
    // Don't fetch if we have a search query - parent handles search
    if (searchQuery.trim()) {
      return;
    }

    const fetchUserLinks = async () => {
      setIsLoading(true);
      try {
        // Use regular userLinks endpoint when no search query
        const response = await axios.get("/api/userLinks");
        setUserLinks(response.data.data);
      } catch (error) {
        console.error("Error fetching user links:", error);
        setUserLinks([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch normal links if not searching and authenticated
    if (status === "authenticated") {
      fetchUserLinks();
    }
  }, [status, searchQuery]);

  // Use searchResults when searching, otherwise use userLinks
  const displayLinks = searchQuery.trim() ? searchResults : userLinks;

  if (status == "loading" || (isLoading && !searchQuery.trim()) || (isSearching && searchQuery.trim())) {
    return (
      <div className="bg-white w-full rounded-lg mt-2 p-2">
        <div
          role="status"
          className="w-full p-4 space-y-4  divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
        >
          <div className="flex border-2 border-red-50 p-4 rounded-lg  items-center justify-between">
            <div>
              <div className="h-2.5 bg-gray-300  rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
          </div>
          <div className="flex border-2 border-red-50 p-4 rounded-lg  items-center justify-between">
            <div>
              <div className="h-2.5 bg-gray-300  rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
          </div>
          <div className="flex border-2 border-red-50 p-4 rounded-lg  items-center justify-between">
            <div>
              <div className="h-2.5 bg-gray-300  rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
          </div>
          <div className="flex border-2 border-red-50 p-4 rounded-lg  items-center justify-between">
            <div>
              <div className="h-2.5 bg-gray-300  rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
          </div>
          <div className="flex border-2 border-red-50 p-4 rounded-lg  items-center justify-between">
            <div>
              <div className="h-2.5 bg-gray-300  rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if ((!isLoading && !isSearching) && status === "authenticated" && displayLinks.length === 0) {
    return (
      <div className="w-full h-[calc(100vh-220px)] flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-4">
          {/* Illustration */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 140"
            className="w-40 h-28 text-zinc-300"
            aria-hidden
          >
            <rect x="15" y="20" width="170" height="100" rx="10" fill="#f3f4f6" />
            <rect x="30" y="40" width="90" height="10" rx="5" fill="#e5e7eb" />
            <rect x="30" y="60" width="140" height="10" rx="5" fill="#e5e7eb" />
            <rect x="30" y="80" width="120" height="10" rx="5" fill="#e5e7eb" />
            <circle cx="155" cy="50" r="8" fill="#e5e7eb" />
          </svg>

          <div className="space-y-1">
            <p className="text-lg font-semibold">
              {searchQuery.trim() ? 'No links found' : 'No links yet'}
            </p>
            <p className="text-sm text-zinc-500">
              {searchQuery.trim() 
                ? 'Try a different search term.' 
                : 'Create your first short link to get started.'}
            </p>
          </div>

          {!searchQuery.trim() && (
            <DialogCloseButton label="Create your first short link" />
          )}
        </div>
      </div>
    );
  }

  const copyToClipboard = (shortLink: string, id: string) => {
    navigator.clipboard.writeText(`${BASEURL}/${shortLink}`);
    toast("Copied to clipboard");

    setCopiedId(id);

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);

  };

  const handleNavigation = (shortLink: string) => {
    router.push(`/x/analytics/${shortLink}`);
  };

  const deleteLink = async (id: string) => {
    setDeletingId(id);
    try {
      await axios.delete("/api/link", { data: { id } });
      toast("Link deleted successfully");
      // Update both userLinks and searchResults state
      setUserLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
      // If searching, the parent component will need to refetch or update searchResults
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Error deleting link");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <ScrollArea className="h-[calc(100vh-220px)] w-full mx-4 my-8">
        <div className="flex flex-col gap-2">
          {displayLinks.map(({ id, shortLink, longLink, clickCount, password }: UserLink) => (
            <div key={id} className="relative">
              <div className="flex flex-col border-red-50 border-2 rounded-lg cursor-pointer p-4 w-full gap-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <a
                      href={`api/${shortLink}`}
                      className="font-bold"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {BASEURL}/{shortLink}
                    </a>
                    {password && (
                      <span
                        className="group relative border-2 border-yellow-300 p-1 rounded-full bg-yellow-100 hover:bg-yellow-200 cursor-help"
                        title="Password Protected"
                      >
                        <Lock className="w-3.5 h-3.5 text-yellow-700" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Password Protected
                        </span>
                      </span>
                    )}
                    <span
                      className={`p-2 rounded-full cursor-pointer transition-all duration-200 ${
                        copiedId === id 
                          ? 'bg-green-100 hover:bg-green-200 border-green-300' 
                          : 'bg-zinc-100 hover:bg-zinc-200'
                      }`}
                      onClick={() => copyToClipboard(shortLink, id)}
                    >
                      {copiedId === id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <MdContentCopy />
                      )}
                    </span>
                  </div>
                  <div className="flex gap-1 z-10">
                    <span
                      className="flex border-2 p-[0.5px] cursor-pointer hover:bg-slate-200 hover:font-bold transition-all duration-75 rounded-sm items-center justify-between"
                      onClick={() => handleNavigation(shortLink)}
                    >
                      <a className="flex items-center gap-1 px-1">
                        <HiCursorClick /> {clickCount} clicks
                      </a>
                    </span>
                    <span className="flex border-2 p-[0.5px] cursor-pointer hover:bg-slate-200  rounded-sm items-center justify-between">
                        <QRCodeDialog QRUrl={`${BASEURL}/${shortLink}`} />
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="border-[1px] rounded-lg p-1 border-black flex items-center justify-center">
                          <BsThreeDotsVertical className="cursor-pointer" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-fit">
                        <DropdownMenuLabel
                          className={`flex items-center justify-between rounded-sm transition-all duration-200 ${
                            deletingId === id
                              ? "bg-red-400 text-white cursor-not-allowed"
                              : "hover:bg-red-500 hover:text-white text-red-400 cursor-pointer"
                          }`}
                          onClick={() => !deletingId && deleteLink(id)}
                          style={{ pointerEvents: deletingId === id ? "none" : "auto" }}
                        >
                          {deletingId === id ? (
                            <>deleting...</>
                          ) : (
                            <>
                              Delete <FaDeleteLeft />
                            </>
                          )}
                        </DropdownMenuLabel>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex items-center text-zinc-500">
                  <span>
                    <MdOutlineSubdirectoryArrowRight />
                  </span>
                  <a
                    className="hover:underline"
                    target="_blank"
                    href={longLink}
                  >
                    {longLink.length > 70
                      ? `${longLink.slice(0, 70)}...`
                      : longLink}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
