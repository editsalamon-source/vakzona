// Egy Akadémia-tanfolyam védett tartalmának titkosítása a public/ mappába (src/utils/tanfolyam.js fejti vissza).
//
//   node scripts/akademia.mjs <url-azonosító>   (a jelszót a VZ_JELSZO környezeti változó adja)
//
// Bemenet (gitignore-olt munkamappa):
//   Akadémia/<url-azonosító>/tartalom.json   leckénként:
//     { "leckek": { "<azonosító>": { "video", "felirat", "leiras", "anyagok": [{ "fajl", "felirat" }] } } }
//   Akadémia/<url-azonosító>/anyagok/<fájl>    a letölthető anyagok (a "fajl" mező erre mutat; http-vel kezdődő = külső link)
//   Akadémia/<url-azonosító>/feliratok/<fájl>  a videók WebVTT-feliratai (a lecke "felirat" mezője; csak videófájlnál)
// Kimenet:
//   public/akademia/<url-azonosító>/tartalom.enc, …/anyagok/<fájl>.enc, …/feliratok/<fájl>.enc
//
// A formátum a scripts/vedett-pdf.mjs-é ("VZP1" + só + IV + AES-256-GCM); egy tanfolyam minden fájlja ugyanazt
// a sót és kulcsot kapja, így a böngésző egyetlen jelszóval mindet megnyitja. A jelszó sehol nem szerepel a repóban.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { webcrypto as crypto } from "node:crypto";

const slug = process.argv[2];
const password = process.env.VZ_JELSZO;
if (!slug || !password) {
  console.error("Használat: VZ_JELSZO=… node scripts/akademia.mjs <url-azonosító>");
  process.exit(1);
}

const root = join(import.meta.dirname, "..");
const src = join(root, "Akadémia", slug);
const out = join(root, "public", "akademia", slug);
const md = join(root, "src", "content", "akademia", `${slug}.md`);

const content = JSON.parse(readFileSync(join(src, "tartalom.json"), "utf8"));
const lessons = content.leckek || {};

// a nyilvános leírás (src/content/akademia/<url-azonosító>.md) leckéi és a védett tartalom egyezzen
const ids = [...readFileSync(md, "utf8").matchAll(/^lecke:\s*([^|\r\n]+)/gim)].map((m) => m[1].trim());
const missing = ids.filter((id) => !lessons[id]);
const extra = Object.keys(lessons).filter((id) => !ids.includes(id));
if (missing.length) console.warn(`Figyelem: nincs védett tartalom ezekhez a leckékhez: ${missing.join(", ")}`);
if (extra.length) console.warn(`Figyelem: a .md-ben nem szereplő leckék: ${extra.join(", ")}`);

const salt = crypto.getRandomValues(new Uint8Array(16));
const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password.trim()), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" },
  base,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt"]
);

async function seal(data, file) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const sealed = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data));
  writeFileSync(file, Buffer.concat([Buffer.from("VZP1"), salt, iv, sealed]));
  return sealed.length;
}

// minden futás tisztán újraírja a titkosított kimenetet (a régi sóval készült fájlok már nem nyílnának);
// a mappa nyilvános fájljai (pl. logo.svg) maradnak
for (const dir of ["anyagok", "feliratok"]) {
  rmSync(join(out, dir), { recursive: true, force: true });
  mkdirSync(join(out, dir), { recursive: true });
}

async function sealFile(dir, file, id) {
  const path = join(src, dir, file);
  if (!existsSync(path)) {
    console.error(`Hiányzó fájl (${id}): Akadémia/${slug}/${dir}/${file}`);
    process.exit(1);
  }
  await seal(readFileSync(path), join(out, dir, `${file}.enc`));
}

let files = 0;
let subtitles = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  for (const item of lesson.anyagok || []) {
    if (/^https?:\/\//.test(item.fajl)) continue;
    await sealFile("anyagok", item.fajl, id);
    files++;
  }
  if (lesson.felirat) {
    await sealFile("feliratok", lesson.felirat, id);
    subtitles++;
  }
}
await seal(new TextEncoder().encode(JSON.stringify(content)), join(out, "tartalom.enc"));
console.log(`Kész: public/akademia/${slug}/ (${Object.keys(lessons).length} lecke, ${files} anyag, ${subtitles} felirat)`);
