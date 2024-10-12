import Header from "@/components/Header";
import { PlaceholdersAndVanishInputDemo } from "@/components/placeholder";
import { BackgroundLines } from "@/components/ui/background-lines";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  return (
    <div>
      <Header/>
      <div className="flex flex-col items-center justify-center h-lvh w-full">
        <h1 className="text-4xl text-red-500 font-bold">URL Shortner</h1>
        <PlaceholdersAndVanishInputDemo/>
      </div>
    </div>
  );
}
