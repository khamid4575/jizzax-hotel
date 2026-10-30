// Offline recovery for this Windows workspace. Normal installations use `npm install`.
// Reads verified npm cache entries; writes exclusively inside this project.
const fs = require('node:fs/promises');
const path = require('node:path');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const npmRoot = path.join(process.env.ProgramFiles || 'C:/Program Files', 'nodejs/node_modules/npm/node_modules');
const cacache = require(path.join(npmRoot, 'cacache'));
const tar = require(path.join(npmRoot, 'tar'));
const semver = require(path.join(npmRoot, 'semver'));
const source = path.join(process.env.LOCALAPPDATA, 'npm-cache/_cacache');
const project = path.resolve(__dirname, '..');
const target = path.join(project, 'node_modules');
const installed = new Map();
const missing = new Set();

async function main() {
  const entries = await cacache.ls(source);
  const available = new Map();
  for (const [key] of Object.entries(entries)) {
    const match = key.match(/^make-fetch-happen:request-cache:https:\/\/registry\.npmjs\.org\/(.+)\/-\/[^/]+-(\d+\.\d+\.\d+(?:-[^/]+)?)\.tgz$/);
    if (!match) continue;
    const name = decodeURIComponent(match[1]);
    if (!available.has(name)) available.set(name, []);
    available.get(name).push({ version: match[2], key });
  }
  async function install(name, range, parent = project, optional = false) {
    const existing = installed.get(name);
    if (existing && semver.satisfies(existing, range)) return;
    const choices = (available.get(name) || []).filter(entry => semver.satisfies(entry.version, range)).sort((a, b) => semver.rcompare(a.version, b.version));
    if (!choices.length) { if (!optional) missing.add(`${name}@${range}`); return; }
    const selected = choices[0];
    const destination = existing ? path.join(parent, 'node_modules', name) : path.join(target, name);
    if (!destination.startsWith(project + path.sep)) throw new Error('Unsafe extraction target');
    if (!existing) installed.set(name, selected.version);
    const { data } = await cacache.get(source, selected.key);
    await fs.mkdir(destination, { recursive: true });
    await pipeline(Readable.from(data), tar.x({ cwd: destination, strip: 1, preservePaths: false }));
    const pkg = JSON.parse(await fs.readFile(path.join(destination, 'package.json'), 'utf8'));
    if (pkg.os && !pkg.os.includes(process.platform)) return;
    if (pkg.cpu && !pkg.cpu.includes(process.arch)) return;
    for (const [dep, spec] of Object.entries(pkg.dependencies || {})) await install(dep, spec, destination);
    for (const [dep, spec] of Object.entries(pkg.optionalDependencies || {})) {
      if (/linux|darwin|freebsd|android/.test(dep)) continue;
      if (/arm64|ia32/.test(dep)) continue;
      await install(dep, spec, destination, true);
    }
    const bins = typeof pkg.bin === 'string' ? { [name]: pkg.bin } : pkg.bin || {};
    for (const [bin, file] of Object.entries(bins)) {
      const binDir = path.join(target, '.bin');
      await fs.mkdir(binDir, { recursive: true });
      const relative = path.relative(binDir, path.join(destination, file));
      await fs.writeFile(path.join(binDir, `${bin}.cmd`), `@ECHO OFF\r\nnode "%~dp0\\${relative}" %*\r\n`);
    }
    console.log(`${name}@${selected.version}`);
  }
  const pkg = JSON.parse(await fs.readFile(path.join(project, 'package.json'), 'utf8'));
  for (const [name, range] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) await install(name, range);
  if (missing.size) { console.error('Unavailable in local cache:', [...missing].join(', ')); process.exitCode = 1; }
  else console.log('Cached dependencies restored. This does not replace a normal npm install or lockfile.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
