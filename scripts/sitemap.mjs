// public/sitemap.xml generálása a fix oldalakból és a nem piszkozat elemzésekből.
// A `npm run build` automatikusan futtatja.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE_URL = "https://vakzona.com";
const dir = join(import.meta.dirname, "..", "src", "content", "elemzesek");

const pages = [
  { path: "/", freq: "weekly", priority: "1.0" },
  { path: "/elemzesek", freq: "weekly", priority: "0.9" },
  { path: "/rolunk", freq: "yearly", priority: "0.5" },
];

for (const file of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  const raw = readFileSync(join(dir, file), "utf8");
  if (/^piszkozat:\s*(igen|true)\s*$/im.test(raw)) continue;
  const date = raw.match(/^dátum:\s*(\S+)/im)?.[1];
  pages.push({
    path: `/elemzesek/${file.replace(/\.md$/, "")}`,
    freq: "yearly",
    priority: "0.8",
    lastmod: date,
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.path}</loc>${p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : ""}
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(import.meta.dirname, "..", "public", "sitemap.xml"), xml);
console.log(`sitemap.xml: ${pages.length} oldal`);
