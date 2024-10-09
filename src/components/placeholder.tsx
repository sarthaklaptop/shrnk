"use client";

import { useState } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { toast } from "sonner";
import axios from "axios";
import { NextResponse } from "next/server";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { ScrollArea } from "@/components/ui/scroll-area"
import { MdContentCopy } from "react-icons/md";


import { linkStore } from "@/store/link";
import { BASEURL } from "@/constants/constant";
import { HoverCardDemo } from "./HoverCard";

export function PlaceholdersAndVanishInputDemo() {
  const placeholders = [
    "Enter a long URL to shorten",
    "How to create a custom short link?",
    "What's the benefit of using a URL shortener?",
    "Track clicks on your shortened URLs",
    "How to share your shortened link on social media?",
  ];

  // zustand store 
  const storeLinks = linkStore((state: any) => state.links);
  const [urlInput, setUrlInput] = useState(""); 
  const [response, setResponse] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
    console.log(urlInput);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!urlInput) {
      toast("Please enter a URL", {
        description: "URL is required to shorten the URL",
      })
      return;
    };

    const currentLinks = JSON.parse(localStorage.getItem("link-storage") || "[]");
    // const arrayLen = currentLinks.state.links.length;
    const arrayLen = currentLinks.length > 0 ? currentLinks.length : storeLinks.length;
    console.log("array length ",arrayLen);
    if( arrayLen >= 10) {
      toast("You have reached the maximum number of links", {
        description: "You can only have 10 links at a time",
      })
      return;
    } 

    try {
      const result = await axios.post("/api/link", { longLink: urlInput });
      const newLink = { shortLink: result.data.data.shortLink, longLink: urlInput };
      console.log("Short URL created: ", result.data);

      // storeLinks([...storeLinks, newLink]);
      // linkStore.setState({ links: [...storeLinks, {shortLink: result.data.data.shortLink, longLink: urlInput} ]});
      linkStore.setState((state: any) => ({
        links: [...state.links, newLink],
      }));

      toast("Short URL created");
      console.log("Short URL created: ", result.data.data.shortLink);
    } catch (error) {
      console.error("Error details: ", error);
      toast("Error creating short URL");
    }
  };

  const copyClipBoard = ({shortLink}: {shortLink: string}) => {
    navigator.clipboard.writeText(`${BASEURL}/${shortLink}`);
    toast("Copied to clipboard");
  }
  return (
    <div className=" m-2 flex flex-col w-2/4 justify-center  items-center px-4">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />

      <ScrollArea className="h-96 w-full m-2">
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
      </ScrollArea>
    </div>
  );
}
