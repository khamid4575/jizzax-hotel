import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { rooms, photo } from "../src/lib/hotel.ts";
import { galleryImages } from "../src/lib/gallery.ts";

test("every room, gallery photograph and official logo is a real local WebP", () => {
  const ids = new Set([
    "38f655103e3d41ca",
    ...rooms.map((room) => room.image),
    ...galleryImages.map((image) => image.image),
  ]);
  for (const id of ids) {
    const url = photo(id);
    assert.equal(url, `/img/${id}.webp`);
    const file = fs.readFileSync(`public${url}`);
    assert.ok(file.length > 1000, `${id} must contain photo data`);
    assert.equal(file.toString("ascii", 0, 4), "RIFF");
    assert.equal(file.toString("ascii", 8, 12), "WEBP");
  }
});
test("the bundled GSAP package matches official npm registry integrity", () => {
  const integrity = `sha512-${createHash("sha512").update(fs.readFileSync("vendor/gsap-3.13.0.tgz")).digest("base64")}`;
  assert.equal(
    integrity,
    "sha512-QL7MJ2WMjm1PHWsoFrAQH/J8wUeqZvMtHO58qdekHpCfhvhSL4gSiz6vJf5EeMP0LOn3ZCprL2ki/gjED8ghVw==",
  );
  assert.equal(
    JSON.parse(fs.readFileSync("node_modules/gsap/package.json", "utf8"))
      .version,
    "3.13.0",
  );
  assert.ok(fs.existsSync("node_modules/gsap/ScrollTrigger.js"));
});
test("core text and booking button palettes meet AA normal-text contrast", () => {
  const luminance = (hex) => {
    const channels = hex
      .match(/\w\w/g)
      .map((channel) => parseInt(channel, 16) / 255)
      .map((value) =>
        value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
      );
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  for (const [foreground, background] of [
    ["ffffff", "0976b3"],
    ["102e47", "f4f9fc"],
    ["496477", "e7f1f8"],
    ["b8dff1", "071d35"],
  ]) {
    const [a, b] = [luminance(foreground), luminance(background)].sort(
      (x, y) => y - x,
    );
    assert.ok((a + 0.05) / (b + 0.05) >= 4.5, `${foreground} on ${background}`);
  }
});
