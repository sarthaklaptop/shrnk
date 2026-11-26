"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { MdArrowForward, MdLogout, MdSpaceDashboard } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userStorage } from "@/store/link";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Features", href: "/#features-section" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Keep the signed-in user's image and email in the store, merged into
  // what's already there so the plan (userType, credits) isn't overwritten
  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    const { image, email, id } = session.user;
    userStorage.setState((s) => ({
      user: { ...s.user, image: image ?? null, email: email ?? null, id: id ?? s.user.id },
    }));
  }, [status, session?.user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile menu, and close it on navigation
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => !href.includes("#") && pathname === href;
  const login = () => signIn("google", { callbackUrl: "/x" });

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
        <div
          className={cn(
            "mx-auto flex h-14 max-w-[1100px] items-center justify-between gap-4 rounded-2xl border px-3 transition-all duration-300 sm:px-4 md:grid md:grid-cols-[1fr_auto_1fr]",
            scrolled
              ? "border-neutral-200/80 bg-white/[0.92] shadow-sm shadow-neutral-900/5 backdrop-blur-md"
              : "border-transparent bg-transparent"
          )}
        >
          <Link href="/" className="justify-self-start px-1 text-xl font-bold tracking-tight text-red-500">
            Shrnk
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-neutral-900"
                    : "text-neutral-500 hover:bg-neutral-100/80 hover:text-neutral-900"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center justify-self-end gap-2 md:flex">
            {status === "loading" ? (
              <span className="h-9 w-36 animate-pulse rounded-lg bg-neutral-200/70" aria-label="Loading" />
            ) : status === "authenticated" ? (
              <>
                <Link
                  href="/x"
                  className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                >
                  Dashboard
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label="Account menu"
                    className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <Avatar className="h-9 w-9 border border-neutral-200">
                      <AvatarImage src={session?.user?.image || ""} alt="" />
                      <AvatarFallback>{session?.user?.name?.[0] ?? "U"}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <p className="truncate text-sm font-medium text-neutral-900">{session?.user?.name}</p>
                      <p className="truncate text-xs text-neutral-500">{session?.user?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/x">
                        <MdSpaceDashboard className="mr-2" size={16} />
                        My links
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onSelect={() => signOut()}>
                      <MdLogout className="mr-2" size={16} />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={login}
                  className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={login}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-red-500 px-3.5 text-sm font-semibold text-white shadow-sm shadow-red-500/25 transition hover:bg-red-600 active:scale-[0.98]"
                >
                  Start for free
                  <MdArrowForward size={15} />
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-lg text-neutral-800 transition-colors hover:bg-neutral-100 md:hidden"
          >
            <IconMenu2 size={20} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-neutral-900/20 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="mx-3 mt-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl shadow-neutral-900/10"
            >
              <div className="flex h-10 items-center justify-between pl-2">
                <Link href="/" onClick={() => setOpen(false)} className="text-xl font-bold tracking-tight text-red-500">
                  Shrnk
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-9 w-9 place-items-center rounded-lg text-neutral-800 hover:bg-neutral-100"
                >
                  <IconX size={20} />
                </button>
              </div>

              <nav aria-label="Mobile" className="mt-2 flex flex-col">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-3 text-base font-medium",
                      isActive(link.href) ? "bg-neutral-100 text-neutral-900" : "text-neutral-700 hover:bg-neutral-50"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-3 border-t border-neutral-100 pt-3">
                {status === "authenticated" ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/x"
                      onClick={() => setOpen(false)}
                      className="inline-flex h-11 items-center justify-center rounded-lg bg-red-500 text-sm font-semibold text-white"
                    >
                      Go to dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="inline-flex h-11 items-center justify-center rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={status === "loading"}
                    onClick={() => {
                      setOpen(false);
                      login();
                    }}
                    className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-red-500 text-sm font-semibold text-white shadow-sm shadow-red-500/25 disabled:opacity-60"
                  >
                    Start for free
                    <MdArrowForward size={15} />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
