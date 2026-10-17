// A `vite build` után minden ismert útvonalhoz saját dist/<út>/index.html készül a helyes
// címmel, leírással és canonical címmel, hogy a keresők már a nyers HTML-ben is ezt lássák
// (a közös index.html canonicalja különben minden aloldalon a főoldalra mutatna).
// A `npm run build` automatikusan futtatja.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import seo, { SITE_URL, SITE_NAME } from "../src/data/seo.js";

const root = join(import.meta.dirname, "..");
const dist = join(root, "dist");
const dir = join(root, "src", "content", "elemzesek");
const template = readFileSync(join(dist, "index.html"), "utf8");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const pages = Object.entries(seo)
  .filter(([path]) => path.startsWith("/"))
  .map(([path, entry]) => ({ path, ...entry }));

for (const file of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  const raw = readFileSync(join(dir, file), "utf8");
  if (/^piszkozat:\s*(igen|true)\s*$/im.test(raw)) continue;
  const title = raw.match(/^cím:\s*(.+)$/im)?.[1].trim();
  const subtitle = raw.match(/^alcím:\s*(.+)$/im)?.[1].trim();
  pages.push({
    path: `/elemzesek/${file.replace(/\.md$/, "")}`,
    title: `${title} – ${SITE_NAME}`,
    description: subtitle || seo["/elemzesek"].description,
  });
}

function render({ path, title, description }) {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const t = esc(title);
  const d = esc(description);
  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*"/, `$1${d}"`)
    .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`)
    .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${t}"`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*"/, `$1${d}"`)
    .replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${t}"`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*"/, `$1${d}"`);
}

for (const page of pages) {
  const out = page.path === "/" ? dist : join(dist, ...page.path.split("/").filter(Boolean));
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "index.html"), render(page));
}
console.log(`prerender: ${pages.length} oldal`);
