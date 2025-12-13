"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BASEURL } from "@/constants/constant";
import { MdContentCopy, MdOutlineSubdirectoryArrowRight, MdQrCodeScanner } from "react-icons/md";
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
import { useQueryClient } from "@tanstack/react-query";
import { EditLinkDialog } from "./EditLinkDialog"; // Adjust path as needed
import { Badge } from "@/components/ui/badge"; // NEW: For tag display
import { Tag, X } from "lucide-react"; // NEW: Icons for tags

export interface UserLink {
  id: string;
  shortLink: string;
  longLink: string;
  clickCount: number;
  password?: string | null;
  tags?: {
    id: string;
    name: string;
    createdAt: Date;
  }[];
  [key: string]: any;
}

interface LinksProps {
  searchQuery?: string;
  searchResults?: UserLink[];
  isSearching?: boolean;
}

export default function Links({ searchQuery = '', searchResults = [], isSearching = false}: LinksProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<UserLink | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const status = useProtectedRoute();

  // Use searchResults directly - they come from React Query when not searching, or from search when searching
  const displayLinks = searchResults || [];

  if (status == "loading" || isSearching) {
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

  if (status === "authenticated" && displayLinks.length === 0) {
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

  const copyToClipboard = (shortLink: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${BASEURL}/${shortLink}`);
    toast("Copied to clipboard");

    setCopiedId(id);

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleNavigation = (shortLink: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/x/analytics/${shortLink}`);
  };

  const handleEdit = (link: UserLink, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedLink(link);
    setEditOpen(true);
  };

  const deleteLink = async (id: string) => {
    setDeletingId(id);
    try {
      await axios.delete("/api/link", { data: { id } });
      toast("Link deleted successfully");
      
      // Update React Query cache by removing the deleted link
      queryClient.setQueryData<UserLink[]>(["links"], (old) => {
        if (!old) return [];
        return old.filter((link) => link.id !== id);
      });
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Error deleting link");
    } finally {
      setDeletingId(null);
    }
  };

  const handleQRClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDropdownTrigger = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div>
      <ScrollArea className="h-[calc(100vh-220px)] w-full pr-4">
        <div className="flex flex-col gap-4 pb-4">
          {displayLinks.map(({ id, shortLink, longLink, clickCount, password, tags = [] }: UserLink) => {
            const linkData = { id, shortLink, longLink, clickCount, password, tags };
            return (
              <div 
                key={id} 
                className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 md:p-5 hover:shadow-md transition-all duration-200"
                onClick={() => handleEdit(linkData)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left Side: Link Info */}
                  <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-nowrap w-full">
                      <a
                        href={`/${shortLink}`}
                        className="font-bold text-lg md:text-xl text-neutral-900 dark:text-neutral-100 hover:text-red-600 transition-colors truncate min-w-0 shrink"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {BASEURL}/{shortLink}
                      </a>
                      
                      {password && (
                         <div className="flex items-center justify-center h-6 w-6 rounded-full bg-yellow-100 text-yellow-600 shrink-0" title="Password Protected">
                            <Lock className="w-3.5 h-3.5" />
                         </div>
                      )}
                      
                      {/* Copy Button (Mobile optimized placement next to link) */}
                      <button
                        className={`p-1.5 rounded-md transition-all duration-200 shrink-0 ${
                          copiedId === id 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                        }`}
                        onClick={(e) => copyToClipboard(shortLink, id, e)}
                        title="Copy Link"
                      >
                        {copiedId === id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <MdContentCopy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center text-neutral-500 text-sm gap-2 min-w-0">
                      <MdOutlineSubdirectoryArrowRight className="shrink-0" />
                      <a
                        className="hover:underline truncate"
                        target="_blank"
                        href={longLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {longLink}
                      </a>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Side: Actions & Stats */}
                  <div className="flex items-center gap-2 md:gap-3 border-t md:border-t-0 border-neutral-100 pt-3 md:pt-0 mt-2 md:mt-0 justify-end md:justify-start">
                    
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all text-sm font-medium text-neutral-700 bg-white"
                      onClick={(e) => handleNavigation(shortLink, e)}
                    >
                      <HiCursorClick className="text-neutral-500" />
                      <span>{clickCount}</span>
                    </button>

                    <div 
                      className="flex items-center justify-center px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all cursor-pointer bg-white text-neutral-600 gap-1.5 text-sm font-medium h-9"
                      onClick={handleQRClick}
                      title="Show QR Code"
                    >
                      <QRCodeDialog QRUrl={`${BASEURL}/${shortLink}`}>
                         <span className="flex items-center gap-1.5">
                            <MdQrCodeScanner className="text-neutral-500 w-4 h-4" />
                            <span className="md:hidden">QR</span>
                            <span className="hidden md:inline">QR Code</span>
                         </span>
                      </QRCodeDialog>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button 
                          className="flex items-center justify-center h-9 w-9 rounded-lg border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all bg-white text-neutral-600"
                          onClick={handleDropdownTrigger}
                        >
                          <BsThreeDotsVertical />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                         <DropdownMenuLabel
                            className={`flex items-center gap-2 px-2 py-2 cursor-pointer rounded-sm text-sm ${
                              deletingId === id
                                ? "text-neutral-400 cursor-not-allowed"
                                : "text-red-600 hover:bg-red-50"
                            }`}
                            onClick={() => !deletingId && deleteLink(id)}
                          >
                           {deletingId === id ? (
                              <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"/> Deleting...</span>
                            ) : (
                              <>
                                <FaDeleteLeft /> Delete
                              </>
                            )}
                          </DropdownMenuLabel>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      {selectedLink && (
        <EditLinkDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          link={selectedLink}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["links"] })}
        />
      )}
    </div>
  );
}