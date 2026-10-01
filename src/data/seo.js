import KATEGORIAK from "./kategoriak";

export const SITE_URL = "https://vakzona.com";
export const SITE_NAME = "Vakzóna";

// Oldalankénti cím és leírás (keresőknek és megosztáshoz).
// Az egyes elemzések címe és leírása a Markdown fájl fejlécéből jön.
const seo = {
  "/": {
    title: "Vakzóna – független elemzések",
    description:
      "Független elemzések gazdasági, társadalmi, kulturális és történelmi témákban, hivatalos forrásokra, adatokra és átlátható módszertanra építve.",
  },
  "/elemzesek": {
    title: "Elemzések – Vakzóna",
    description: "A Vakzóna összes elemzése kategóriák szerint: gazdaság, társadalom, kultúra, történelem.",
  },
  ...Object.fromEntries(
    KATEGORIAK.map((k) => [`/${k.slug}`, { title: `${k.name} – ${SITE_NAME}`, description: k.description }]),
  ),
  "/rolunk": {
    title: "Rólunk – Vakzóna",
    description: "Kik állnak a Vakzóna mögött, és hogyan készülnek az elemzések.",
  },
  notFound: {
    title: "Az oldal nem található – Vakzóna",
    description: "A keresett oldal nem létezik, vagy elköltözött.",
  },
};

export default seo;
