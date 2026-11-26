"use client";

import { MdBolt, MdCheck, MdLock } from "react-icons/md";
import {
  Button,
  Chart,
  Count,
  Meter,
  Roll,
  Segmented,
  Spinner,
  Stage,
  States,
  Text,
  type Act,
} from "@/components/stageshow";
import "@/components/home/shrnk-look.css";
import "./upgrade-demo.css";

// What Pro unlocks, after the stacked-cards gold: a plan card over the
// analytics it gates, one width, one left edge, the lower card off the
// bottom. Beats:
//   1. Upgrade is pressed; the button works, then says Pro on itself.
//   2. The plan card turns Pro: name and price roll, the link limit rolls
//      from 10 to 1,010 and the nearly full meter eases down.
//   3. The locks on the longer ranges close up, one after another.
//   4. All time is picked; the highlight slides and the chart and the total
//      ease to the whole history. Plays once; the still is the payoff.
//
// Real strings: the plan and its price, Upgrade, the link usage, Clicks,
// the four ranges and the total. These numbers follow the app: Free has 10
// links and 30 days of history, Pro adds 1,000 links and every range.

type Pay = "idle" | "busy" | "done";
type S = { pay: Pay; pro: boolean; unlocked: boolean; range: number };

const initial: S = { pay: "idle", pro: false, unlocked: false, range: 0 };
const POSTER: S = { pay: "done", pro: true, unlocked: true, range: 3 };

const RANGES = ["30 days", "90 days", "1 year", "All time"];
const SHORT = ["30d", "90d", "1y", "All"];
// The same 24 points either way, so the chart eases between them
const MONTH = [30, 34, 31, 38, 36, 42, 40, 47, 44, 52, 49, 55, 51, 58, 56, 61, 57, 64, 60, 68, 65, 71, 69, 76];
const ALL = [4, 6, 8, 9, 12, 15, 14, 19, 22, 21, 27, 31, 30, 36, 41, 39, 46, 52, 50, 58, 63, 61, 70, 78];
const TOTAL = [1284, 2911, 6040, 8930];

async function script(a: Act<S>) {
  await a.wait(800);

  a.mark("upgrade");
  await a.click({ at: "upgrade", x: 0.9, y: 0.82 });
  await a.set({ pay: "busy" });
  await a.wait(900);
  await a.set({ pay: "done", pro: true });
  await a.wait(700);
  await a.set({ unlocked: true });
  await a.wait(1100);

  a.mark("range");
  await a.click({ at: "range-3", x: 0.88, y: 0.8 });
  await a.set({ range: 3 });
  await a.move("rest");
  await a.wait(2400);
}

const REST = { wide: { x: 452, y: 232 }, compact: { x: 290, y: 236 } };

export default function UpgradeDemo() {
  return (
    <Stage<S>
      width={520}
      height={430}
      compact={{ below: 520, width: 326, height: 400 }}
      initial={initial}
      poster={POSTER}
      play="once"
      script={script}
      cursor={{ at: REST }}
      className="shrnk-look up-demo"
    >
      {(s, _rect, layout) => (
        <>
          <div className="up-stack">
            <section className="up-card">
              <div className="up-plan">
                <span className="up-mark" data-pro={s.pro || undefined}>
                  <MdBolt size={16} />
                </span>
                <div className="up-who">
                  <Roll variant="fade" className="up-name">{s.pro ? "Pro plan" : "Free plan"}</Roll>
                  <Roll variant="fade" className="up-sub">{s.pro ? "$4.99 per month" : "$0 per month"}</Roll>
                </div>
                <Button
                  variant={s.pay === "done" ? "secondary" : "primary"}
                  size="large"
                  className="up-btn"
                  data-target="upgrade"
                >
                  <States
                    value={s.pay}
                    states={{
                      idle: "Upgrade",
                      busy: <Spinner />,
                      done: (
                        <span className="up-inline">
                          <MdCheck size={14} /> On Pro
                        </span>
                      ),
                    }}
                  />
                </Button>
              </div>
              <div className="up-usage">
                <Text className="up-label">Short links</Text>
                <Roll align="end" className="up-value">{s.pro ? "9 of 1,010" : "9 of 10"}</Roll>
              </div>
              <Meter value={s.pro ? 9 / 1010 : 0.9} tone={s.pro ? "accent" : "warning"} />
            </section>

            <section className="up-card up-card--chart">
              <div className="up-chart-head">
                <Text className="up-label">Clicks</Text>
                <span className="up-total">
                  <Count value={TOTAL[s.range]!} duration={700} />
                </span>
              </div>
              <Segmented
                className="up-seg"
                value={s.range}
                targets={RANGES.map((_, i) => `range-${i}`)}
                items={RANGES.map((r, i) => (
                  <span key={r} className="up-range" data-locked={(i > 0 && !s.unlocked) || undefined} style={{ transitionDelay: `${i * 80}ms` }}>
                    <span className="up-lock" style={{ transitionDelay: `${i * 80}ms` }}>
                      <MdLock size={11} />
                    </span>
                    {layout === "compact" ? SHORT[i] : r}
                  </span>
                ))}
              />
              <Chart
                data={s.range === 3 ? ALL : MONTH}
                width={layout === "compact" ? 242 : 384}
                height={120}
                className="up-chart"
              />
            </section>
          </div>
          <span data-target="rest" style={{ position: "absolute", left: REST[layout].x, top: REST[layout].y }} />
        </>
      )}
    </Stage>
  );
}
