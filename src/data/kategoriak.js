// A Vakzóna fix kategóriái. Minden elemzés fejlécében: `kategória: <név>`.
// Az azonosító egyben az URL is (pl. /gazdasag). A sorrend a menü és a lábléc sorrendje.
// Ezt a fájlt a scripts/sitemap.mjs is beolvassa, ezért maradjon sima JS (nincs Vite-import).
const KATEGORIAK = [
  {
    slug: "gazdasag",
    name: "Gazdaság",
    description: "Munka, pénz, vállalkozás, foglalkoztatás, adózás és lakhatás – adatokkal és hivatalos forrásokkal.",
  },
  {
    slug: "tarsadalom",
    name: "Társadalom",
    description: "Oktatás, egészség, demográfia, család és életmód – a számok mögötti összefüggésekkel.",
  },
  {
    slug: "kultura",
    name: "Kultúra",
    description: "Művészet, irodalom, film, kulturális örökség és intézmények – közelről és összehasonlítva.",
  },
  {
    slug: "tortenelem",
    name: "Történelem",
    description: "Korszakok, események és történeti háttér – forrásokra építve, a mai kérdésekhez kötve.",
  },
];

export function getKategoria(slugOrName) {
  return KATEGORIAK.find((k) => k.slug === slugOrName || k.name === slugOrName) || null;
}

export default KATEGORIAK;
