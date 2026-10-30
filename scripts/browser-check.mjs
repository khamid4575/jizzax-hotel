import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { rooms } from "../src/lib/hotel.ts";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
});
const baseURL = process.env.TEST_BASE_URL || "http://127.0.0.1:3001";
const errors = [],
  external = new Set(),
  failed = [];
const checks = [];
await mkdir("test-results/phase-2", { recursive: true });
const check = (name, condition) => {
  assert.ok(condition, name);
  checks.push(name);
};

try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL).origin)
      external.add(request.url());
  });
  page.on("requestfailed", (request) => failed.push(request.url()));
  const response = await page.goto(baseURL, { waitUntil: "networkidle" });
  check(
    "Production response and security headers",
    response.status() === 200 &&
      response.headers()["x-content-type-options"] === "nosniff",
  );
  await page.waitForFunction(
    () => document.documentElement.dataset.motionReady === "true",
  );
  await page.waitForFunction(
    () =>
      Math.abs(
        new DOMMatrix(
          getComputedStyle(document.querySelector(".hero-line>span")).transform,
        ).m42,
      ) < 1,
  );
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector(".hero-bottom")).opacity ===
        "1" &&
      getComputedStyle(document.querySelector(".hero-description")).opacity ===
        "1",
  );
  check(
    "GSAP creates two desktop pinned sequences",
    (await page.locator(".pin-spacer").count()) === 2,
  );
  check(
    "Hero photograph loads locally",
    await page
      .locator(".hero-visual img")
      .evaluate((img) => img.complete && img.naturalWidth > 0),
  );
  await page.screenshot({ path: "test-results/phase-2/desktop-hero.png" });
  const initialMask = await page
    .locator(".hero-visual")
    .evaluate((el) => getComputedStyle(el).clipPath);
  await page.mouse.wheel(0, 400);
  await page.waitForFunction(
    (mask) =>
      getComputedStyle(document.querySelector(".hero-visual")).clipPath !==
      mask,
    initialMask,
  );
  check("Hero mask responds to real scrolling", true);
  await page.screenshot({ path: "test-results/phase-2/hero-scroll.png" });

  for (let index = 0; index < rooms.length; index++) {
    const choice = page.locator(".room-selector button").nth(index);
    await choice.click();
    check(
      `Room ${index + 1} preserves image, name and booking ID`,
      (await page.locator(".room-description a").getAttribute("href")) ===
        rooms[index].bookingUrl &&
        (await page.locator(".room-photograph img").getAttribute("alt")) ===
          rooms[index].name,
    );
  }
  await page.getByRole("button", { name: "Suites", exact: true }).click();
  check(
    "Suites filter",
    (await page.locator(".room-selector button").count()) === 2,
  );
  await page.getByRole("button", { name: "Standard", exact: true }).click();
  check(
    "Standard filter",
    (await page.locator(".room-selector button").count()) === 4,
  );
  await page.getByRole("button", { name: "All rooms", exact: true }).click();
  await page.locator(".room-selector button").nth(4).click();
  await page.locator(".room-photograph img").evaluate((img) => img.decode());
  await page.waitForFunction(
    () =>
      document
        .querySelector(".room-photograph")
        .getAnimations()
        .every((animation) => animation.playState === "finished") &&
      document
        .querySelector(".room-description")
        .getAnimations()
        .every((animation) => animation.playState === "finished"),
  );
  await page.screenshot({ path: "test-results/phase-2/desktop-rooms.png" });

  const storyTop = await page
    .locator("#experiences")
    .evaluate((el) => el.getBoundingClientRect().top + scrollY);
  await page.evaluate(
    (y) => window.scrollTo({ top: y + 650, behavior: "instant" }),
    storyTop,
  );
  await page.waitForFunction(
    () =>
      new DOMMatrix(
        getComputedStyle(document.querySelector(".story-track")).transform,
      ).m42 < -100,
  );
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector(".story-image-2")).clipPath !==
      "inset(100% 0px 0px)",
  );
  check(
    "Story text and image masks respond to scroll",
    await page
      .locator(".story-image-2")
      .evaluate(
        (el) => getComputedStyle(el).clipPath !== "inset(100% 0px 0px)",
      ),
  );
  await page.screenshot({ path: "test-results/phase-2/desktop-story.png" });

  const galleryOpener = page.getByRole("button", {
    name: "Open photograph: A Tashkent address",
    exact: true,
  });
  await galleryOpener.click();
  await page.getByRole("dialog").waitFor({ state: "visible" });
  await page.locator(".lightbox-image img").evaluate((img) => img.decode());
  check(
    "Fullscreen gallery opens with a real photo",
    await page
      .locator(".lightbox-image img")
      .evaluate((img) => img.naturalWidth > 0),
  );
  await page.getByRole("button", { name: "Next photograph" }).click();
  check(
    "Gallery next arrow",
    (await page.locator("#lightbox-title").textContent()) ===
      "A welcome with character",
  );
  await page.keyboard.press("ArrowRight");
  check(
    "Gallery keyboard navigation",
    (await page.locator("#lightbox-title").textContent()) ===
      "A slower morning",
  );
  await page.locator(".lightbox-image img").evaluate((img) => img.decode());
  await page.locator(".lightbox").evaluate(async (el) => {
    await Promise.all(
      el
        .getAnimations({ subtree: true })
        .map((animation) => animation.finished),
    );
  });
  await page.screenshot({ path: "test-results/phase-2/gallery-lightbox.png" });
  await page.keyboard.press("Escape");
  await page.locator(".lightbox").waitFor({ state: "detached" });
  await page.waitForFunction(
    () =>
      document.activeElement?.getAttribute("aria-label") ===
      "Open photograph: A Tashkent address",
  );
  check("Gallery Escape and focus restoration", true);

  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("dialog", { name: "Site navigation" })
    .waitFor({ state: "visible" });
  await page.keyboard.press("Shift+Tab");
  check(
    "Menu keeps keyboard focus inside its native dialog",
    await page
      .locator("#mobile-menu")
      .evaluate((el) => el.contains(document.activeElement)),
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("dialog", { name: "Site navigation" })
    .waitFor({ state: "hidden" });
  check(
    "Menu restores focus",
    await page
      .getByRole("button", { name: "Open navigation" })
      .evaluate((el) => el === document.activeElement),
  );

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(
    () => document.querySelectorAll(".pin-spacer").length === 0,
  );
  check("Reduced motion removes both pins", true);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    check(
      `No page overflow at ${width}px`,
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  check(
    "Mobile motion uses natural scroll without pinning",
    (await page.locator(".pin-spacer").count()) === 0,
  );
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll(".hero-line > span")].every(
        (line) =>
          Math.abs(new DOMMatrix(getComputedStyle(line).transform).m42) < 1,
      ) &&
      getComputedStyle(document.querySelector(".hero-description")).opacity ===
        "1",
  );
  check(
    "Mobile hero copy is visible after its entrance",
    await page.locator("h1").isVisible(),
  );
  await page.screenshot({ path: "test-results/phase-2/mobile-hero.png" });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator("#mobile-menu").evaluate(async (el) => {
    await Promise.all(
      el
        .getAnimations({ subtree: true })
        .map((animation) => animation.finished),
    );
  });
  await page.screenshot({ path: "test-results/phase-2/mobile-menu.png" });
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: /Rooms & suites/ })
    .click();
  await page.locator("#mobile-menu").waitFor({ state: "hidden" });
  const beforeSwipe = await page
    .locator(".room-description a")
    .getAttribute("href");
  await page.locator(".room-stage").dispatchEvent("pointerdown", {
    clientX: 300,
    clientY: 250,
    pointerType: "touch",
  });
  await page.locator(".room-stage").dispatchEvent("pointerup", {
    clientX: 80,
    clientY: 260,
    pointerType: "touch",
  });
  check(
    "Horizontal touch gesture changes room",
    beforeSwipe !==
      (await page.locator(".room-description a").getAttribute("href")),
  );
  const afterSwipe = await page
    .locator(".room-description a")
    .getAttribute("href");
  await page.locator(".room-stage").dispatchEvent("pointerdown", {
    clientX: 220,
    clientY: 200,
    pointerType: "touch",
  });
  await page.locator(".room-stage").dispatchEvent("pointerup", {
    clientX: 215,
    clientY: 380,
    pointerType: "touch",
  });
  check(
    "Vertical touch gesture does not change room",
    afterSwipe ===
      (await page.locator(".room-description a").getAttribute("href")),
  );
  await page.locator(".room-description").scrollIntoViewIfNeeded();
  await page.locator(".room-photograph img").evaluate((img) => img.decode());
  await page.locator(".room-stage").evaluate(async (el) => {
    await Promise.all(
      el
        .getAnimations({ subtree: true })
        .map((animation) => animation.finished),
    );
  });
  await page.screenshot({ path: "test-results/phase-2/mobile-rooms.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
  );
  await page.waitForLoadState("networkidle");
  await page.screenshot({
    path: "test-results/phase-2/mobile-full.png",
    fullPage: true,
  });

  const plain = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  await plain.goto(baseURL, { waitUntil: "networkidle" });
  check(
    "No-JavaScript heading and booking remain available",
    (await plain.locator("h1").count()) === 1 &&
      (await plain
        .getByRole("link", { name: "Reserve your stay", exact: true })
        .first()
        .isVisible()),
  );
  await plain.locator(".all-room-links summary").click();
  check(
    "All eight room bookings work without JavaScript",
    (await plain.locator(".all-room-links a:visible").count()) === 8,
  );
  await plain.close();
  const deadAnchors = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .filter(
          (link) =>
            !document.getElementById(link.getAttribute("href").slice(1)),
        )
        .map((link) => link.getAttribute("href")),
    );
  check("Internal anchors resolve", deadAnchors.length === 0);
  check("No runtime external requests", external.size === 0);
  check(
    "No JavaScript exceptions or failed requests",
    errors.length === 0 && failed.length === 0,
  );
  await writeFile(
    "test-results/phase-2/browser-report.json",
    JSON.stringify(
      {
        passed: true,
        checks,
        errors,
        failed,
        external: [...external],
        note: "Touch gestures are synthetic regression events, not a physical-device test.",
      },
      null,
      2,
    ),
  );
  console.log(
    `PASS: ${checks.length} browser checks; real GSAP and local photographs, desktop/mobile layouts, gallery, keyboard, touch logic, reduced motion and no-JavaScript booking.`,
  );
} finally {
  await browser.close();
}
