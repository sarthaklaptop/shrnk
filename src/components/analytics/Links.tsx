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
    <div className="w-full">
      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="col-span-4">Short URL</div>
              <div className="col-span-5">Original URL</div>
              <div className="col-span-1">Clicks</div>
              <div className="col-span-1">Created</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {displayLinks.map(({ id, shortLink, longLink, count, password }: UserLink) => (
              <div
                key={id}
                className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 px-4 py-3 items-center">
                  {/* Short URL Column */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={`${BASEURL}/${shortLink}`}
                        className="font-medium text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {BASEURL}/{shortLink}
                      </a>
                      {password && (
                        <span className="group/badge relative">
                          <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover/badge:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Password Protected
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Original URL Column */}
                  <div className="col-span-5">
                    <div className="flex items-center gap-1">
                      <a
                        href={longLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 truncate flex items-center gap-1"
                      >
                        <span className="truncate max-w-md">
                          {longLink.length > 60
                            ? `${longLink.slice(0, 60)}...`
                            : longLink}
                        </span>
                        <ArrowRight className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Clicks Column */}
                  <div className="col-span-1">
                    <button
                      onClick={() => handleNavigation(shortLink)}
                      className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <BarChart3 className="w-3 h-3" />
                      {count}
                    </button>
                  </div>

                  {/* Created Date Column */}
                  <div className="col-span-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions Column */}
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    {/* Copy Button */}
                    <button
                      onClick={() => copyToClipboard(shortLink, id)}
                      className={`p-1.5 rounded-md transition-all duration-200 ${
                        copiedId === id
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title="Copy link"
                    >
                      {copiedId === id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    {/* QR Code Button */}
                    <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-1.5 transition-colors cursor-pointer">
                      <QRCodeDialog QRUrl={`${BASEURL}/${shortLink}`} />
                    </div>

                    {/* More Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => deleteLink(id)}
                          className={`flex items-center gap-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 ${
                            deletingId === id ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          }`}
                          disabled={deletingId === id}
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingId === id ? 'Deleting...' : 'Delete'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
