"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MdReplay } from "react-icons/md";
import { PlaceholdersAndVanishInputDemo } from "@/components/placeholder";
import HeroDemo from "./HeroDemo";

export function HomeHero() {
  const [run, setRun] = useState(0);

  return (
    <section className="relative pt-32 md:pt-40">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 text-center"
      >
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-3 py-1 text-xs font-medium text-neutral-600 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          Free plan: 25 links a month, no card
        </span>
        <h1 className="text-balance text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
          Short links, <span className="text-red-500">big impact.</span>
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-base text-neutral-600 sm:text-lg">
          Paste a long URL, get a short one, and see every click: when it
          happened, where it came from and what device it was on.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.8, 0.25, 1] }}
        className="relative z-20 mt-8 flex flex-col items-center"
      >
        <PlaceholdersAndVanishInputDemo />
        <p className="mt-1 text-xs text-neutral-500">
          No sign-up needed. Links made without an account last 24 hours.
        </p>
      </motion.div>

      {/* The demo fades in without moving: a stage that travels by layout
          steps its text a pixel at a time */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
        className="relative mx-auto mt-12 w-full max-w-[1040px] md:mt-16"
      >
        <div id="hero-demo">
          <HeroDemo key={run} />
        </div>
        <div className="-mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setRun((n) => n + 1)}
            className="relative inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-sm backdrop-blur transition hover:border-neutral-300 hover:text-neutral-900"
          >
            <MdReplay size={14} />
            Replay
          </button>
        </div>
      </motion.div>
    </section>
  );
}
