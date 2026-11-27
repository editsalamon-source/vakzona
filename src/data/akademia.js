import { Marked } from "marked";
import { parseCimkek } from "./cimkek.js";

import AKADEMIA_NEV, { AKADEMIA_KATEGORIAK, getAkademiaKategoria } from "./akademiaNev.js";

export { AKADEMIA_NEV as AKADEMIA };

// Minden tanfolyam egy Markdown fájl: src/content/akademia/<url-azonosító>.md
// Fejléc `kulcs: érték` sorokkal --- között: cím, alcím (rövid leírás, a keresőknek is), dátum, kategória
// (opcionális, a borító ábrája és az Akadémia témaköre), címkék (lásd cimkek.js), szint, bemutató (a nyilvános bemutatóvideó URL-je), bemutató felirat (WebVTT),
// ízelítő (ismételhető, `ízelítő: lecke-azonosító | videó URL-je`: nyilvánosan megnézhető lecke a tanfolyamoldalon, a bemutató mellett),
// logó + logó felirat (a tanfolyam logója a public/akademia/<url-azonosító>/ mappában; az oklevélen), piszkozat, valamint a
// tananyag sorrendben: `modul: Név`, alatta `lecke: azonosító | Cím | időtartam (pp:mm)`. A törzs a tanfolyam leírása:
// az első `##` előtti rész a nyilvános bevezető (belépés előtt is látszik), a többi csak belépés után.
// A leckék videói és letölthető anyagai titkosítva vannak: public/akademia/<url-azonosító>/tartalom.enc
// (scripts/akademia.mjs), a jelszó nélkül csak a fenti nyilvános adatok látszanak.
// `szabad hozzáférés: igen`: a tanfolyam belépés nélkül nyílik, a tartalom titkosítatlanul a
// src/content/akademia/<url-azonosító>.json fájlban van (ugyanaz a szkript írja).
const files = import.meta.glob("../content/akademia/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});
const freeFiles = import.meta.glob("../content/akademia/*.json", { import: "default", eager: true });
// a letölthető anyagok nyilvános listája (csak név és típus; scripts/anyaglista.mjs): { "<lecke>": [{ felirat, tipus }] }
const materialFiles = import.meta.glob("../content/akademia/anyagok/*.json", { import: "default", eager: true });

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
  const samples = [];
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
      } else if (key === "ízelítő") {
        const [id, url = ""] = value.split("|").map((s) => s.trim());
        if (id && url) samples.push({ id, url });
      } else {
        meta[key] = value;
      }
    });
  }
  return { meta, modules, samples, body: match ? raw.slice(match[0].length) : raw };
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
    const { meta, modules, samples, body } = parse(raw);
    const materials = materialFiles[`../content/akademia/anyagok/${slug}.json`] || {};
    modules.forEach((m) => m.lessons.forEach((l) => (l.materials = materials[l.id] || [])));
    const lessons = modules.flatMap((m) => m.lessons);
    // ízelítő leckék (a tanfolyamoldalon a bemutató mellett, vásárlás előtt): cím, hossz, rész a leckelistából
    const previews = samples
      .map((s) => {
        const mi = modules.findIndex((m) => m.lessons.some((l) => l.id === s.id));
        const lesson = mi < 0 ? null : modules[mi].lessons.find((l) => l.id === s.id);
        return lesson && { ...s, title: lesson.title, length: lesson.length, module: modules[mi].title };
      })
      .filter(Boolean);
    previews.forEach((p) => (lessons.find((l) => l.id === p.id).preview = true));
    return {
      slug,
      title: meta["cím"] || slug,
      subtitle: meta["alcím"] || "",
      date: meta["dátum"] || "",
      category: getAkademiaKategoria(meta["kategória"]),
      level: meta["szint"] || "",
      tags: parseCimkek(meta["címkék"], `${slug}.md`),
      intro: meta["bemutató"] || "",
      introSubtitles: asset(meta["bemutató felirat"], slug),
      previews,
      cover: meta["borító"] || "",
      logo: asset(meta["logó"], slug),
      logoText: meta["logó felirat"] || "",
      draft: /^(igen|true)$/i.test(meta["piszkozat"] || ""),
      sealed: `/akademia/${slug}/tartalom.enc`,
      free: /^(igen|true)$/i.test(meta["szabad hozzáférés"] || ""),
      content: freeFiles[path.replace(/\.md$/, ".json")] || null,
      modules,
      lessons,
      seconds: lessons.reduce((sum, l) => sum + l.seconds, 0),
      materialCount: lessons.reduce((sum, l) => sum + l.materials.length, 0),
      ...splitBody(body),
    };
  })
  // a piszkozatok csak a helyi fejlesztői szerveren látszanak, élesben nem
  .filter((c) => import.meta.env.DEV || !c.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

// az Akadémia témakörei (AKADEMIA.kategoriak) a hozzájuk tartozó tanfolyamok számával; az üres is („hamarosan”)
export function getAcademyCategories() {
  return AKADEMIA_KATEGORIAK.map((k) => ({ ...k, count: courses.filter((c) => c.category?.slug === k.slug).length, lead: AKADEMIA_NEV.leirasok[k.slug] }));
}

export function getCourse(slug) {
  return courses.find((c) => c.slug === slug) || null;
}

export default courses;
