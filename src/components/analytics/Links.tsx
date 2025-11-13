"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BASEURL } from "@/constants/constant";
import { Copy, ArrowRight, BarChart3, MoreHorizontal, Trash2, Lock, Link2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QRCodeDialog } from "../ui/QRCode";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import { DialogCloseButton } from "@/components/Dialog";
import { Check } from "lucide-react";

interface UserLink {
  id: string;
  shortLink: string;
  longLink: string;
  count: number;
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
      <div className="w-full">
        <div className="min-w-full">
          {/* Table Header Skeleton */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="col-span-4">Short URL</div>
              <div className="col-span-5">Original URL</div>
              <div className="col-span-1">Clicks</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1"></div>
            </div>
          </div>

          {/* Table Row Skeletons */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-4 py-3 items-center animate-pulse">
                <div className="col-span-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
                <div className="col-span-5">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                </div>
                <div className="col-span-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                </div>
                <div className="col-span-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>
                <div className="col-span-1">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if ((!isLoading && !isSearching) && status === "authenticated" && displayLinks.length === 0) {
    return (
      <div className="w-full h-[calc(100vh-220px)] flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-6 max-w-md">
          {/* Modern Empty State Illustration */}
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Link2 className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {searchQuery.trim() ? 'No links found' : 'No links yet'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
              {searchQuery.trim()
                ? 'Try adjusting your search terms or filters.'
                : 'Create your first short link to start tracking clicks and analytics.'}
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
          {displayLinks.map(({ id, shortLink, longLink, count, password }: UserLink) => (
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
                        <HiCursorClick /> {count} clicks
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
