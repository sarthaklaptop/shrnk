# About demo: rehearsal notes

`ClickJourney.tsx` is a system story with no cursor. It shows what
`src/app/[shortLink]/route.ts` does when someone opens a short link, and plays
once in view:

1. A GET line draws from the visitor's browser to Shrnk.
2. Three checks tick in turn: Link found, Not expired, No password.
3. A 307 line draws back, and the same browser's address rolls from
   `shrnk-six.vercel.app/hN3xQe` to `acme.dev/pricing` as the page fades in.
4. A dashed line carries the click to the analytics card, where the new row
   (Pune, India · Mobile · Chrome) drops in and the count rolls from 1,284 to
   1,285.

It started from the gold `payout-flow` (overlapping arrivals with no cursor)
and the connector work in `story`. On phones the compact layout stacks the
three objects top to bottom, with vertical lines.

## Captured

- `film.mjs --gate` at 1280 and 390: `--states` and the full run, against
  `next dev`.
- Reduced-motion posters at both widths.
- The full page at 1440.
- `tsc --noEmit` and `next lint` pass. `next build` was not run, because the
  owner's dev server was using `.next`.

## Fixed during rehearsal

- The GET and 307 lines started from points down the browser's full height
  and ran diagonally. Both now run level with Shrnk's card.
- The browser was narrower than it was tall. All three objects are now whole,
  with one gutter.
- The analytics rows overflowed a fixed-height card. The card now sizes to
  its rows.
- "now" touched the edge of its row. The rows now use the kit's 10px pad.
- The row dividers curved at their ends, so the rows are now square.
- The destination page's text hopped as its rise landed. It now has a lasting
  layer.
- On phones the analytics card ran 7px past the stage. The stage now leaves a
  full gutter.

## Known gate lines

- **6 × `kit override: .ss-row…`:** the same Next.js CSS-bundling false
  positive as on the homepage and pricing page.
- **`framing:` and `uneven gutters` on the browser window and the cards:**
  these rules are written for a product shot, where one hero window bleeds
  off an edge. This is a three-node diagram, so each node is whole and the
  gutters are even. That was a deliberate choice, not an oversight.

## Not checked

- Production filming.
- Touch devices.
- Widths between 720 and 960, where the wide diagram scales down to about
  0.75.
