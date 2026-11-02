# Jizzax Hotel — Phase 2 homepage

Next.js App Router, React and TypeScript. Homepage only; booking remains on the existing official system.

```sh
npm install
npm run dev
```

On Windows with PowerShell script restrictions use `npm.cmd`. Node 24 is recommended for the native TypeScript test runner.

```sh
npm run typecheck
npm test
npm run build
npm start
```

## Branding and assets

The actual logo and 13 photographs were exported from [Jizzax Hotel's public website](https://jizzaxhotel.uz/). They live in `public/img/`; no placeholder or unrelated hotel photos are used. `public/asset-manifest.json` records provenance and hashes. `src/lib/hotel.ts` preserves all eight original English booking URLs and room IDs, while room photos are matched to the current official homepage's categories.

The official CSS variables are saved in `docs/official-brand-variables.css`. Verified source colors are button blue **#0976B3** and decorative blue **#0762B7**. Navy **#071D35**, ice **#B8DFF1** and cloud **#F4F9FC** are supporting choices, not claimed official brand values. The original logo is used without recoloring. Typography uses local system font stacks, with no Google Fonts request.

## Motion and interaction

Stack: GSAP 3.13 (ScrollTrigger, SplitText, Flip), Lenis 1.3 for wheel smoothing (touch keeps native scrolling), Motion 14 for UI springs, Tailwind 4 for tokens. Every component scopes its animations in `useGsap` (`src/hooks/use-gsap.ts`), a GSAP context plus matchMedia that is reverted on unmount. Desktop (≥1000×560) and compact screens get separate compositions; reduced motion matches neither and gets the static layout.

- **Hero — the arch window.** A girih rosette draws itself, the facade rises into a peshtaq-shaped arch, and the title arrives character by character. Scrolling (pinned on desktop) opens the arch to a full-bleed facade.
- **01 Manifesto.** Photographs open inside the headline, the paragraph ink-fills line by line, an arch photo with a parallax detail, and the facts count up.
- **02 Lobby.** Six vertical panels slide in from alternating directions and lock into the photograph (pinned on desktop).
- **03 Story.** A pinned editorial sequence on desktop (image wipes, rolling counter, outline chapter word, line swaps); sticky stacking cards on mobile.
- **04 Rooms.** Directional clip-path wipes between eight photographs, SplitText titles, Flip-animated filtering and a Motion shared-layout filter pill. Each room links to its official booking URL; `<details>` lists all eight without JavaScript.
- **05 Gallery.** A signposted, pinned horizontal sequence with per-frame parallax (`containerAnimation`) on desktop, plus a keyboard focus handler; native scroll-snap elsewhere. Lightbox: keyboard, swipe and Escape, with focus restoration.
- **06 Location / invitation / footer.** Arch reveal with parallax; a marquee that surges with scroll velocity; a magnetic booking orb.
- **Navigation.** The header hides on scroll down and changes theme per section. The fullscreen menu opens with a circular reveal from the toggle and shows a photo preview for each link.

Entrance states are hidden before first paint only when motion is allowed, and are released after 3.5s if scripts never load. No WebGL is used: the photography carried the design better than a 3D scene would have, at a fraction of the bundle size. The homepage is the only page, so cross-document view transitions are enabled in CSS but have nothing to transition between yet.

## Tests and preview

`npm test` checks official booking mappings, local photos, GSAP integrity and core color contrast. `scripts/browser-check.mjs` provides focused Playwright regression checks against a running server, writing screenshots, a walkthrough video and a report to ignored `test-results/motion/`. Set `PLAYWRIGHT_MODULE` and `CHROMIUM_PATH` to reuse an installed package/browser, or install Playwright when networking is available. `TEST_BASE_URL` selects the local server.

See `docs/motion-verification.md` for checks actually performed and remaining limits. A test script's existence alone does not demonstrate a successful run.

## Deployment

The homepage is prerendered, with Hotel JSON-LD, canonical/Open Graph metadata, robots.txt and a sitemap. All image and JavaScript requests are local. Photos use responsive Next Image optimization. Security headers cover anti-framing, MIME sniffing, referrers, browser permissions and a limited CSP for frames, base URLs, objects and forms. No payment or guest details are collected here.

Canonical URLs assume `https://jizzaxhotel.uz/`. Configure staging indexing before exposing a staging build publicly. `npm run assets:sync` is an optional photo refresh command; it is not required to run or build the site. No publication or live-site changes have been made.
"# jizzax-hotel" 
