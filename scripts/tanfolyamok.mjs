// A megvásárolható (zárt, nem piszkozat) tanfolyamok listája a fizetési függvényeknek: szerver/tanfolyamok.gen.js
// (url-azonosító → cím). A Cloudflare-függvény nem olvashat fájlt, ezért buildkor készül. Az `npm run build` futtatja.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const dir = join(root, "src", "content", "akademia");
const lista = {};

for (const file of existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")) : []) {
  const raw = readFileSync(join(dir, file), "utf8");
  const head = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || "";
  const meta = {};
  for (const line of head.split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim().toLowerCase()] ??= line.slice(i + 1).trim();
  }
  if (/^(igen|true)$/i.test(meta["szabad hozzáférés"] || "") || /^(igen|true)$/i.test(meta["piszkozat"] || "")) continue;
  const slug = file.replace(/\.md$/, "");
  lista[slug] = meta["cím"] || slug;
}

writeFileSync(
  join(root, "szerver", "tanfolyamok.gen.js"),
  `// GENERÁLT FÁJL (scripts/tanfolyamok.mjs), ne szerkeszd kézzel.\nexport default ${JSON.stringify(lista, null, 2)};\n`
);
console.log(`tanfolyamok: ${Object.keys(lista).length} megvásárolható`);
