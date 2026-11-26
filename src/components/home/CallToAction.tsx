"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { MdArrowForward } from "react-icons/md";

export function CallToAction() {
  return (
    <section className="px-4 pb-16 md:pb-24">
      <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[28px] bg-neutral-900 px-6 py-16 text-center sm:px-12 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 w-[36rem] max-w-full rounded-full bg-red-500/25 blur-3xl"
        />
        <h2 className="relative mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Your next link is one paste away.
        </h2>
        <p className="relative mx-auto mt-4 max-w-lg text-pretty text-base text-neutral-400 sm:text-lg">
          Sign in with Google to keep your links for a year and see every
          click they get.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/x" })}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-red-500 px-5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-600 active:scale-[0.98]"
          >
            Start for free
            <MdArrowForward size={16} />
          </button>
          <Link
            href="/pricing"
            className="inline-flex h-11 items-center rounded-lg border border-white/15 px-5 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            See pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
