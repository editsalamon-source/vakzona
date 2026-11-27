// A tanfolyamok letölthető anyagainak NYILVÁNOS listája (csak név és fájltípus, maguk a fájlok nem):
// src/content/akademia/anyagok/<url-azonosító>.json = { "<lecke>": [{ "felirat", "tipus" }] }.
// Ebből mutatja a tanfolyam összefoglaló oldala vásárlás előtt, leckénként, mit lehet majd letölteni.
//
//   node scripts/anyaglista.mjs              minden tanfolyam (amelynek van Akadémia/<url-azonosító>/tartalom.json-ja)
//   node scripts/anyaglista.mjs <url-azonosító>
//
// Jelszó nem kell: a gitignore-olt Akadémia/<url-azonosító>/tartalom.json-ból olvas. A scripts/akademia.mjs is
// lefuttatja minden újratitkosításkor, így a lista a tartalommal együtt frissül.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";
import { pathToFileURL } from "node:url";

const root = join(import.meta.dirname, "..");
const outDir = join(root, "src", "content", "akademia", "anyagok");

const TIPUSOK = { ".pdf": "PDF", ".xlsx": "Excel", ".xls": "Excel", ".docx": "Word", ".doc": "Word", ".pptx": "PowerPoint", ".zip": "ZIP", ".md": "Szöveg", ".txt": "Szöveg", ".csv": "CSV" };

export function anyaglista(slug) {
  const src = join(root, "Akadémia", slug, "tartalom.json");
  const out = join(outDir, `${slug}.json`);
  if (!existsSync(src)) return null;
  const lessons = JSON.parse(readFileSync(src, "utf8")).leckek || {};
  const list = {};
  for (const [id, lesson] of Object.entries(lessons)) {
    const items = (lesson.anyagok || [])
      .filter((a) => a && a.fajl)
      .map((a) => ({
        felirat: a.felirat || a.fajl.replace(/\.[^.]+$/, ""),
        tipus: /^https?:\/\//.test(a.fajl) ? "Link" : TIPUSOK[extname(a.fajl).toLowerCase()] || extname(a.fajl).slice(1).toUpperCase(),
      }));
    if (items.length) list[id] = items;
  }
  mkdirSync(outDir, { recursive: true });
  if (Object.keys(list).length) writeFileSync(out, JSON.stringify(list, null, 2) + "\n");
  else rmSync(out, { force: true });
  return Object.values(list).reduce((n, l) => n + l.length, 0);
}

// közvetlen futtatás
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const slugs = process.argv[2] ? [process.argv[2]] : readdirSync(join(root, "Akadémia"), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  for (const slug of slugs) {
    const n = anyaglista(slug);
    if (n !== null) console.log(`${slug}: ${n} anyag`);
  }
}
