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
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import { DialogCloseButton } from "@/components/Dialog";

interface UserLink {
  id: string;
  shortLink: string;
  longLink: string;
  count: number;
  [key: string]: any;
}

export default function Links() {
  const [userLinks, setUserLinks] = useState<UserLink[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const status = useProtectedRoute();

  useEffect(() => {
    const fetchUserLinks = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/userLinks");
        setUserLinks(response.data.data);
      } catch (error) {
        console.error("Error fetching user links:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchUserLinks();
    }
  }, [status]);

  if (status == "loading" || isLoading) {
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

  if (!isLoading && status === "authenticated" && userLinks.length === 0) {
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
            <p className="text-lg font-semibold">No links yet</p>
            <p className="text-sm text-zinc-500">Create your first short link to get started.</p>
          </div>

          <DialogCloseButton label="Create your first short link" />
        </div>
      </div>
    );
  }

  const copyToClipboard = (shortLink: string) => {
    navigator.clipboard.writeText(`${BASEURL}/${shortLink}`);
    toast("Copied to clipboard");
  };

  const handleNavigation = (shortLink: string) => {
    router.push(`/x/analytics/${shortLink}`);
  };

  const deleteLink = async (id: string) => {
    setDeletingId(id);
    try {
      await axios.delete("/api/link", { data: { id } });
      toast("Link deleted successfully");
      setUserLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
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
          {userLinks.map(({ id, shortLink, longLink, count }: UserLink) => (
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
                    <span
                      className="border-2 p-1 rounded-full bg-zinc-100 hover:bg-zinc-200 cursor-pointer"
                      onClick={() => copyToClipboard(shortLink)}
                    >
                      <MdContentCopy />
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
                        {/* <DropdownMenuLabel
                          className="flex hover:bg-red-500 transition-all duration-200 cursor-pointer hover:text-white rounded-sm text-red-400 items-center justify-between"
                          onClick={() => deleteLink(id)}
                        >
                          Delete <FaDeleteLeft />
                        </DropdownMenuLabel> */}
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
