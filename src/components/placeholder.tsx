"use client";

import { useState } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { toast } from "sonner";
import axios from "axios";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { ScrollArea } from "@/components/ui/scroll-area"
import { MdContentCopy } from "react-icons/md";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import { userStorage } from "@/store/link";
import { BASEURL } from "@/constants/constant";
import { HoverCardDemo } from "./HoverCard";

import validUrl from "valid-url"
import { signIn } from "next-auth/react";

export function PlaceholdersAndVanishInputDemo() {
  const placeholders = [
    "Enter a long URL to shorten",
    "How to create a custom short link?",
    "What's the benefit of using a URL shortener?",
    "Track clicks on your shortened URLs",
    "How to share your shortened link on social media?",
  ];

  const [urlInput, setUrlInput] = useState(""); 
  const [response, setResponse] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);  
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!urlInput) {
      toast("Please enter a URL", {
        description: "URL is required to shorten the URL",
      })
      return;
    };

    if(!validUrl.isUri(urlInput)) {
      toast("Please enter a valid url")
      return;
    }

    try {
      setIsLoading(true);
      setIsDialogOpen(true);
      const result = await axios.post("/api/link", { longLink: urlInput });
      const newLink = { shortLink: result.data.data.shortLink, longLink: urlInput };
      console.log("Short URL created: ", result.data);
      toast("Short URL created");
      console.log("Short URL created: ", result.data.data.shortLink);
      setResponse(result.data.data.shortLink)
      setIsLoading(false);
    } catch (error) {
      console.error("Error details: ", error);
      toast("Error creating short URL");
      setIsLoading(false);
      // Keep dialog open to show error/skeleton state if needed, or close:
      // setIsDialogOpen(false);
    }
  };

  const copyClipBoard = ({response}: {response: string}) => {
    navigator.clipboard.writeText(`${BASEURL}/${response}`);
    toast("Copied to clipboard");
  }
  return (
    <div className=" m-2 flex flex-col w-full sm:w-3/4 md:w-2/3 lg:w-1/2 justify-center items-center px-4">
      <div className="z-10 bg-white w-full">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger></DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-0">
        {isLoading ? (
          <>
            <div className="bg-gradient-to-br from-red-600 to-red-500 text-white px-6 py-5">
              <h3 className="text-base font-semibold">Creating short link…</h3>
              <p className="text-xs text-red-50/90">Hold on while we set things up.</p>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-rose-50/60 px-3 py-3">
                <div className="h-4 w-40 bg-red-100 rounded animate-pulse" />
                <div className="ml-auto h-6 w-6 rounded-md border border-red-200 bg-white flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-44 bg-zinc-200 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="h-4 bg-zinc-100 rounded animate-pulse" />
                  <div className="h-4 bg-zinc-100 rounded animate-pulse" />
                  <div className="h-4 bg-zinc-100 rounded animate-pulse" />
                  <div className="h-4 bg-zinc-100 rounded animate-pulse" />
                </div>
              </div>
              <button disabled className="w-full rounded-lg bg-red-500/70 text-white py-2.5 text-sm font-medium">
                Preparing…
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gradient-to-br from-red-600 to-red-500 text-white px-6 py-5">
              <h3 className="text-base font-semibold">Short link created</h3>
              <p className="text-xs text-red-50/90">This temporary link will be deleted in 24 hours.</p>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-rose-50/60 px-3 py-2 text-sm">
                <a
                  href={`api/${response}`}
                  className="font-mono font-medium truncate text-zinc-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {BASEURL}{response}
                </a>
                <button
                  type="button"
                  className="ml-auto inline-flex items-center justify-center rounded-md border border-red-200 bg-white px-2 py-1 text-xs text-red-700 hover:bg-red-50 active:scale-[0.98] transition"
                  onClick={() => copyClipBoard({response})}
                  aria-label="Copy link"
                >
                  <MdContentCopy className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-red-600">Why create an account?</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-700">
                  <li><span className="font-medium">Analytics:</span> All-time, daily and unique views</li>
                  <li><span className="font-medium">Bar charts:</span> Last 7 days views charted</li>
                  <li><span className="font-medium">Editable:</span> Edit titles, URLs and destinations</li>
                  <li><span className="font-medium">Filters:</span> Filter by created, views and more</li>
                  <li><span className="font-medium">Search:</span> Find URLs with syntax highlighting</li>
                  <li><span className="font-medium">Theme:</span> Light and dark mode</li>
                </ul>
              </div>

              <button
                className="w-full rounded-lg bg-red-500 text-white py-2.5 text-sm font-medium hover:bg-red-700 active:scale-[0.99] transition"
                onClick={() => signIn("google")}
              >
                Create an account — it’s free
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
    </div>
  );
}
