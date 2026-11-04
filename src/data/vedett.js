import courses from "./akademia.js";
import analyses from "./analyses.js";

// A fiókhoz rendelhető védett tartalmak (supabase/schema.sql, hozzaferes.tartalom):
// minden nem szabad hozzáférésű tanfolyam ("akademia/<url-azonosító>") és minden védett PDF ("pdf/<elemzés url-azonosítója>").
// Új tanfolyam vagy `pdf védett:` sor itt magától megjelenik (az adminoldal pipái is ebből épülnek).
const VEDETT = [
  ...courses.filter((c) => !c.free).map((c) => ({ id: `akademia/${c.slug}`, title: c.title, kind: "Tanfolyam", to: `/akademia/${c.slug}` })),
  ...analyses
    .filter((a) => a.pdfProtected)
    .map((a) => ({
      id: a.pdfProtected.id,
      title: a.pdfProtected.title || a.title,
      kind: "Védett dokumentum",
      to: `/elemzesek/${a.slug}`,
    })),
];

// az adminoldal csoportjai: külön a tanfolyamok és a tanulmányok (védett PDF-ek)
export const CSOPORTOK = [
  { label: "Tanfolyamok", items: VEDETT.filter((v) => v.id.startsWith("akademia/")) },
  { label: "Tanulmányok", items: VEDETT.filter((v) => v.id.startsWith("pdf/")) },
].filter((g) => g.items.length);

export const describe = (id) => VEDETT.find((v) => v.id === id) || null;

export default VEDETT;
