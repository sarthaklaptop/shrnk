import type { Metadata } from "next";
import Link from "next/link";
import { MdBarChart, MdLink, MdLock, MdLocationOn, MdQrCode2, MdSell } from "react-icons/md";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ClickJourney from "@/components/about/ClickJourney";
import { CallToAction } from "@/components/home/CallToAction";

export const metadata: Metadata = {
  title: "About - Shrnk",
  description:
    "Shrnk is a link shortener built in Pune, India. Shorten a URL, share it, and see when, where and on what device it was opened.",
};

// Each line here describes what the app does today (src/app/api,
// src/app/[shortLink]/route.ts, prisma/schema.prisma).
const STEPS = [
  {
    n: "1",
    title: "Look up",
    body: "Shrnk finds the link and checks it hasn't expired and doesn't need a password.",
  },
  {
    n: "2",
    title: "Redirect",
    body: "The visitor is sent straight on to the long URL with a 307 redirect.",
  },
  {
    n: "3",
    title: "Count",
    body: "In the background, the click is saved with its country, city, device, browser and OS.",
  },
];

const FEATURES = [
  {
    icon: MdLink,
    title: "Shorten without an account",
    body: "Paste a URL on the homepage and share the short link straight away. Links made without an account last 24 hours; sign in and they last a year.",
  },
  {
    icon: MdBarChart,
    title: "See every click",
    body: "Clicks over time, by country and by device, for every link you make. Free accounts see the last 30 days; Pro sees all time.",
  },
  {
    icon: MdLock,
    title: "Password-protect a link",
    body: "On Pro, only people with the password get through. Passwords are stored as bcrypt hashes, never as plain text.",
  },
  {
    icon: MdQrCode2,
    title: "A QR code for every link",
    body: "Open it from any link in your dashboard. Scans count as clicks, like everything else.",
  },
  {
    icon: MdSell,
    title: "Tags and CSV export",
    body: "Group links by campaign with tags, search them, and export the list as a CSV whenever you need it.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-11/12">
      <Header />

      <div className="overflow-hidden bg-gray-50">
        {/* Intro */}
        <section className="px-4 pb-16 pt-32 md:pt-40">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-red-500">About</p>
            <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
              Long links in. Short links out. Every click counted.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-neutral-600 sm:text-lg">
              Shrnk is a link shortener built in Pune, India. It turns long, messy URLs into short
              ones you can share anywhere, then shows you when, where and on what device each one
              was opened.
            </p>
          </div>
        </section>

        {/* How a click works */}
        <section className="px-4 pb-20 md:pb-24">
          <div className="mx-auto max-w-[960px]">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                What happens when someone clicks
              </h2>
              <p className="mt-4 text-pretty text-base text-neutral-600">
                It takes a moment for the visitor. Here&apos;s everything Shrnk does in between.
              </p>
            </div>
            <div id="click-journey">
              <ClickJourney />
            </div>
            <ol className="mt-10 grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <li key={step.n} className="flex gap-4">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-red-50 text-sm font-semibold text-red-500">
                    {step.n}
                  </span>
                  <div>
                    <p className="font-semibold text-neutral-900">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* What it does */}
        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="max-w-xl text-balance text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Everything a link needs, and nothing it doesn&apos;t
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-3xl border border-neutral-200 bg-white p-7">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-500">
                    <Icon size={20} />
                  </span>
                  <p className="mt-5 font-semibold text-neutral-900">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{body}</p>
                </div>
              ))}
              {/* Privacy: what a click record keeps, and what it doesn't */}
              <div className="rounded-3xl bg-neutral-900 p-7 text-white">
                <p className="text-sm font-semibold text-red-300">Privacy</p>
                <p className="mt-3 text-lg font-semibold leading-snug">
                  Clicks are counted, not people.
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Shrnk looks up a visitor&apos;s country and city from their IP address, then saves the
                  click without it. We don&apos;t sell your data.{" "}
                  <Link href="/legal/privacy" className="text-white underline underline-offset-4">
                    Privacy policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Where */}
        <section className="px-4 pb-16 md:pb-20">
          <div className="mx-auto flex max-w-[1100px] flex-col items-start gap-6 rounded-3xl border border-neutral-200 bg-white p-8 sm:flex-row sm:items-center md:p-10">
            <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-red-50 text-red-500">
              <MdLocationOn size={24} />
            </span>
            <div className="flex-1">
              <p className="text-xl font-semibold text-neutral-900">Made in Pune, used everywhere</p>
              <p className="mt-1 text-sm leading-6 text-neutral-600">
                Shrnk is built and run from Pune, Maharashtra, India. Questions, ideas or a link
                that isn&apos;t behaving? We read every message.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-11 flex-none items-center rounded-lg border border-neutral-200 px-5 text-sm font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50"
            >
              Contact us
            </Link>
          </div>
        </section>

        <CallToAction />

        <Footer />
      </div>
    </div>
  );
}
