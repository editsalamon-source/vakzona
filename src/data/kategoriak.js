// A Vakzóna fix kategóriái. Minden elemzés fejlécében: `kategória: <név>`.
// Az azonosító egyben az URL is (pl. /gazdasag). A sorrend a menü és a lábléc sorrendje.
// Ezt a fájlt a scripts/sitemap.mjs is beolvassa, ezért maradjon sima JS (nincs Vite-import).
const KATEGORIAK = [
  {
    slug: "mi",
    name: "MI",
    description: "Mesterséges intelligencia: hogyan működik, mire használják, hogyan szabályozzák, és mit változtat meg a munkában, a tanulásban és a mindennapokban.",
  },
  {
    slug: "tudomany",
    name: "Tudomány",
    description: "Kutatás, technológia, környezet és innováció – az eredmények mögötti bizonyítékokkal, közérthetően.",
  },
  {
    slug: "kultura",
    name: "Kultúra",
    description: "Művészet, irodalom, film, kulturális örökség és intézmények – közelről és összehasonlítva.",
  },
  {
    slug: "tarsadalom",
    name: "Társadalom",
    description: "Oktatás, egészség, demográfia, család és életmód – a számok mögötti összefüggésekkel.",
  },
  {
    slug: "gazdasag",
    name: "Gazdaság",
    description: "Munka, pénz, vállalkozás, foglalkoztatás, adózás és lakhatás – adatokkal és hivatalos forrásokkal.",
  },
];

export function getKategoria(slugOrName) {
  return KATEGORIAK.find((k) => k.slug === slugOrName || k.name === slugOrName) || null;
}

export default KATEGORIAK;
