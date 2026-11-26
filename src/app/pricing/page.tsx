import type { Metadata } from "next";
import { MdAdd, MdCheck, MdRemove } from "react-icons/md";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { PlanCards } from "@/components/pricing/PlanCards";
import UpgradeDemo from "@/components/pricing/UpgradeDemo";
import { COMPARISON, FAQ, type Cell } from "@/components/pricing/plans";

export const metadata: Metadata = {
  title: "Pricing - Shrnk",
  description:
    "Start free with 10 short links and 30 days of click analytics. Upgrade to Pro for 1,000 more links, password-protected links and your full analytics history.",
};

function Value({ cell }: { cell: Cell }) {
  if (cell === true)
    return (
      <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-red-50 text-red-500">
        <MdCheck size={15} aria-label="Included" />
      </span>
    );
  if (cell === false)
    return (
      <span className="inline-grid h-6 w-6 place-items-center text-neutral-300">
        <MdRemove size={15} aria-label="Not included" />
      </span>
    );
  return <span className="text-xs font-medium text-neutral-900 sm:text-sm">{cell}</span>;
}

export default function Pricing() {
  return (
    <div className="mx-auto w-11/12">
      <Header />

      <div className="overflow-hidden bg-gray-50">
        {/* Plans */}
        <section className="px-4 pb-20 pt-32 md:pt-40">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-red-500">Pricing</p>
            <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
              Start free. Upgrade when you need more.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-neutral-600 sm:text-lg">
              Every account gets short links, click analytics and QR codes. Pro adds more links,
              password protection and your whole click history.
            </p>
          </div>
          <PlanCards />
        </section>

        {/* What Pro unlocks */}
        <section className="px-4 py-12 md:py-16">
          <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-16">
            <div className="max-w-md">
              <p className="text-sm font-semibold uppercase tracking-wider text-red-500">What Pro unlocks</p>
              <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                More links, and every click you&apos;ve ever had.
              </h2>
              <p className="mt-5 text-pretty text-base leading-7 text-neutral-600">
                Upgrading adds 1,000 links to your account straight away. Your analytics open up
                beyond the last 30 days, to 90 days, a year or all time, and you can put a
                password on any link.
              </p>
            </div>
            <div id="upgrade-demo" className="mx-auto w-full max-w-[520px]">
              <UpgradeDemo />
            </div>
          </div>
        </section>

        {/* Compare */}
        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-900">Compare plans</h2>
            <div className="mt-10 overflow-hidden rounded-3xl border border-neutral-200 bg-white">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th scope="col" className="px-5 py-4 text-sm font-medium text-neutral-500 sm:px-8">
                      <span className="sr-only">Feature</span>
                    </th>
                    <th scope="col" className="w-20 px-2 py-4 text-center text-sm font-semibold text-neutral-900 sm:w-40 sm:px-3">
                      Free
                    </th>
                    <th scope="col" className="w-20 px-2 py-4 text-center text-sm font-semibold text-red-500 sm:w-40 sm:px-3">
                      Pro
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.label} className="border-b border-neutral-100 last:border-0">
                      <th scope="row" className="py-4 pl-5 pr-2 text-sm font-normal text-neutral-600 sm:px-8">
                        {row.label}
                      </th>
                      <td className="px-2 py-4 text-center sm:px-3">
                        <Value cell={row.free} />
                      </td>
                      <td className="px-2 py-4 text-center sm:px-3">
                        <Value cell={row.pro} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Questions */}
        <section className="px-4 pb-24 pt-8 md:pb-32">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-900">Questions</h2>
            <div className="mt-10 divide-y divide-neutral-200 rounded-3xl border border-neutral-200 bg-white">
              {FAQ.map((item) => (
                <details key={item.q} className="group px-5 py-5 sm:px-8">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-medium text-neutral-900 [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span
                      aria-hidden
                      className="grid h-6 w-6 flex-none place-items-center rounded-full border border-neutral-200 text-neutral-500 transition-transform group-open:rotate-45"
                    >
                      <MdAdd size={14} />
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
