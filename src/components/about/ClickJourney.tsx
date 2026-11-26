"use client";

import { CircleFlag } from "react-circle-flags";
import {
  Bar,
  Check,
  Collapse,
  Connector,
  Count,
  Roll,
  Row,
  Spinner,
  Stage,
  Text,
  Window,
  type Act,
  type Rect,
} from "@/components/stageshow";
import "@/components/home/shrnk-look.css";
import "./click-journey.css";

// What happens when someone opens a short link, as src/app/[shortLink]/route.ts
// does it. A system story, no cursor (motion.md, Story):
//   1. The visitor's browser asks for /hN3xQe: a request line draws to Shrnk.
//   2. Shrnk checks the link: found, not expired, no password. Each tick is
//      one Check going from pending to done.
//   3. The 307 comes back on its own line, and the same browser's address
//      rolls to the destination as the page fades in. One browser, kept.
//   4. In the background the click is logged: a line to the analytics card,
//      the new row drops in at the top and the count rolls up by one.
// Plays once in view; the poster is the payoff.
//
// Real strings: the short and the long address, the three checks, 307, the
// count, and the new click's place and device. The rest is bars.

type S = { req: boolean; checks: number; res: boolean; landed: boolean; logged: boolean };

const initial: S = { req: false, checks: 0, res: false, landed: false, logged: false };
const POSTER: S = { req: true, checks: 3, res: true, landed: true, logged: true };

const CHECKS = ["Link found", "Not expired", "No password"];

async function script(a: Act<S>) {
  await a.wait(700);
  a.mark("request");
  await a.set({ req: true });
  await a.wait(800);

  a.mark("checks");
  for (let i = 1; i <= CHECKS.length; i++) {
    await a.set({ checks: i });
    await a.wait(420);
  }
  await a.wait(250);

  a.mark("redirect");
  await a.set({ res: true });
  await a.wait(550);
  await a.set({ landed: true });
  await a.wait(500);

  a.mark("logged");
  await a.set({ logged: true });
  await a.wait(2800);
}

// A point on a rect's edge, `t` of the way along it
const right = (r: Rect, t: number) => ({ x: r.x + r.width, y: r.y + r.height * t });
const left = (r: Rect, t: number) => ({ x: r.x, y: r.y + r.height * t });
const bottom = (r: Rect, t: number) => ({ x: r.x + r.width * t, y: r.y + r.height });
const top = (r: Rect, t: number) => ({ x: r.x + r.width * t, y: r.y });

export default function ClickJourney() {
  return (
    <Stage<S>
      width={960}
      height={340}
      compact={{ below: 720, width: 326, height: 734 }}
      initial={initial}
      poster={POSTER}
      play="once"
      script={script}
      className="shrnk-look cj"
    >
      {(s, rect, layout) => {
        const wide = layout === "wide";
        const browser = rect("browser");
        const shrnk = rect("shrnk");
        const stats = rect("stats");
        const ready = browser.width > 0 && shrnk.width > 0 && stats.width > 0;
        return (
          <>
            {/* The visitor's browser: the same window before and after the redirect */}
            <Window
              data-target="browser"
              className="cj-browser"
              urlShape="pill"
              url={<Roll variant="fade">{s.landed ? "acme.dev/pricing" : "shrnk-six.vercel.app/hN3xQe"}</Roll>}
            >
              <div className="cj-page">
                <div className="cj-loading" data-on={!s.landed || undefined}>
                  <Spinner />
                </div>
                <div className="cj-site" data-on={s.landed || undefined}>
                  <Text className="cj-site-title">Pricing</Text>
                  <Bar w={168} h={7} tone={2} />
                  <Bar w={132} h={7} tone={2} />
                  <div className="cj-site-cards">
                    <span className="cj-site-card">
                      <Bar w={40} h={6} tone={3} />
                      <Bar w={56} h={14} r={4} tone={4} />
                    </span>
                    <span className="cj-site-card">
                      <Bar w={44} h={6} tone={3} />
                      <Bar w={50} h={14} r={4} tone={4} />
                    </span>
                  </div>
                </div>
              </div>
            </Window>

            {/* Shrnk's redirect: the checks the route makes */}
            <div className="cj-card cj-shrnk" data-target="shrnk">
              <div className="cj-card-head">
                <span className="cj-wordmark">Shrnk</span>
                <Text className="cj-path">/hN3xQe</Text>
              </div>
              {CHECKS.map((c, i) => (
                <div key={c} className="cj-check" data-on={s.checks > i || undefined}>
                  <Check on={s.checks > i} pending={s.req && s.checks === i} size={16} />
                  <Text className="cj-check-label">{c}</Text>
                </div>
              ))}
            </div>

            {/* The analytics card the click lands in */}
            <div className="cj-card cj-stats" data-target="stats">
              <div className="cj-card-head">
                <Text className="cj-label">Clicks</Text>
                <span className="cj-count">
                  <Count value={s.logged ? 1285 : 1284} duration={600} />
                </span>
              </div>
              <div className="cj-list">
                <Collapse open={s.logged} reveal="drop">
                  <Row
                    pad={10}
                    className="cj-row cj-row--new"
                    lead={<CircleFlag countryCode="in" height={20} width={20} className="cj-flag" />}
                    title={<Text className="cj-row-title">Pune, India</Text>}
                    subtitle={<Text className="cj-row-sub">Mobile · Chrome</Text>}
                    meta={<Text className="cj-row-time">now</Text>}
                  />
                </Collapse>
                {[
                  [72, 58],
                  [64, 70],
                ].map(([a, b], i) => (
                  <Row
                    key={i}
                    pad={10}
                    className="cj-row"
                    lead={<Bar w={20} h={20} r={10} tone={2} />}
                    title={<span className="cj-line cj-line--title"><Bar w={a!} h={6} tone={3} /></span>}
                    subtitle={<span className="cj-line cj-line--sub"><Bar w={b!} h={5} tone={2} /></span>}
                    meta={<span className="cj-line cj-line--title"><Bar w={22} h={5} tone={2} /></span>}
                  />
                ))}
              </div>
            </div>

            {ready && wide && (
              <>
                <Connector show={s.req} route="straight" arrow label="GET" from={{ x: browser.x + browser.width, y: left(shrnk, 0.3).y }} to={left(shrnk, 0.3)} className="cj-line-req" />
                <Connector show={s.res} route="straight" arrow label="307" from={left(shrnk, 0.75)} to={{ x: browser.x + browser.width, y: left(shrnk, 0.75).y }} className="cj-line-res" />
                <Connector show={s.logged} route="step" dashed from={right(shrnk, 0.5)} to={{ x: stats.x, y: stats.y + 98 }} className="cj-line-log" />
              </>
            )}
            {ready && !wide && (
              <>
                <Connector show={s.req} route="straight" arrow label="GET" from={bottom(browser, 0.3)} to={{ x: bottom(browser, 0.3).x, y: shrnk.y }} className="cj-line-req" />
                <Connector show={s.res} route="straight" arrow label="307" from={top(shrnk, 0.7)} to={{ x: top(shrnk, 0.7).x, y: browser.y + browser.height }} className="cj-line-res" />
                <Connector show={s.logged} route="straight" dashed from={bottom(shrnk, 0.5)} to={top(stats, 0.5)} className="cj-line-log" />
              </>
            )}
          </>
        );
      }}
    </Stage>
  );
}
