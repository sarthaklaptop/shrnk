// What each plan includes, kept in one place and written to match what the
// app enforces (src/app/api/link, src/app/api/linkStats, src/app/api/tags,
// prisma/schema.prisma): Free starts with 10 link credits, 5 tags and 30 days
// of analytics; Pro adds 1,000 credits, password-protected links, unlimited
// tags and every analytics range.

export type Currency = "USD" | "INR";

export const PRICE: Record<"FREE" | "PRO", Record<Currency, string>> = {
  FREE: { USD: "$0", INR: "₹0" },
  PRO: { USD: "$4.99", INR: "₹445" },
};

export const FREE_FEATURES = [
  "10 short links",
  "Click analytics for the last 30 days",
  "Country and device breakdowns",
  "Up to 5 tags",
  "A QR code for every link",
  "CSV export",
];

export const PRO_FEATURES = [
  "1,000 more short links",
  "Password-protected links",
  "Analytics history up to all time",
  "Unlimited tags",
  "Everything in Free",
];

export type Cell = string | boolean;

export const COMPARISON: { label: string; free: Cell; pro: Cell }[] = [
  { label: "Short links", free: "10", pro: "+1,000" },
  { label: "Analytics history", free: "30 days", pro: "All time" },
  { label: "Country and device stats", free: true, pro: true },
  { label: "Tags", free: "Up to 5", pro: "Unlimited" },
  { label: "Password-protected links", free: false, pro: true },
  { label: "QR codes", free: true, pro: true },
  { label: "CSV export", free: true, pro: true },
  { label: "Link lifetime", free: "1 year", pro: "1 year" },
];

export const FAQ = [
  {
    q: "Do I need an account to shorten a link?",
    a: "No. Paste a URL on the homepage and you get a short link right away. Links made without an account last 24 hours; sign in with Google to keep them for a year and see their clicks.",
  },
  {
    q: "What happens when I use all my links?",
    a: "Your existing links keep working and keep counting clicks. To make new ones, upgrade to Pro for 1,000 more.",
  },
  {
    q: "How do I pay for Pro?",
    a: "With PayPal, from the Upgrade button on this page. Pro switches on for your account as soon as the payment goes through.",
  },
  {
    q: "Which currencies can I pay in?",
    a: "The INR price is shown for reference. Payments go through PayPal in US dollars.",
  },
];
