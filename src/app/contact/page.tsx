import type { Metadata } from "next";
import Link from "next/link";
import {
  MdArrowForward,
  MdBugReport,
  MdFlag,
  MdLightbulbOutline,
  MdLinkOff,
  MdLocationOn,
  MdMail,
  MdPrivacyTip,
  MdReceiptLong,
  MdSchedule,
} from "react-icons/md";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ComposeDemo from "@/components/contact/ComposeDemo";
import { CopyEmail } from "@/components/contact/CopyEmail";

export const metadata: Metadata = {
  title: "Contact - Shrnk",
  description:
    "Questions, bugs, billing or abuse reports: write to shrnk.contact@gmail.com. We aim to reply within 24 hours.",
};

const EMAIL = "shrnk.contact@gmail.com";
const mailto = (subject: string) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;

// Every topic goes to the same inbox; each link starts the email with the
// right subject, and the line under it says what helps us answer fastest.
const TOPICS = [
  {
    icon: MdLinkOff,
    title: "A link isn't working",
    body: "Send the short link and what you see when you open it.",
    subject: "Short link not working",
  },
  {
    icon: MdReceiptLong,
    title: "Billing and refunds",
    body: "Include the email on your account and your PayPal receipt.",
    subject: "Billing question",
    extra: { label: "Refund policy", href: "/legal/refund" },
  },
  {
    icon: MdFlag,
    title: "Report abuse",
    body: "Send the short link that points to phishing, malware or spam. We review every report.",
    subject: "Abuse report",
  },
  {
    icon: MdBugReport,
    title: "Something's broken",
    body: "Steps to reproduce, your browser, and a screenshot help most.",
    subject: "Bug report",
  },
  {
    icon: MdLightbulbOutline,
    title: "An idea for Shrnk",
    body: "Tell us what you'd use it for, not only what it is.",
    subject: "Feature idea",
  },
  {
    icon: MdPrivacyTip,
    title: "Your data",
    body: "Ask for a copy of your data or for your account to be deleted.",
    subject: "Privacy request",
    extra: { label: "Privacy policy", href: "/legal/privacy" },
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto w-11/12">
      <Header />

      <div className="overflow-hidden bg-gray-50">
        {/* Intro, the address, and what a good message looks like */}
        <section className="px-4 pb-20 pt-32 md:pt-40">
          <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_560px] lg:gap-14">
            <div className="max-w-lg">
              <p className="text-sm font-semibold uppercase tracking-wider text-red-500">Contact</p>
              <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
                Questions, bugs, ideas: write to us.
              </h1>
              <p className="mt-5 text-pretty text-base leading-7 text-neutral-600 sm:text-lg">
                Everything comes to one inbox and we read every message. Tell us the short link and
                what happened, and we can usually sort it in one reply.
              </p>

              <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-red-50 text-red-500">
                    <MdMail size={20} />
                  </span>
                  <a href={`mailto:${EMAIL}`} className="min-w-0 truncate text-base font-semibold text-neutral-900 hover:text-red-600 sm:text-lg">
                    {EMAIL}
                  </a>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`mailto:${EMAIL}`}
                    className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-red-500 px-5 text-sm font-semibold text-white shadow-sm shadow-red-500/25 transition hover:bg-red-600 active:scale-[0.98]"
                  >
                    Write an email
                    <MdArrowForward size={15} />
                  </a>
                  <CopyEmail email={EMAIL} />
                </div>
                <p className="mt-4 flex items-center gap-2 text-sm text-neutral-500">
                  <MdSchedule size={16} className="flex-none" />
                  We aim to reply within 24 hours, in English or Hindi.
                </p>
              </div>
            </div>
            <div id="compose-demo" className="mx-auto w-full max-w-[560px]">
              <ComposeDemo />
            </div>
          </div>
        </section>

        {/* Topics */}
        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="max-w-xl text-balance text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              What&apos;s it about?
            </h2>
            <p className="mt-3 max-w-xl text-base text-neutral-600">
              Pick a topic and your email opens with the subject filled in.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TOPICS.map(({ icon: Icon, title, body, subject, extra }) => (
                <div key={title} className="group relative flex flex-col rounded-3xl border border-neutral-200 bg-white p-7 transition hover:border-neutral-300 hover:shadow-sm">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-500">
                    <Icon size={20} />
                  </span>
                  <a href={mailto(subject)} className="mt-5 font-semibold text-neutral-900 after:absolute after:inset-0 after:rounded-3xl">
                    {title}
                  </a>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{body}</p>
                  <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-red-500">
                      Email us
                      <MdArrowForward size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                    {extra && (
                      <Link href={extra.href} className="relative z-10 text-sm text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline">
                        {extra.label}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Where and when */}
        <section className="px-4 pb-24 md:pb-32">
          <div className="mx-auto grid max-w-[1100px] gap-4 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-3xl border border-neutral-200 bg-white p-7">
              <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-red-50 text-red-500">
                <MdLocationOn size={20} />
              </span>
              <div>
                <p className="font-semibold text-neutral-900">Pune, Maharashtra, India</p>
                <p className="mt-1 text-sm leading-6 text-neutral-600">
                  Shrnk is built and run from Pune. Email is the fastest way to reach us.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-3xl border border-neutral-200 bg-white p-7">
              <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-red-50 text-red-500">
                <MdSchedule size={20} />
              </span>
              <div>
                <p className="font-semibold text-neutral-900">Mon to Fri, 9:00 to 18:00 IST</p>
                <p className="mt-1 text-sm leading-6 text-neutral-600">
                  Our working hours. Email any time; we read everything that comes in.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
