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

  // zustand store 
  // const storeLinks = linkStore((state: any) => state.links);
  const [urlInput, setUrlInput] = useState(""); 
  const [response, setResponse] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      const result = await axios.post("/api/link", { longLink: urlInput });
      const newLink = { shortLink: result.data.data.shortLink, longLink: urlInput };
      console.log("Short URL created: ", result.data);

      // storeLinks([...storeLinks, newLink]);
      // linkStore.setState({ links: [...storeLinks, {shortLink: result.data.data.shortLink, longLink: urlInput} ]});
      // linkStore.setState((state: any) => ({
      //   links: [...state.links, newLink],
      // }));
      setIsDialogOpen(true);
      toast("Short URL created");
      console.log("Short URL created: ", result.data.data.shortLink);
      setResponse(result.data.data.shortLink)
    } catch (error) {
      console.error("Error details: ", error);
      toast("Error creating short URL");
    }
  };

  const copyClipBoard = ({response}: {response: string}) => {
    navigator.clipboard.writeText(`${BASEURL}/${response}`);
    toast("Copied to clipboard");
  }
  return (
    <div className=" m-2 flex flex-col w-2/4 justify-center  items-center px-4">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2 border-2 justify-center mx-auto p-1 bg-slate-200 rounded-lg ">
            <a href={`api/${response}`} className="font-bold" target="_blank" rel="noopener noreferrer">
              {BASEURL}{response}
            </a>
            <span className="border-2 p-1 rounded-full bg-zinc-100 cursor-pointer" onClick={() => copyClipBoard({response})}>
              <MdContentCopy/>
            </span>
          </div> 
          <DialogTitle className="flex flex-col items-center justify-center">
            <p className="text-lg text-red-500">This link will be deleted in 24h.</p>
            <p className="text-red-400 text-sm">To keep links and avail many other features, create an account.</p>
          </DialogTitle>
          <DialogDescription>

            <ul className="flex items-center justify-center flex-col">
              <li> <span className="font-bold">Analytics: </span> All time, daily and unique views</li>
              <li> <span className="font-bold">Bar Charts: </span> Last 7 days views charted</li>
              <li> <span className="font-bold">Editable: </span> Edit titles, URLs and destinations easily</li>
              <li> <span className="font-bold">Filters: </span> Filter by create, views and more</li>
              <li> <span className="font-bold">Search: </span> Search for URLs with syntax highlighting</li>
              <li> <span className="font-bold">Theme: </span> Light (default) and dark mode</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
              className="bg-black text-white w-full p-1 rounded-md text-sm"
              onClick={() => signIn("google")}
          >
              Create Account! It's 100% free!
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>


      {/* <ScrollArea className="h-96 w-full m-2">
        <div className="flex flex-col gap-2">
        {
          storeLinks.map(({shortLink, longLink}: {shortLink: string, longLink: string}, index: number) => (
            <div key={index} className="relative">
              <div className=" flex flex-col  border-2 rounded-lg p-4 w-full gap-2">
                <div className=" flex justify-between">
                  <div className="flex items-center gap-2">
                    <a href={`api/${shortLink}`} className="font-bold" target="_blank" rel="noopener noreferrer">
                      {BASEURL}{shortLink}
                    </a>
                    <span className="border-2 p-1 rounded-full bg-zinc-100 cursor-pointer" onClick={() => copyClipBoard({shortLink})}>
                      <MdContentCopy/>
                    </span>
                  </div> 
                  <div>
                    <HoverCardDemo/>
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
          ))      
        }
        </div>
      </ScrollArea> */}
    </div>
  );
}
