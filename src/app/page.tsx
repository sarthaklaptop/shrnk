'use client'

import { PlaceholdersAndVanishInputDemo } from "@/components/placeholder";
import { BackgroundLines } from "@/components/ui/background-lines";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-lvh w-full">
        <h1 className="text-4xl text-red-500 font-bold">URL Shortner</h1>
        <PlaceholdersAndVanishInputDemo/>
      </div>
    </div>
  );
}
