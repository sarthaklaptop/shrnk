import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features-section" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/legal/terms" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Refunds", href: "/legal/refund" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1100px] px-4">
      <div className="flex flex-col gap-10 border-t border-neutral-200 py-12 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <Link href="/" className="text-2xl font-bold tracking-tight text-red-500">
            Shrnk
          </Link>
          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Short links, big impact. Shorten, share and see every click.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-3 gap-8 sm:gap-16">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-neutral-900">{col.title}</p>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-500 transition-colors hover:text-red-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex flex-col-reverse items-center gap-4 border-t border-neutral-200 py-6 sm:flex-row sm:justify-between">
        <p className="text-sm text-neutral-500">
          © {new Date().getFullYear()} Shrnk. All rights reserved.
        </p>
        <a
          href="https://x.com/Sarthak10007"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900"
        >
          <FaXTwitter size={14} aria-hidden />
          Built by Sarthak
        </a>
      </div>
    </footer>
  );
}
