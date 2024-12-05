"use client";

import { PlaceholdersAndVanishInputDemo } from "@/components/placeholder";
import WordRotate from "@/components/ui/word-rotate";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
        // y: 100,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.95,
      }}
      className="z-10 flex flex-col items-center justify-center h-lvh w-full"
    >
      <h1 className="text-4xl text-red-500 font-bold">
        Short Links, Big Impact.
        <WordRotate
          className="text-4xl font-bold text-black dark:text-white"
          words={["Create", "Share", "Analyze"]}
        />
      </h1>
      <PlaceholdersAndVanishInputDemo />
    </motion.div>
  );
}
