# Pricing demo: rehearsal notes

What was checked on the "What Pro unlocks" demo (`UpgradeDemo.tsx`) before
handover, and what wasn't.

## The demo

It plays once as it scrolls into view, with no Replay button. It starts from
the stageshow gold `stacked-cards`: a plan card over the analytics card it
gates, one width and left edge, the lower card off the stage's bottom edge.
The story has four beats:

1. Upgrade is pressed, and the button works and then reads "On Pro".
2. Name and price roll, and the link limit rolls from 10 to 1,010 while the
   nearly full amber meter eases down.
3. The locks on the longer ranges close up.
4. "All time" is picked, the highlight slides, and the chart and total ease
   to the full history.

The numbers match the app. Free has 10 link credits and 30 days of
analytics. Pro adds 1,000 credits and every range (`api/link`,
`api/linkStats`). The price reads $4.99 per month, as the owner chose. PayPal
currently charges a one-time $5.00, which `PaymentCloseDraw.tsx` still does.

## Captured

- `film.mjs --gate` at 1280 and 390, covering every state (`--states`) and the
  full run, filmed against `next dev`.
- Reduced-motion poster at 1280.
- Full page at 1440 and 390, and the comparison table at 390.
- `tsc --noEmit`, `next lint` and a clean `next build` pass.

## Fixed during rehearsal

- The side gutters (70px) didn't match the top (48px). The stack is now one
  gutter in on the top and both sides.
- The lock icons sat 4px from their labels, which the check reads as
  touching. They're now 6px.
- On phones the 358px compact design was scaled into a 325px slot. Compact
  is now designed at 326px, with 30d, 90d, 1y and All as range labels.
- After the upgrade the top card grew 3px, because the Pro price and the
  "On Pro" button overflowed. The stack column is now locked
  (`minmax(0, 1fr)`) and the compact spacing is tighter.

## Known gate lines (not visible faults)

The gate ends `rehearsal failed: 7`:

- **6 × `kit override: .ss-row…`:** the kit's own `Row.css` inside Next's
  single CSS bundle, the same as on the homepage (see
  `src/components/home/REHEARSAL.md`).
- **1 × `uneven gutters`:** the check walks past the unpainted stack wrapper
  and measures the top card against the stage's bottom edge. The gold
  `stacked-cards` trips the identical line (`section.sk-card` 90/90/225px,
  filmed in the stageshow preview), so it is a limit of the check for this
  layout.

These candidates were judged and left as they are:

- A `settle snap` of 220px is the kit `Count` resetting its digit strip after
  a roll. The glyph is the same, so nothing visible moves.
- A one-frame `ss-chart__dot` jump at about 1.2s comes from the chart's own
  first draw.

## Not checked

- Production (`next start`) filming of this demo. Only the dev build was
  filmed, though the production build passes.
- Touch devices and real-device frame pacing. Only headless Chrome on
  Windows was used.
- The PayPal drawer flow end to end. Only its trigger button and benefit copy
  changed.
