"use client";

import {
  Bar,
  Button,
  Chart,
  Collapse,
  Count,
  Field,
  Popover,
  Roll,
  Row,
  Spinner,
  Stage,
  States,
  Text,
  Window,
  type Act,
  type Layout,
} from "@/components/stageshow";
import {
  MdAdd,
  MdAdsClick,
  MdCheck,
  MdContentCopy,
  MdLink,
  MdOutlineSubdirectoryArrowRight,
  MdPerson,
  MdQrCode2,
  MdSearch,
  MdSettings,
} from "react-icons/md";
import "./shrnk-look.css";
import "./hero-demo.css";

// The homepage hero: Shrnk's own Links dashboard. A long URL goes into
// "New link", the short link lands at the top of the list, it is copied, and
// the clicks start arriving, on the row and on the analytics card beside it.
//
// Plan, written before building:
//   Place     Full-width hero under the headline; page ground (gray-50), so
//             no plate. Fade crop: the window whole at top and sides, fading
//             out at its foot over filler rows.
//   Focal     The new link's row and its click count.
//   Action    New link, paste the URL, Shorten, Copy.
//   Payoff    Clicks rolling up on the row and on the analytics card.
//   Satellite The analytics card straddling the window's left edge, over the
//             app's sidebar (chrome), present from the first frame.
//   Left out  Tags, passwords, QR (the feature grid shows them).
//
// Real strings: Links, New link, the typed URL, Shorten, the two real links
// and their counts, Copy, Clicks. Everything else is bars.

const DOMAIN = "shrnk-six.vercel.app";
const TYPED = "https://acme.dev/launch-week";
const NEW_SLUG = "p7Kd2Q";
const OLD = [
  { slug: "hN3xQe", dest: "https://acme.dev/pricing", clicks: 1284 },
  { slug: "a9TfLm", dest: "https://github.com/acme/sdk", clicks: 312 },
];
const FILLER = [
  [176, 232],
  [148, 196],
  [188, 250],
  [160, 210],
];

// The analytics card's line: the old link's last 24 hours, then the new
// link's first minutes, the right end rising as clicks come in.
const OLD_SERIES = [38, 44, 41, 52, 49, 61, 58, 66, 72, 69, 81, 88];
const steps = [0, 4, 13, 27, 48];
// Each rise starts with a 1, so the smoothed line eases up off the floor
// instead of dipping under it first.
const NEW_SERIES = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 9],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 9, 14],
  [0, 0, 0, 0, 0, 0, 0, 1, 4, 9, 14, 21],
];

type Pay = "idle" | "busy" | "done";
type S = {
  pop: boolean;
  url: string;
  pay: Pay;
  added: boolean;
  copied: boolean;
  step: number;
  selected: "old" | "new";
};

const initial: S = { pop: false, url: "", pay: "idle", added: false, copied: false, step: 0, selected: "old" };
const POSTER: S = { ...initial, added: true, copied: true, step: steps.length - 1, selected: "new" };

const REST = { wide: { x: 640, y: 100 }, compact: { x: 120, y: 64 } };

async function script(a: Act<S>) {
  await a.wait(900);

  // New link
  a.mark("new");
  await a.click({ at: "new", x: 0.92, y: 0.85 });
  await a.set({ pop: true });
  await a.wait(350);
  await a.type("url", TYPED, { interval: 32 });
  await a.wait(350);

  // Shorten: the button works, then the popover closes as the row drops in
  a.mark("shorten");
  await a.click("shorten");
  await a.set({ pay: "busy" });
  await a.wait(700);
  await a.set({ pay: "done" });
  await a.wait(350);
  await a.set({ pop: false });
  await a.wait(120);
  a.mark("added");
  await a.set({ added: true, selected: "new" });
  await a.wait(900);

  // Copy it
  a.mark("copy");
  // Pressed at its lower right corner, so the arrow never sits on the label
  await a.click({ at: "copy", x: 0.92, y: 0.85 });
  await a.set({ copied: true });
  await a.wait(300);
  await a.move("watch");

  // The clicks arrive
  a.mark("clicks");
  for (let i = 1; i < steps.length; i++) {
    await a.wait(i === 1 ? 500 : 750);
    await a.set({ step: i });
  }
  await a.wait(2000);
}

const short = (slug: string, layout: Layout) => (layout === "compact" ? `/${slug}` : `${DOMAIN}/${slug}`);

function LinkRow({
  slug,
  dest,
  clicks,
  layout,
  fresh,
  copied,
}: {
  slug: string;
  dest: string;
  clicks: number;
  layout: Layout;
  fresh?: boolean;
  copied?: boolean;
}) {
  return (
    <div className="sh-card" data-fresh={fresh || undefined}>
      <Row
        pad={0}
        className="sh-row"
        title={
          <span className="sh-title">
            <Text className="sh-short">{short(slug, layout)}</Text>
            {fresh ? (
              <Button
                variant="ghost"
                size="small"
                className="sh-copy"
                data-target="copy"
                icon={<States value={copied ? "check" : "copy"} states={{ copy: <MdContentCopy size={12} />, check: <MdCheck size={12} /> }} />}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            ) : (
              <span className="sh-icon-btn" aria-hidden>
                <MdContentCopy size={14} />
              </span>
            )}
          </span>
        }
        meta={
          <span className="sh-meta">
            <span className="sh-pill">
              <MdAdsClick size={14} />
              {fresh ? (
                // A new link's count grows a digit: Roll eases the pill's width with it
                <Roll stagger={25} className="sh-count">{clicks.toLocaleString("en-US")}</Roll>
              ) : (
                <Count value={clicks} duration={500} className="sh-count" />
              )}
            </span>
            {layout === "wide" && (
              <span className="sh-pill sh-pill--icon" aria-hidden>
                <MdQrCode2 size={15} />
              </span>
            )}
          </span>
        }
        subtitle={
          <span className="sh-dest">
            <MdOutlineSubdirectoryArrowRight size={14} />
            <Text className="sh-dest-text">{dest}</Text>
          </span>
        }
      />
    </div>
  );
}

function FillerRow({ a, b, layout }: { a: number; b: number; layout: Layout }) {
  const k = layout === "compact" ? 0.62 : 1;
  return (
    <div className="sh-card">
      <Row
        pad={0}
        className="sh-row"
        title={<span className="sh-line sh-line--title"><Bar w={Math.round(a * k)} h={8} r={4} tone={3} /></span>}
        meta={<span className="sh-line sh-line--title"><Bar w={54} h={24} r={8} tone={1} /></span>}
        subtitle={<span className="sh-line sh-line--sub"><Bar w={Math.round(b * k)} h={6} r={3} tone={2} /></span>}
      />
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sh-side">
      <span className="sh-wordmark">Shrnk</span>
      <span className="sh-nav" data-on>
        <MdLink size={16} />
        <Text className="sh-nav-label">Links</Text>
      </span>
      <span className="sh-nav">
        <MdPerson size={16} />
        <Bar w={44} h={6} tone={2} />
      </span>
      <span className="sh-nav">
        <MdSettings size={16} />
        <Bar w={88} h={6} tone={2} />
      </span>
      {/* Tags: the sidebar's second group, filler the analytics card covers */}
      <span className="sh-side-group">
        <Bar w={36} h={5} tone={2} />
      </span>
      {[64, 48, 72, 56].map((w, i) => (
        <span key={i} className="sh-nav">
          <span className="sh-tag-dot" data-tone={i} />
          <Bar w={w} h={6} tone={2} />
        </span>
      ))}
    </aside>
  );
}

function Analytics({ s }: { s: S }) {
  const fresh = s.selected === "new";
  const series = fresh ? NEW_SERIES[s.step]! : OLD_SERIES;
  return (
    <div className="sh-stats">
      <div className="sh-stats-head">
        <Text className="sh-stats-label">Clicks</Text>
        <Roll className="sh-stats-slug">{`/${fresh ? NEW_SLUG : OLD[0]!.slug}`}</Roll>
      </div>
      <div className="sh-stats-value">
        {/* A different link, so the number crossfades rather than rolls; the
            box holds the wider old figure, so the new count never clips */}
        <States
          value={s.selected}
          align="start"
          states={{
            old: <Count value={OLD[0]!.clicks} />,
            new: <Count value={steps[s.step]!} duration={600} />,
          }}
        />
      </div>
      <Chart data={series} width={224} height={64} max={fresh ? 24 : 96} dot className="sh-chart" />
      <div className="sh-stats-foot">
        <Text className="sh-stats-range">Last 24 hours</Text>
        <Bar w={42} h={6} tone={2} />
      </div>
    </div>
  );
}

function Shortener({ s }: { s: S }) {
  return (
    <Popover show={s.pop} origin="top right" className="sh-pop">
      <div className="sh-pop-body">
        <Field
          label="Destination URL"
          value={s.url}
          placeholder="https://"
          focused={s.pop && s.pay === "idle"}
          className="sh-field"
          leading={<MdLink size={15} />}
        />
        <div className="sh-pop-foot">
          <Bar w={120} h={6} tone={2} />
          <Button variant="primary" size="large" className="sh-shorten" data-target="shorten">
            <States
              value={s.pay}
              states={{
                idle: "Shorten",
                busy: <Spinner />,
                done: (
                  <span className="sh-done">
                    <MdCheck size={14} /> Created
                  </span>
                ),
              }}
            />
          </Button>
        </div>
      </div>
    </Popover>
  );
}

export default function HeroDemo() {
  return (
    <Stage<S>
      width={1040}
      height={520}
      compact={{ below: 780, width: 358, height: 340 }}
      initial={initial}
      poster={POSTER}
      play="once"
      script={script}
      cursor={{ at: REST }}
      className="shrnk-look sh-hero"
    >
      {(s, _rect, layout) => {
        const wide = layout === "wide";
        const clicks = steps[s.step]!;
        return (
          <>
            <div className="sh-mask">
              <Window url={DOMAIN + "/x"} urlShape="pill" className="sh-window">
                <div className="sh-app">
                  {wide && <Sidebar />}
                  <div className="sh-main">
                    <div className="sh-head">
                      <div className="sh-heading">Links</div>
                      <div className="sh-tools">
                        {wide && (
                          <span className="sh-search" aria-hidden>
                            <MdSearch size={16} />
                            <Bar w={86} h={6} tone={2} />
                          </span>
                        )}
                        <Button
                          variant="primary"
                          size="large"
                          data-target="new"
                          data-open={s.pop || undefined}
                          icon={<MdAdd size={16} />}
                          className="sh-new"
                        >
                          New link
                        </Button>
                      </div>
                    </div>
                    <div className="sh-list">
                      <Collapse open={s.added} reveal="drop">
                        <div className="sh-slot">
                          <LinkRow slug={NEW_SLUG} dest={TYPED} clicks={clicks} layout={layout} fresh copied={s.copied} />
                        </div>
                      </Collapse>
                      {OLD.map((l) => (
                        <LinkRow key={l.slug} slug={l.slug} dest={l.dest} clicks={l.clicks} layout={layout} />
                      ))}
                      {FILLER.map(([x, y], i) => (
                        <FillerRow key={i} a={x!} b={y!} layout={layout} />
                      ))}
                    </div>
                    <Shortener s={s} />
                  </div>
                </div>
              </Window>
            </div>
            {wide && <Analytics s={s} />}
            <span className="sh-watch" data-target="watch" />
          </>
        );
      }}
    </Stage>
  );
}
