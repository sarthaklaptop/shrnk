# Homepage demos: rehearsal notes

What was checked on the stageshow demos in this folder before the homepage
revamp was handed over, and what wasn't.

## The demos

| Demo | File | Started from (stageshow gold) |
|---|---|---|
| Hero: the Links dashboard, New link → Shorten → Copy → clicks arrive | `HeroDemo.tsx` | `hero-demo` (beats, named targets, satellite) and `fade-crop` (window fading at its foot on a white page) |
| Features grid: analytics, free plan, password, QR, tags | `FeatureBento.tsx` | `bento` (hero and strip, one Stage per tile, once on scroll-in) |

The look is in `shrnk-look.css` (Shrnk red, Geist, the app's neutral grays and
radii). The kit is vendored in `src/components/stageshow/kit`. Components
import it through `src/components/stageshow/index.ts`, which loads only the
parts in use, so the kit's phone, keyboard and message CSS never ship.

## Captured

- Hero, `play="once"` with a Replay button: whole run filmed at 1280 and 390
  with `film.mjs --gate`, against `next dev` and `next start` (production).
  `--states`, a slowed film of the analytics-card switch, a zoom of the list,
  and the reduced-motion poster.
- Grid: poster at 1280, the once-played motion at 1280, and tiles at 390.
- `tsc --noEmit`, `next lint` and `next build` all pass.

## Fixed during rehearsal

- Placeholder rows were 86px against 68px for real rows. They now use the real
  rows' line boxes.
- The analytics number clipped its second digit inside `Swap`. It now uses
  `States`, which holds the wider "1,284" box.
- The new link's count moved its pill in one frame going from 1 to 2 digits.
  It now uses `Roll`, which eases the width.
- The copy icon swapped with no transition. It now crossfades through `States`.
- The cursor covered "New link" and "Copy" when clicking. Clicks now land on
  each button's lower-right corner.
- The stage slid 24px during the page's entrance, so its text stepped. It now
  only fades in.
- The compact window was taller than wide. The stage is now 358×340.
- The typed URL overflowed the compact field. It is now shorter.
- The Meter gradient was purple (the kit's `--ss-accent-2`). It is now red.
- The tag chip's icon wrapped above its label. The label is now inline-flex.
- Every panel's top gutter is now 24px.

## Known gate lines (not visible faults)

`--gate` still ends `rehearsal failed: 6`, all `kit override: .ss-row…`. These
are the kit's own `Row.css` rules. Next bundles every stylesheet into
`/_next/static/css/…`, and the check only exempts sheets whose URL contains
`/kit/`, so it attributes them to the demo. None of the homepage CSS targets
`.ss-row`: `grep "\.ss-" src/components/home/*.css` lists every kit selector
used, and each one is a color, background, transition delay or stage-scoped
layout.

These candidates were judged and left as they are:

- Button press feedback (2 to 3px in one frame on click).
- Kit `Field` typing growth.
- "Appears with no entrance" on `States` items, which crossfade in the kit.

## Not checked

- Dark mode: the site has no dark theme on the homepage.
- Touch devices and real-device frame pacing. Only headless Chrome on Windows
  was used.
- Widths between 780 and 1040, where the wide hero scales down to about 0.75
  at its smallest. Below 780 the compact design shows instead, centered at
  1:1. Neither the scaled range nor a tablet in between was filmed.
- The Replay button mid-run, and returning to the page from a background tab.
