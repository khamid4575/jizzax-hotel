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

- GSAP **3.13.0** and ScrollTrigger are dynamically imported and bundled into local Next chunks. `vendor/gsap-3.13.0.tgz` is the official registry archive, verified against its published SHA-512 integrity. Keeping the package archive enables installation without a runtime CDN dependency. The archive retains its license notices.
- Hero image masking and line choreography lead into a desktop pinned, scrubbed scale transition.
- The introduction combines an image mask, foreground parallax and scroll-linked text color.
- The room showcase has eight selectors, category filters, image wipes, content transitions, touch gestures and a reservation link matching the selected room. All eight booking links remain available in native HTML details, including without JavaScript.
- The desktop experience sequence pins three image/text compositions. Mobile and reduced-motion layouts show all chapters in natural flow.
- The gallery uses alternating image masks, native horizontal touch scrolling and a lazy-loaded fullscreen dialog with arrows, keyboard navigation, Escape, swipe recognition and focus restoration.
- Fullscreen navigation, animated underlines, directional hover treatments and fine-pointer magnetic CTAs complete the interaction layer.
- Reduced-motion preferences disable pinning, scrubbing, CSS entrance motion and smooth scrolling. Content is readable before the animation module loads. There is no Lenis, WebGL or scroll hijacking.

## Tests and preview

`npm test` checks official booking mappings, local photos, GSAP integrity and core color contrast. `scripts/browser-check.mjs` provides focused Playwright regression checks against a running server, writing screenshots and reports to ignored `test-results/`. Set `PLAYWRIGHT_MODULE` and `CHROMIUM_PATH` to reuse an installed package/browser, or install Playwright when networking is available. `TEST_BASE_URL` selects the local server.

See `docs/phase-2-verification.md` for checks actually performed and remaining limits. A test script's existence alone does not demonstrate a successful run.

## Deployment

The homepage is prerendered, with Hotel JSON-LD, canonical/Open Graph metadata, robots.txt and a sitemap. All image and JavaScript requests are local. Photos use responsive Next Image optimization. Security headers cover anti-framing, MIME sniffing, referrers, browser permissions and a limited CSP for frames, base URLs, objects and forms. No payment or guest details are collected here.

Canonical URLs assume `https://jizzaxhotel.uz/`. Configure staging indexing before exposing a staging build publicly. `npm run assets:sync` is an optional photo refresh command; it is not required to run or build the site. No publication or live-site changes have been made.
