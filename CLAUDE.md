# Tasty Gyros — concept landing page

A speculative redesign of the **Tasty Gyros London** website, built by **Laara Digital**
as a client-facing demo. It is *not* the live business site, and it must never be
mistaken for it or compete with it.

Live demo: https://laaradigital.co.uk/tasty-gyros-demo/
Real business site (source of all facts): https://www.tastygyros.co.uk/

---

## Content integrity — the rules that outrank everything else

This site presents a real trading business. Every factual statement on the page must
trace back to something Tasty Gyros actually published. When in doubt, omit the claim
rather than soften it.

- **Never invent** founding dates, family history, awards, sourcing claims, star
  ratings, order counts, certifications, dietary claims, discounts, countdowns or
  limited-time offers.
- **Never label a dish** "best seller" or "customer favourite" — there is no evidence.
  The `shout` line in `src/data/dishes.js` describes the dish and nothing else.
- **No prices.** They are not published on the source site and vary by branch.
- **No fake cart or checkout.** Ordering always hands off to the branch's real Toast
  URL, clearly labelled as leaving the site.
- **Never auto-open** the branch dialog on first visit, and never request geolocation.
- **Verify destinations, not labels.** The source site contains mistakes: its nav says
  "Notting Hiil" (corrected here), and its Notting Hill order link 301s to a different
  host than it appears to. Follow redirects before trusting a URL.
- **Keep `noindex, nofollow`** in `index.html`, the canonical pointing at
  tastygyros.co.uk, and `public/robots.txt` disallowing everything.
- **No Restaurant JSON-LD.** A noindexed demo must not publish business structured data.
- Provenance is recorded in comments at the top of `src/data/locations.js`,
  `src/data/dishes.js` and `src/data/reviews.js`. **Update those comments whenever the
  data changes.**

### Known conflict, deliberately resolved
The source contact page states Notting Hill hours twice and disagrees with itself
(11:00–23:00 in the branch panel, 11:00–22:00 in the footer). The footer figure is used
for both branches because it is the one stated consistently, and copy points visitors at
the live menu rather than presenting hours as guaranteed.

### Outstanding gap — read before touching the Reviews section
`src/components/Reviews.jsx` renders **placeholder quotes written for this concept**.
Every card is sourced "Sample · …" and the section states in plain copy underneath that
the quotes were written, not collected. That is honest but temporary: before anything
resembling production, replace `src/data/reviews.js` with verified reviews (Google
Places API or a verified export) carrying real rating, author and source — or delete the
section. Do not quietly remove the disclaimer while keeping the invented quotes.

---

## Stack and commands

React 18 + Vite 5. No framework, no CSS library, no state manager — plain CSS with custom
properties, and `sharp` for the image pipeline. Node 20.

```bash
npm run dev              # http://localhost:5173/
npm run build            # vite build + scripts/postbuild.mjs
npm run preview          # serves dist/
npm run optimize:images  # regenerate WebP renditions + manifest from scripts/source/
npm run deploy           # build, then push dist/ to the gh-pages branch
```

`npm run build` is the check to run before claiming anything works. There is no test
suite and no linter configured.

## Deploy

GitHub Pages on the custom domain `laaradigital.co.uk` (the user's agency domain, set on
their *user* Pages site, so every project repo inherits the path). Deploys go through
`npm run deploy`, **not** CI: `.github/workflows/deploy.yml` exists on disk but is
gitignored, because the `gh` token in use lacks `workflow` scope and GitHub rejects any
push that touches it. To move to CI: `gh auth refresh -s workflow`, drop that
`.gitignore` line, commit the file.

`vite.config.js` sets `base: './'` so the build works on any Pages subpath.
`scripts/postbuild.mjs` writes `dist/404.html` and ensures `.nojekyll` — Pages needs both.

Screen recordings and screenshots of third-party reference sites sit in the project root
and are gitignored. Not ours to redistribute.

---

## Architecture

```
index.html            head, font preloads, noscript fallback (both branches' real details)
src/main.jsx          mounts App — imports index.css FIRST (see Gotchas)
src/App.jsx           the whole page order
src/index.css         the design system: tokens, grounds, buttons, kicker, reveal
src/components/       one .jsx + one .css per section, colocated
src/data/             all copy and facts, with provenance comments
src/lib/              img() helper + useReveal / useFocusTrap / useScrollLock
scripts/source/       original brand photography (input to the pipeline)
src/assets/images/    generated WebP renditions + manifest.json (do not hand-edit)
```

**Page order and colour rhythm** (`src/App.jsx`) — full-width ground changes are the
structural device, so keep them alternating:

Hero *blue* → BrandStrip *lemon* → Showcase *warm* → Feature *deep blue* →
Story *cream* → Namesake *ink blue* → Gallery *warm* → Reviews *cream* → Locations *red* →
FinalCta *lemon* → Footer *ink*

`Namesake` is the shopfront fascia carrying the brand name. It sits on `--blue-ink` —
the only section that does — both to break the long cream→warm→cream run and because
the lemon signage needs the darkest ground in the palette to read as lit.

**Ordering flow.** `OrderModalProvider` wraps the app and owns the single dialog. Any
component calls `useOrderModal()` to open it; `BranchPicker` renders the two branches
inside it. There is exactly one ordering path — do not add a second.

## Design system

Defined entirely in `src/index.css`. Read the token block before adding any colour.

- **Palette:** `--blue #0755d9` (Greek blue) · `--blue-deep` · `--blue-ink` ·
  `--warm #fff9ef` · `--cream` · `--lemon #ffd43b` · `--tomato #ef4936` · `--ink`.
- **The contrast-safe variants exist for a reason.** `--tomato` (3.5:1) is for
  display-size fills only; small red text uses `--tomato-ink`. Lemon text on blue uses
  `--lemon-text`, not `--lemon`. Check any new pairing against WCAG AA before shipping it.
- **Two typefaces only:** `Big Shoulders Display` for anything that shouts, `Figtree` for
  anything you actually read. Both self-hosted, latin subset, variable, in
  `public/fonts/`. Do not add a third face and do not load fonts from a CDN.
- **Ground classes** `.on-blue .on-deep .on-warm .on-cream .on-lemon` set background,
  text and focus-ring colour together. Use them rather than per-section colour rules.
- **Signature details:** crisp offset shadows (`--offset`, never a soft blur), 2.5–3px
  ink borders, slight rotations via `.tilt-a` / `.tilt-b`, and the original graphic set in
  `Graphics.jsx` — `Starburst`, `BurstCard`, `MeanderRule` (Greek key), `Arrow`, `Doodle`.
  All are `aria-hidden`; food stays the main attraction.

### Photography

Every product shot from the client sits on a white studio sweep. A true alpha cutout is
**not possible** with these sources — the paper wrapper is neutral grey at the same
luminance as the backdrop, so no colour key separates them without eating the food.
Instead: `liftSweep()` in `scripts/optimize-images.mjs` lifts only bright, unsaturated
pixels to white, and `.food-float { mix-blend-mode: multiply }` drops that white into the
light ground. The dish reads as an isolated cutout **with no pixel of the food altered**.
`.food-float` only works on light grounds — never over blue; the hero puts the food in a
warm-white arch instead. Crops in the pipeline manifest are framing decisions only:
nothing is retouched, recoloured or composited.

To change imagery: edit `MANIFEST` in `scripts/optimize-images.mjs`, run
`npm run optimize:images`, then reference the output key through `img(key, sizes)` from
`src/lib/images.js` — it returns `src` / `srcSet` / `sizes` / `width` / `height` /
`aspectRatio`, so every image ships with explicit dimensions. `manifest.json` is
generated; never edit it by hand.

There is **no branch or storefront photography** in the assets. Each location card pairs
the branch with a real dish rather than a stand-in facade or a decorative map. If
shopfront photos arrive, `loc-enfield` / `loc-notting-hill` in the manifest is where they
go.

## Motion and accessibility

Both are structural here, not polish. Anything added has to keep them true.

- The hero entrance is **pure CSS**, so it plays even if JS never arrives. Scroll reveals
  use `IntersectionObserver` via `useReveal()`.
- **Nothing moves on its own except the brand strip**, which pauses on hover/focus and
  has an explicit toggle. The showcase carousel has **no timers** — slides never
  auto-advance.
- Honour `prefers-reduced-motion` in **both** CSS and JS (`matchMedia`). Under reduced
  motion the strip becomes static and its pause button is not rendered at all.
- No scroll hijacking, custom cursors, parallax or continuous bouncing.
- One H1. Semantic sections with `aria-labelledby`. Meaningful `alt` on every image.
- Dialogs: `role="dialog" aria-modal="true"`, `useFocusTrap` + `useScrollLock`, Escape
  closes, focus returns to the trigger.
- Touch targets 44px or larger. The only exceptions are links inside sentences, which
  WCAG 2.5.8 exempts.
- `StickyOrderBar` is mobile-only and must never cover content — the footer reserves
  `calc(76px + env(safe-area-inset-bottom))` below 900px. It toggles with `aria-hidden` +
  `tabIndex`, never `hidden` or `display: none`, which would kill the transition.

## Gotchas that have already cost time

1. **`main.jsx` imports `index.css` before `App.jsx`.** Reversing it puts the base `.btn`
   and `.container` rules last in the bundle, where they start beating the component
   styles meant to override them. This silently broke the mobile header. Leave it.
2. **A component owns its CSS.** Import `Foo.css` from `Foo.jsx`, not from `App.jsx` —
   import order in the module graph *is* cascade order. `Graphics.css` imported late made
   `.burst { position: relative }` beat `.dish__burst { position: absolute }` and broke
   the showcase grid.
3. **Watch specificity on ground-level rules.** `.locs h3 { color: var(--warm) }` (0,1,1)
   beat `.loc__name { color: var(--ink) }` (0,1,0) and painted both branch headings
   invisible on a light card. Scope section rules to a class, not a tag.
4. **Never select on `[style*='...']` for grid areas** — the inline value `grid-area: …`
   contains most letters, so `[style*='a']` matches every tile. The gallery uses
   `is-${area}` classNames instead.
5. React 18 wants lowercase `fetchpriority` on `<img>`, not `fetchPriority`.
6. Carousel dot tracking measures each slide's real `offsetLeft`; fractions of
   `clientWidth` drift once padding and gaps are involved.

## Working conventions

- Match the surrounding code: plain CSS with tokens, colocated files, and comments that
  explain *why* a constraint exists — especially the content-integrity ones — rather than
  what the code does.
- Verify in a real browser at 375 / 390 / 768 / 1024 / 1440. Check for horizontal
  overflow, clipped headlines and console errors at every width.
- Do not claim a check passed unless it was actually run.
