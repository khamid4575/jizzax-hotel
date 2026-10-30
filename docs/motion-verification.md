# Motion homepage — verification

Checked locally on 30 October 2026 against the production build (`next build` + `next start`). Homepage only; no deployment or booking changes.

## Automated checks

- `npm run typecheck`: passed.
- `npm test`: 5/5 passed (official booking mappings, room categories, local WebP assets, GSAP archive integrity, core contrast).
- `npm run build`: passed; `/`, `robots.txt` and `sitemap.xml` prerender as static.
- `scripts/browser-check.mjs` (headless Chromium, real mouse-wheel input through Lenis): **36/36 passed**. Report: `test-results/motion/browser-report.json`.
  - Hero: arch entrance settles, title characters settle, rosette fully drawn, scroll opens the arch.
  - Four desktop pins (hero, lobby, story, gallery); inline headline photos open; lobby panels travel then lock; lobby frame stays contained.
  - Story swaps chapters; all eight rooms show their official booking URL; Deluxe filter shows two rooms; gallery moves sideways.
  - Menu opens with focus inside, Escape closes and restores focus; lightbox keyboard navigation, Escape and focus restoration.
  - Mobile (390×844, touch): no pins, story cards stack. No horizontal overflow at 320/390/768/1440px.
  - Reduced motion: no Lenis, no pins, content visible, native gallery scroll. No JavaScript: headline and all eight booking links are server-rendered.
  - No page exceptions; no runtime requests to external origins (fonts are self-hosted by `next/font`).
- Frame rate sampled while the lobby assembles during smooth scrolling: **~55 fps** (headless Chromium, desktop, no CPU throttling).

## Visual inspection

Desktop (1440×900) and mobile (390×844, 4× CPU throttling, Fast 4G) were inspected in Chrome DevTools, with values measured mid-animation (arch clip, chip clips, panel offsets, room wipe, menu circle). Screenshots and recordings are in `test-results/motion/` (`desktop-walkthrough.webm`; `desktop-hero-scroll.mp4` shows the earlier v1 hero).

## Not verified

- Real-device performance. The DevTools-controlled window was throttled to ~2 fps on every section, so only the headless measurement above is meaningful.
- Safari, Firefox and physical phones. Touch gestures were emulated.
- A full WCAG 2.2 audit, Lighthouse scores and field Core Web Vitals.
