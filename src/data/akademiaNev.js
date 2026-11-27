// Az Akadémia neve és leírása egy helyen: menü, oldalcím, SEO, oklevél.
// Külön fájl, mert a Node-os build-szkriptek (prerender, sitemap) is használják.
import KATEGORIAK from "./kategoriak.js";

const AKADEMIA = {
  name: "Vakzóna Akadémia",
  menu: "Akadémia",
  slug: "akademia",
  description: "Videós tanfolyamok a Vakzóna témáiban: leckék, letölthető anyagok és oklevél a végén.",
  // az Akadémia témakörei (a menüben és a szűrőben, /akademia/<azonosító>); a tanfolyam „kategória:” sora dönti el
  kategoriak: ["mi", "tudomany", "szabalyzat", "uzlet"],
  // az Akadémia saját témakörei, amelyek az elemzéseknél nem kategóriák (azonosító = URL, név = a „kategória:” sor)
  sajatKategoriak: [
    { slug: "szabalyzat", name: "Szabályzat" },
    { slug: "uzlet", name: "Üzlet" },
  ],
  leirasok: {
    mi: "Videós tanfolyamok a mesterséges intelligenciáról: az alapoktól a módszertanon és az ágenseken át a vállalati bevezetésig.",
    tudomany: "Videós tanfolyamok tudományos témákban.",
    szabalyzat: "Videós tanfolyamok az uniós szabályozásról: mi a lényeg, kire vonatkozik, mit követel, és hogyan lehet megfelelni neki.",
    uzlet: "Videós tanfolyamok az üzleti munka módszereiről: az igények feltárásától a követelményeken át a megoldás bevezetéséig és értékeléséig.",
  },
};

// egy témakör (az elemzések kategóriái és az Akadémia saját témakörei közül) azonosító vagy név szerint
export function getAkademiaKategoria(slugOrName) {
  const match = (k) => k.slug === slugOrName || k.name === slugOrName;
  const sajat = AKADEMIA.sajatKategoriak.find(match);
  return KATEGORIAK.find(match) || (sajat ? { ...sajat, description: AKADEMIA.leirasok[sajat.slug] } : null);
}

// az Akadémia témakörei sorrendben (útvonal, menü, lábléc, SEO)
export const AKADEMIA_KATEGORIAK = AKADEMIA.kategoriak.map(getAkademiaKategoria).filter(Boolean);

export default AKADEMIA;
