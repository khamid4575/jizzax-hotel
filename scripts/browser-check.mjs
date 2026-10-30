// Focused browser regression for the motion homepage. Run against a server:
//   npm run build && npm start -- --port 3200
//   TEST_BASE_URL=http://127.0.0.1:3200 node scripts/browser-check.mjs
// PLAYWRIGHT_MODULE / CHROMIUM_PATH reuse an existing Playwright install.
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { rooms } from "../src/lib/hotel.ts";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const baseURL = process.env.TEST_BASE_URL || "http://127.0.0.1:3200";
const out = "test-results/motion";
await mkdir(out, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
});
const checks = [];
const notes = {};
const errors = [];
const external = new Set();
const check = (name, condition, detail) => {
  assert.ok(condition, `${name}${detail === undefined ? "" : ` — ${JSON.stringify(detail)}`}`);
  checks.push(name);
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function open(options = {}, { video = false } = {}) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
    ...(video ? { recordVideo: { dir: out, size: { width: 1280, height: 800 } } } : {}),
    ...options,
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin !== new URL(baseURL).origin && url.protocol.startsWith("http"))
      external.add(request.url());
  });
  const response = await page.goto(baseURL, { waitUntil: "networkidle" });
  return { context, page, response };
}

// Wheel input travels through Lenis exactly as a visitor's scrolling does.
async function wheelTo(page, target, step = 240) {
  await page.mouse.move(720, 450);
  for (let i = 0; i < 400; i++) {
    const y = await page.evaluate(() => scrollY);
    if (Math.abs(y - target) < step) break;
    await page.mouse.wheel(0, y < target ? step : -step);
    await wait(16);
  }
  await page.evaluate((y) => window.__lenis?.scrollTo(y, { immediate: true }), target);
  await wait(1300);
}

const spacerTop = (page, selector) =>
  page.evaluate((s) => {
    const spacer = [...document.querySelectorAll(".pin-spacer")].find((p) =>
      p.querySelector(s),
    );
    return spacer ? spacer.getBoundingClientRect().top + scrollY : -1;
  }, selector);

try {
  // ——— Desktop, full motion ———
  const { context, page, response } = await open({}, { video: true });
  check(
    "Production response and security headers",
    response.status() === 200 && response.headers()["x-content-type-options"] === "nosniff",
  );
  await page.waitForFunction(() => document.documentElement.dataset.motionReady === "true");
  check("Lenis smooth scrolling active on desktop", await page.evaluate(() => document.documentElement.classList.contains("lenis")));
  await wait(3600);
  const hero = await page.evaluate(() => {
    const root = document.querySelector(".hero");
    return {
      clip: getComputedStyle(document.querySelector(".hero-media")).clipPath,
      chars: document.querySelectorAll(".hero-char").length,
      settled: [...document.querySelectorAll(".hero-char")].every(
        (c) => Math.abs(new DOMMatrix(getComputedStyle(c).transform).m42) < 1,
      ),
      arch: getComputedStyle(root).getPropertyValue("--arch").trim(),
      drawn: [...document.querySelectorAll(".hero-rosette [pathLength]")].every(
        (p) => Number(getComputedStyle(p).strokeDashoffset.replace("px", "")) < 0.01,
      ),
    };
  });
  check("Hero arch window settles after its entrance", hero.clip.startsWith("inset(") && hero.clip.includes("round"), hero);
  check("Hero title split into characters and settled", hero.chars > 20 && hero.settled, hero);
  check("Girih rosette fully drawn", hero.drawn);
  await page.screenshot({ path: `${out}/desktop-01-hero.jpg`, quality: 70, type: "jpeg" });

  const pins = await page.evaluate(() =>
    [...document.querySelectorAll(".pin-spacer")].map((p) => p.firstElementChild.className.split(" ")[0]),
  );
  check("Four pinned scenes on desktop", ["hero", "expand-stage", "story-pin", "gallery-pin"].every((name) => pins.includes(name)), pins);

  await wheelTo(page, 540);
  const opening = await page.evaluate(() => getComputedStyle(document.querySelector(".hero-media")).clipPath);
  check("Scrolling opens the hero arch", opening !== hero.clip, opening);

  const manifesto = await page.evaluate(() => document.querySelector(".manifesto-title").getBoundingClientRect().top + scrollY);
  await wheelTo(page, manifesto + 200);
  const chips = await page.evaluate(() =>
    [...document.querySelectorAll(".chip-inner")].map((c) => getComputedStyle(c).clipPath),
  );
  check("Inline headline photographs open while scrolling", chips.length === 3 && chips.some((c) => c !== "inset(0% 50%)"), chips);
  await page.screenshot({ path: `${out}/desktop-02-manifesto.jpg`, quality: 70, type: "jpeg" });

  const lobby = await spacerTop(page, ".expand-stage");
  await wheelTo(page, lobby + 250);
  const moving = await page.evaluate(() =>
    [...document.querySelectorAll(".slice")].map((s) => Math.round(new DOMMatrix(getComputedStyle(s).transform).m42)),
  );
  await page.screenshot({ path: `${out}/desktop-03-lobby-mid.jpg`, quality: 70, type: "jpeg" });
  await wheelTo(page, lobby + 800);
  const settled = await page.evaluate(() =>
    [...document.querySelectorAll(".slice")].map((s) => Math.round(new DOMMatrix(getComputedStyle(s).transform).m42)),
  );
  check("Lobby panels travel, then lock together", moving.some((y) => y !== 0) && settled.every((y) => y === 0), { moving, settled });
  const frame = await page.evaluate(() => {
    const r = document.querySelector(".expand-frame").getBoundingClientRect();
    return { w: r.width, h: r.height };
  });
  check("Lobby photograph stays contained, not full-bleed", frame.w < 1440 * 0.6 && frame.h < 900 * 0.85, frame);

  const story = await spacerTop(page, ".story-pin");
  await wheelTo(page, story + 1250);
  const copies = await page.evaluate(() =>
    [...document.querySelectorAll(".story-copy")].map((c) => getComputedStyle(c).visibility),
  );
  check("Pinned story swaps to its second chapter", copies[1] === "visible" && copies[0] === "hidden", copies);
  await page.screenshot({ path: `${out}/desktop-04-story.jpg`, quality: 70, type: "jpeg" });

  const roomsTop = await page.evaluate(() => document.querySelector(".room-collection").getBoundingClientRect().top + scrollY);
  await wheelTo(page, roomsTop - 120);
  for (const [index, room] of rooms.entries()) {
    await page.locator(".room-list button").nth(index).click();
    await wait(index === 7 ? 1600 : 350);
    const state = await page.evaluate(() => ({
      href: document.querySelector(".room-detail a.button").href,
      name: document.querySelector(".room-detail h3").getAttribute("aria-label") || document.querySelector(".room-detail h3").textContent,
    }));
    check(`Room ${index + 1} shows its official booking link`, state.href === room.bookingUrl && state.name.trim() === room.shortName, state);
  }
  await page.screenshot({ path: `${out}/desktop-05-rooms.jpg`, quality: 70, type: "jpeg" });
  await page.getByRole("button", { name: "Deluxe", exact: true }).click();
  await wait(1200);
  check("Deluxe filter shows two rooms", (await page.locator(".room-list li").count()) === 2);
  await page.getByRole("button", { name: "All rooms" }).click();
  await wait(1000);

  const gallery = await spacerTop(page, ".gallery-pin");
  await wheelTo(page, gallery + 1400);
  const rail = await page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector(".gallery-rail")).transform).m41);
  check("Gallery moves sideways with vertical scroll", rail < -400, rail);
  await page.screenshot({ path: `${out}/desktop-06-gallery.jpg`, quality: 70, type: "jpeg" });

  // Frame rate while the lobby assembles, sampled during real wheel input.
  notes.fps = await page.evaluate(async (top) => {
    window.__lenis.scrollTo(top - 50, { immediate: true });
    await new Promise((r) => setTimeout(r, 600));
    let frames = 0;
    const start = performance.now();
    window.__lenis.scrollTo(top + 700, { duration: 2 });
    await new Promise((resolve) => {
      const tick = () => {
        frames++;
        performance.now() - start < 2000 ? requestAnimationFrame(tick) : resolve();
      };
      requestAnimationFrame(tick);
    });
    return Math.round(frames / 2);
  }, lobby);

  await wheelTo(page, 0);
  await page.locator(".menu-toggle").click();
  await wait(1500);
  check("Fullscreen menu opens and takes focus", await page.evaluate(() => document.querySelector("#site-menu").open && document.querySelector("#site-menu").contains(document.activeElement)));
  await page.screenshot({ path: `${out}/desktop-07-menu.jpg`, quality: 70, type: "jpeg" });
  await page.keyboard.press("Escape");
  await wait(1200);
  check("Escape closes the menu and returns focus", await page.evaluate(() => !document.querySelector("#site-menu").open && document.activeElement.classList.contains("menu-toggle") && !document.documentElement.style.overflow));

  await page.locator(".gallery-frame button").first().focus();
  await page.keyboard.press("Enter");
  await wait(1200);
  await page.keyboard.press("ArrowRight");
  await wait(1100);
  check("Lightbox opens and arrow keys move forward", (await page.locator(".lightbox h2").textContent()) === "A welcome with character");
  await page.keyboard.press("Escape");
  await wait(700);
  check("Lightbox closes and restores focus", await page.evaluate(() => !document.querySelector(".lightbox") && document.activeElement.getAttribute("aria-label")?.startsWith("Open photograph")));
  await context.close();
  notes.video = (await page.video()?.path()) ?? null;

  // ——— Mobile composition ———
  const mobile = await open({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  await mobile.page.waitForFunction(() => document.documentElement.dataset.motionReady === "true");
  await wait(3500);
  check("Mobile has no pinned scenes", (await mobile.page.locator(".pin-spacer").count()) === 0);
  await mobile.page.screenshot({ path: `${out}/mobile-01-hero.jpg`, quality: 70, type: "jpeg" });
  const card = await mobile.page.evaluate(() => document.querySelectorAll(".story-chapter")[1].getBoundingClientRect().top + scrollY);
  await mobile.page.evaluate((y) => scrollTo(0, y - 300), card);
  await wait(1500);
  const scale = await mobile.page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector(".story-card")).transform).a);
  check("Mobile story cards stack and settle back", scale < 0.99, scale);
  await mobile.page.screenshot({ path: `${out}/mobile-02-story.jpg`, quality: 70, type: "jpeg" });
  await mobile.context.close();

  for (const width of [320, 390, 768, 1440]) {
    const sized = await open({ viewport: { width, height: 900 } });
    await wait(1500);
    const overflow = await sized.page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    check(`No horizontal page overflow at ${width}px`, overflow <= 0, overflow);
    await sized.context.close();
  }

  // ——— Reduced motion ———
  const reduced = await open({ reducedMotion: "reduce" });
  await wait(1500);
  const calm = await reduced.page.evaluate(() => ({
    lenis: document.documentElement.classList.contains("lenis"),
    pins: document.querySelectorAll(".pin-spacer").length,
    title: getComputedStyle(document.querySelector(".hero-title")).visibility,
    scrollable: document.querySelector(".gallery-track").scrollWidth > document.querySelector(".gallery-track").clientWidth,
  }));
  check("Reduced motion: no Lenis, no pins, content visible, native gallery scroll", !calm.lenis && calm.pins === 0 && calm.title === "visible" && calm.scrollable, calm);
  await reduced.context.close();

  // ——— No JavaScript ———
  const plain = await open({ javaScriptEnabled: false });
  const html = await plain.page.evaluate(() => ({
    title: document.querySelector("h1").textContent,
    bookings: [...document.querySelectorAll(".all-room-links a")].map((a) => a.href),
  }));
  check("No-JS: headline is server-rendered", html.title.includes("Your world"));
  check("No-JS: all eight booking links exist", rooms.every((room) => html.bookings.includes(room.bookingUrl)));
  await plain.context.close();

  check("No JavaScript exceptions", errors.length === 0, errors);
  check("No runtime requests to external origins", external.size === 0, [...external]);
} finally {
  await writeFile(
    `${out}/browser-report.json`,
    JSON.stringify({ baseURL, passed: checks, notes, errors, external: [...external] }, null, 2),
  );
  await browser.close();
}
console.log(`${checks.length} checks passed`, notes);
