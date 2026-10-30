const sharp = require('sharp');
const fs = require('node:fs');
(async () => {
  const files = fs.readdirSync('public/img').filter(f => f.endsWith('.webp'));
  const tiles = await Promise.all(files.map(async (file, index) => ({
    input: await sharp(`public/img/${file}`).resize(300, 180, { fit: 'contain', background: '#fff' }).extend({ bottom: 28, background: '#fff' }).composite([{ input: Buffer.from(`<svg width="300" height="28"><text x="8" y="19" font-size="14">${file}</text></svg>`), top: 180, left: 0 }]).png().toBuffer(),
    left: (index % 4) * 300, top: Math.floor(index / 4) * 208,
  })));
  await sharp({ create: { width: 1200, height: Math.ceil(files.length / 4) * 208, channels: 3, background: '#fff' } }).composite(tiles).png().toFile('test-results/official-contact-sheet.png');
})();
