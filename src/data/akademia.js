import { Marked } from "marked";
import { getKategoria } from "./kategoriak.js";

export { default as AKADEMIA } from "./akademiaNev.js";

// Minden tanfolyam egy Markdown fájl: src/content/akademia/<url-azonosító>.md
// Fejléc `kulcs: érték` sorokkal --- között: cím, alcím (rövid leírás, a keresőknek is), dátum, kategória
// (opcionális, a borító ábrája), szint, bemutató (a nyilvános bemutatóvideó URL-je), bemutató felirat (WebVTT),
// logó + logó felirat (a tanfolyam logója a public/akademia/<url-azonosító>/ mappában; az oklevélen), piszkozat, valamint a
// tananyag sorrendben: `modul: Név`, alatta `lecke: azonosító | Cím | időtartam (pp:mm)`. A törzs a tanfolyam leírása:
// az első `##` előtti rész a nyilvános bevezető (belépés előtt is látszik), a többi csak belépés után.
// A leckék videói és letölthető anyagai titkosítva vannak: public/akademia/<url-azonosító>/tartalom.enc
// (scripts/akademia.mjs), a jelszó nélkül csak a fenti nyilvános adatok látszanak.
const files = import.meta.glob("../content/akademia/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

// "6:30" vagy "1:02:30" → másodperc
export function toSeconds(value = "") {
  const parts = value.split(":").map(Number);
  if (parts.some(Number.isNaN)) return 0;
  return parts.reduce((sum, n) => sum * 60 + n, 0);
}

export function formatLength(seconds) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} perc`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} óra ${m} perc` : `${h} óra`;
}

function parse(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const meta = {};
  const modules = [];
  if (match) {
    match[1].split(/\r?\n/).forEach((line) => {
      const i = line.indexOf(":");
      if (i <= 0) return;
      const key = line.slice(0, i).trim().toLowerCase();
      const value = line.slice(i + 1).trim();
      if (key === "modul") {
        modules.push({ title: value, lessons: [] });
      } else if (key === "lecke") {
        const [id, title = id, length = ""] = value.split("|").map((s) => s.trim());
        if (!modules.length) modules.push({ title: "", lessons: [] });
        modules[modules.length - 1].lessons.push({ id, title, length, seconds: toSeconds(length) });
      } else {
        meta[key] = value;
      }
    });
  }
  return { meta, modules, body: match ? raw.slice(match[0].length) : raw };
}

// a tanfolyam saját nyilvános fájlja: fájlnév → /akademia/<url-azonosító>/fájlnév; a „/”-rel vagy http-vel kezdődő változatlan
const asset = (value, slug) => (!value ? null : /^(\/|https?:)/.test(value) ? value : `/akademia/${slug}/${value}`);

// nyilvános bevezető (az első ## előtt) és a belépés után látható leírás
function splitBody(body) {
  const i = body.search(/^## /m);
  const intro = i < 0 ? body : body.slice(0, i);
  return { introHtml: new Marked().parse(intro.trim()), html: new Marked().parse(i < 0 ? "" : body.slice(i)) };
}

const courses = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split("/").pop().replace(/\.md$/, "");
    const { meta, modules, body } = parse(raw);
    const lessons = modules.flatMap((m) => m.lessons);
    return {
      slug,
      title: meta["cím"] || slug,
      subtitle: meta["alcím"] || "",
      date: meta["dátum"] || "",
      category: getKategoria(meta["kategória"]),
      level: meta["szint"] || "",
      intro: meta["bemutató"] || "",
      introSubtitles: asset(meta["bemutató felirat"], slug),
      logo: asset(meta["logó"], slug),
      logoText: meta["logó felirat"] || "",
      draft: /^(igen|true)$/i.test(meta["piszkozat"] || ""),
      sealed: `/akademia/${slug}/tartalom.enc`,
      modules,
      lessons,
      seconds: lessons.reduce((sum, l) => sum + l.seconds, 0),
      ...splitBody(body),
    };
  })
  // a piszkozatok csak a helyi fejlesztői szerveren látszanak, élesben nem
  .filter((c) => import.meta.env.DEV || !c.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export function getCourse(slug) {
  return courses.find((c) => c.slug === slug) || null;
}

export default courses;
