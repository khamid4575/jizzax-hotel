import { mkdir, writeFile, rename } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { rooms } from "../src/lib/hotel.ts";
import { galleryImages } from "../src/lib/gallery.ts";

// Optional maintenance: all required assets already live in public/img.
const ids = new Set([
  "38f655103e3d41ca",
  ...rooms.map((room) => room.image),
  ...galleryImages.map((image) => image.image),
]);
const root = resolve("public/img");
await mkdir(root, { recursive: true });
const assets = [];
for (const id of ids) {
  const url = `https://jizzaxhotel.uz/img/${id}.webp`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(30_000),
    redirect: "error",
  });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (
    bytes.toString("ascii", 0, 4) !== "RIFF" ||
    bytes.toString("ascii", 8, 12) !== "WEBP"
  )
    throw new Error(`Not a WebP: ${url}`);
  const destination = resolve(root, `${id}.webp`);
  await writeFile(`${destination}.tmp`, bytes);
  await rename(`${destination}.tmp`, destination);
  assets.push({
    url,
    file: `/img/${id}.webp`,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
  console.log(`Saved ${id}.webp`);
}
await writeFile(
  "public/asset-manifest.json",
  JSON.stringify({ source: "https://jizzaxhotel.uz/", assets }, null, 2),
);
