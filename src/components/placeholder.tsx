"use client";

import { useState } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { toast } from "sonner";
import axios from "axios";
import { NextResponse } from "next/server";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";


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
  // const [shortLinks, setShortLinks] = useState<string[]>([]);
  const [links, setLinks] = useState<Array<{ shortLink: string ; longLink:string}>> ([]);

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

    try {
      const result = await axios.post("/api/link", { longLink: urlInput });
      setResponse(result.data);
      console.log("Short URL created: ", result.data);
      setLinks(prev => [...prev, {shortLink: result.data.data.shortLink, longLink: urlInput} ]);
      toast("Short URL created");
      console.log("Short URL created: ", result.data.data.shortLink);
    } catch (error) {
      console.error("Error details: ", error);
      toast("Error creating short URL");
    }
  };
  return (
    <div className=" m-2 flex flex-col w-2/4 justify-center  items-center px-4">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
      {/* <p>Shortened URL: {response}</p> */}
      {
        links.map(({shortLink, longLink}, index) => (
          <div key={index} className="flex flex-col w-full items-center justify-center">
            <div className=" flex flex-col border-2 rounded-lg2  p-4 w-full gap-2">
              <p className="font-bold ">{longLink}</p>
              <span>
                <MdOutlineSubdirectoryArrowRight/>
              </span>
              <a href={`api/${shortLink}`} target="_blank" rel="noopener noreferrer">
                {shortLink}
              </a>
            </div>
          </div>
        ))
      }
    </div>
  );
}
