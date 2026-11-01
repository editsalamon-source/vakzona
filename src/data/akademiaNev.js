// Az Akadémia neve és leírása egy helyen: menü, oldalcím, SEO, oklevél.
// Külön fájl, mert a Node-os build-szkriptek (prerender, sitemap) is használják.
const AKADEMIA = {
  name: "Vakzóna Akadémia",
  menu: "Akadémia",
  slug: "akademia",
  description: "Videós tanfolyamok a Vakzóna témáiban: leckék, letölthető anyagok és oklevél a végén.",
  // az Akadémia témakörei (a menüben és a szűrőben, /akademia/<azonosító>); a tanfolyam „kategória:” sora dönti el
  kategoriak: ["mi", "tudomany"],
  leirasok: {
    mi: "Videós tanfolyamok a mesterséges intelligenciáról: az alapoktól a módszertanon és az ágenseken át a vállalati bevezetésig.",
    tudomany: "Videós tanfolyamok tudományos témákban.",
  },
};

export default AKADEMIA;
