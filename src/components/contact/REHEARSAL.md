# Contact demo: rehearsal notes

`ComposeDemo.tsx` shows what a useful message to Shrnk looks like, written in
front of the reader. It plays once in view. The layout is a corner bleed: a
compose window inset one gutter top and left in a quiet well, running off the
right and bottom. It starts from the gold `hero-demo` (a typed popup and named
targets) with the framing of `static-card`.

1. The subject types: "Short link not redirecting".
2. The body types: the short link, then what went wrong. The body holds its
   finished height from the first keystroke.
3. The cursor clicks the paper clip, and "screenshot.png" opens its own width
   beside it (kit `Chip`), so nothing moves.
4. Send: the button spins, then reads "Sent" on itself.

The address is the real one, `shrnk.contact@gmail.com`, the only channel the
app has (there is no contact API).

## Captured

- `film.mjs --gate` at 1280 and 390, covering every state (`--states`) and
  the full run, against `next dev`.
- The full page at 1440 and 390.
- `tsc --noEmit` and `next lint` pass. `next build` was not run, because the
  owner's dev server was using `.next`.

## Fixed during rehearsal

- The "To" and "Subject" lines, body and footer read as a loose list. The two
  lines are now one group.
- The attachment pushed the Send row down as it arrived. It now opens in the
  Send row.
- The subject jumped 2.5px when the caret left it. The caret now keeps its
  width and only fades.
- On phones the window was taller than it was wide. The compact stage is now
  326 by 320.
- About 100px of blank window sat under Send on desktop. The stage is now
  360px tall.
- The tick in "Sent" and the arrow in "Send" sat on half pixels. Each label
  now gets an even width.

## Known gate lines

- 6 × `kit override: .ss-row…`: the same Next.js CSS-bundling false positive
  as on the other pages.
- One candidate at 390 (`steps in its box` on the address pill) is the stage
  settling its scale on load, not the story.

## Not checked

- Production filming.
- Touch devices.
- That each `mailto:` link opens the right subject in every mail client.
  Only the generated URLs were checked.
