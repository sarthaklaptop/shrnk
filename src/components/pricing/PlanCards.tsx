"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { MdCheck } from "react-icons/md";
import { DragCloseDrawerExample } from "@/components/PaymentCloseDraw";
import { cn } from "@/lib/utils";
import { FREE_FEATURES, PRICE, PRO_FEATURES, type Currency } from "./plans";

function Features({ items, dark }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-6">
          <span
            className={cn(
              "mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full",
              dark ? "bg-red-500/15 text-red-400" : "bg-neutral-100 text-neutral-500"
            )}
          >
            <MdCheck size={13} />
          </span>
          <span className={dark ? "text-neutral-300" : "text-neutral-600"}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PlanCards() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const { status } = useSession();

  return (
    <div>
      <div className="mb-10 flex justify-center">
        <div role="group" aria-label="Currency" className="inline-flex rounded-full border border-neutral-200 bg-white p-1 shadow-sm">
          {(["USD", "INR"] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={currency === c}
              onClick={() => setCurrency(c)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                currency === c ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              {c === "USD" ? "USD ($)" : "INR (₹)"}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {/* Free */}
        <div className="flex flex-col rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-neutral-900">Free</p>
          <p className="mt-4 flex items-baseline gap-1.5">
            <span className="text-5xl font-bold tracking-tight text-neutral-900">{PRICE.FREE[currency]}</span>
            <span className="text-sm text-neutral-500">forever</span>
          </p>
          <p className="mt-3 text-sm leading-6 text-neutral-500">
            For trying Shrnk and keeping your personal links in one place.
          </p>
          <div className="my-8 h-px bg-neutral-100" />
          <Features items={FREE_FEATURES} />
          <div className="mt-auto pt-10">
            {status === "authenticated" ? (
              <Link
                href="/x"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                Go to your links
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/x" })}
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                Start for free
              </button>
            )}
          </div>
        </div>

        {/* Pro */}
        <div className="relative flex flex-col overflow-hidden rounded-3xl bg-neutral-900 p-8 shadow-xl shadow-neutral-900/10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-red-500/25 blur-3xl"
          />
          <div className="relative flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Pro</p>
            <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-medium text-red-300">
              For campaigns and launches
            </span>
          </div>
          <p className="relative mt-4 flex items-baseline gap-1.5">
            <span className="text-5xl font-bold tracking-tight text-white">{PRICE.PRO[currency]}</span>
            <span className="text-sm text-neutral-400">per month</span>
          </p>
          <p className="relative mt-3 text-sm leading-6 text-neutral-400">
            For links you share widely, protect with a password or track for longer.
          </p>
          <div className="relative my-8 h-px bg-white/10" />
          <div className="relative">
            <Features items={PRO_FEATURES} dark />
          </div>
          <div className="relative mt-auto pt-10">
            <DragCloseDrawerExample />
          </div>
        </div>
      </div>
    </div>
  );
}
