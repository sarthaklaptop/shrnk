"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { QrCode } from "@ark-ui/react/qr-code";
import { CircleFlag } from "react-circle-flags";
import { MdCheck, MdLock, MdLockOpen, MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { LuTag } from "react-icons/lu";
import {
  Badge,
  Bar,
  Button,
  Chart,
  Chip,
  Count,
  Field,
  Meter,
  Spinner,
  Stage,
  States,
  Text,
  useReducedMotion,
  type Act,
} from "@/components/stageshow";
import "./shrnk-look.css";
import "./feature-bento.css";

// The features grid (references/bento.md), written as a tile list first:
//
//   Tile       Span   Kind        The one thing                       Moves
//   Analytics  2 x 1  Hero UI     the clicks chart and top countries  the line draws, the bars fill
//   Free       1 x 1  Stat        "10 links", on the one dark tile    counts up from 0
//   Password   1 x 1  Component   the password gate, Unlock           the field fills, the button unlocks
//   QR         1 x 1  Object      a real QR code for a short link     rises out of the crop
//   Tags       1 x 1  Component   one link card and its tags          a third tag opens in
//
// No window chrome anywhere (the hero above has the page's one window).
// Every neighbor is a different kind. Each picture is its own Stage at 1:1,
// pinned to its tile's bottom; the copy is page text. Each tile plays one
// beat, once, as it scrolls in, 110ms after the tile before it.

const STEP = 110;
const LEAD = 450;

type Beat = { on: boolean };
const before: Beat = { on: false };
const after: Beat = { on: true };
const beat = (i: number) => async (a: Act<Beat>) => {
  await a.wait(LEAD + i * STEP);
  await a.set({ on: true });
};

function Tile({
  area,
  title,
  children,
  picture,
  dark,
}: {
  area: string;
  title?: ReactNode;
  children?: ReactNode;
  picture?: ReactNode;
  dark?: boolean;
}) {
  return (
    <section className={`fb-tile fb-tile--${area}`} data-dark={dark || undefined}>
      {title ? (
        <p className="fb-copy">
          <b>{title}</b> {children}
        </p>
      ) : (
        children
      )}
      {picture}
    </section>
  );
}

// The tile owns the crop: an inner Stage matches the picture slot's width
// so it never slices the panel short of the tile edge.
function usePictureWidth(initial = 360) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initial);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => setWidth(Math.max(1, Math.round(node.getBoundingClientRect().width)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

function useInView<T extends Element>(delay: number) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        t = window.setTimeout(() => setSeen(true), delay);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [delay]);
  return [ref, seen] as const;
}

/* ---------------- Analytics (hero) ---------------- */

const CLICKS = [62, 70, 66, 81, 77, 92, 88, 104, 97, 118, 112, 126, 121, 139, 133, 128, 146, 158, 151, 167, 162, 178, 171, 189];
const COUNTRIES = [
  { code: "in", name: "India", share: 0.38 },
  { code: "us", name: "United States", share: 0.24 },
  { code: "de", name: "Germany", share: 0.11 },
  { code: "gb", name: "United Kingdom", share: 0.08 },
];

function Analytics() {
  const [picture, width] = usePictureWidth(720);
  const wide = width >= 600;
  const chartW = wide ? Math.min(400, width - 330) : width - 88;
  return (
    <Tile
      area="hero"
      title="See every click."
      picture={
        <div ref={picture} className="fb-picture fb-picture--fill">
          <Stage<Beat>
            width={width}
            height={wide ? 322 : 300}
            initial={before}
            poster={after}
            play="once"
            script={beat(0)}
            className="shrnk-look fb-stage"
          >
            {(s) => (
              <div className="fb-panel" data-wide={wide || undefined}>
                <div className="fb-clicks">
                  <div className="fb-clicks-head">
                    <Text className="fb-label">Clicks</Text>
                    <Badge className="fb-range">Last 30 days</Badge>
                  </div>
                  <div className="fb-total">
                    <span className="fb-total-value">3,912</span>
                    <Badge tone="success" className="fb-delta">
                      +18%
                    </Badge>
                  </div>
                  <Chart data={CLICKS} width={chartW} height={wide ? 150 : 120} show={s.on} dot className="fb-chart" />
                </div>
                {wide && (
                  <div className="fb-countries">
                    <Text className="fb-label">Top countries</Text>
                    {COUNTRIES.map((c, i) => (
                      <div key={c.code} className="fb-country">
                        <div className="fb-country-line">
                          <CircleFlag countryCode={c.code} height={16} width={16} className="fb-flag" />
                          <Text className="fb-country-name">{c.name}</Text>
                          <Text className="fb-country-share">{`${Math.round(c.share * 100)}%`}</Text>
                        </div>
                        <Meter value={s.on ? c.share / 0.4 : 0} className="fb-meter" data-i={i} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Stage>
        </div>
      }
    >
      Clicks over time, by country and by device, for every link you make.
    </Tile>
  );
}

/* ---------------- Free plan (stat) ---------------- */

function FreePlan() {
  const reduced = useReducedMotion();
  const [ref, seen] = useInView<HTMLDivElement>(LEAD + STEP);
  return (
    <Tile area="stat" dark>
      <div ref={ref} className="fb-stat">
        <span className="fb-stat-lead">Start free with</span>
        <span className="fb-stat-number">
          <Count value={seen || reduced ? 10 : 0} duration={900} />
          <span className="fb-stat-unit"> links</span>
        </span>
        <span className="fb-stat-label">to start, no card needed. Pro adds 1,000 more for $4.99 a month.</span>
      </div>
    </Tile>
  );
}

/* ---------------- Password (component) ---------------- */

type Gate = { pw: string; state: "locked" | "busy" | "open" };
const gateStart: Gate = { pw: "", state: "locked" };
const gateEnd: Gate = { pw: "launch26", state: "open" };

async function unlock(a: Act<Gate>) {
  await a.wait(LEAD + 2 * STEP + 300);
  await a.type("pw", "launch26", { interval: 70 });
  await a.wait(300);
  await a.set({ state: "busy" });
  await a.wait(650);
  await a.set({ state: "open" });
}

function Password() {
  return (
    <Tile
      area="lock"
      title="Lock any link with Pro."
      picture={
        <div className="fb-picture fb-picture--center">
          <Stage<Gate> width={360} height={236} initial={gateStart} poster={gateEnd} play="once" script={unlock} className="shrnk-look fb-stage">
            {(s) => (
              <div className="fb-gate">
                <div className="fb-gate-head">
                  <span className="fb-gate-icon" data-open={s.state === "open" || undefined}>
                    <States value={s.state === "open" ? "open" : "locked"} states={{ locked: <MdLock size={18} />, open: <MdLockOpen size={18} /> }} />
                  </span>
                  <span className="fb-gate-text">
                    <Text className="fb-gate-title">Password protected</Text>
                    <Text className="fb-gate-sub">shrnk-six.vercel.app/Rk4wN8</Text>
                  </span>
                </div>
                <Field value={s.pw} password placeholder="Enter password" focused={s.state === "locked" && s.pw.length > 0} className="fb-gate-field" />
                <Button variant="primary" size="large" className="fb-gate-btn" data-open={s.state === "open" || undefined}>
                  <States
                    value={s.state}
                    states={{
                      locked: "Unlock link",
                      busy: <Spinner />,
                      open: (
                        <span className="fb-inline">
                          <MdCheck size={14} /> Unlocked
                        </span>
                      ),
                    }}
                  />
                </Button>
              </div>
            )}
          </Stage>
        </div>
      }
    >
      Only people with the password get through.
    </Tile>
  );
}

/* ---------------- QR (object) ---------------- */

const QR_LINK = "https://shrnk-six.vercel.app/Lq82Tz";

function QrTile() {
  return (
    <Tile
      area="qr"
      title="A QR code for every link."
      picture={
        <div className="fb-picture fb-picture--center">
          <Stage<Beat> width={360} height={236} initial={before} poster={after} play="once" script={beat(3)} className="shrnk-look fb-stage">
            {(s) => (
              <div className="fb-qr" data-on={s.on || undefined}>
                <QrCode.Root value={QR_LINK} encoding={{ ecc: "H" }} className="fb-qr-code">
                  <QrCode.Frame>
                    <QrCode.Pattern />
                  </QrCode.Frame>
                  <QrCode.Overlay>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/ShrnkLogo.png" alt="" width={34} height={34} className="fb-qr-logo" />
                  </QrCode.Overlay>
                </QrCode.Root>
                <Text className="fb-qr-caption">shrnk-six.vercel.app/Lq82Tz</Text>
              </div>
            )}
          </Stage>
        </div>
      }
    >
      Scans count as clicks, like everything else.
    </Tile>
  );
}

/* ---------------- Tags (component) ---------------- */

function TagChip({ children }: { children: string }) {
  return (
    <span className="fb-tag">
      <LuTag size={12} />
      {children}
    </span>
  );
}

function Tags() {
  const [picture, width] = usePictureWidth(360);
  return (
    <Tile
      area="tags"
      title="Tags that keep you organized."
      picture={
        <div ref={picture} className="fb-picture fb-picture--fill">
          <Stage<Beat> width={width} height={236} initial={before} poster={after} play="once" script={beat(4)} className="shrnk-look fb-stage">
            {(s) => (
              <div className="fb-link">
                <Text className="fb-link-short">shrnk-six.vercel.app/Vt3mQa</Text>
                <span className="fb-link-dest">
                  <MdOutlineSubdirectoryArrowRight size={14} />
                  <Text className="fb-link-dest-text">https://acme.dev/newsletter/may</Text>
                </span>
                <div className="fb-tags">
                  <TagChip>newsletter</TagChip>
                  <TagChip>email</TagChip>
                  <Chip show={s.on} gap={6} className="fb-tag-slot">
                    <LuTag size={12} />
                    may-2026
                  </Chip>
                </div>
                <div className="fb-link-foot">
                  <Bar w={64} h={6} tone={2} />
                  <Bar w={40} h={6} tone={2} />
                </div>
              </div>
            )}
          </Stage>
        </div>
      }
    >
      Group links by campaign and export them as CSV.
    </Tile>
  );
}

export function FeatureBento() {
  return (
    <section id="features-section" className="shrnk-bento scroll-mt-28 px-4 py-24 md:py-32">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-red-500">Features</p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Everything a link needs after you share it
        </h2>
      </div>
      <div className="fb-grid">
        <Analytics />
        <FreePlan />
        <Password />
        <QrTile />
        <Tags />
      </div>
    </section>
  );
}
