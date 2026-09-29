export const SITE_URL = "https://vakzona.com";
export const SITE_NAME = "Vakzóna";

// Oldalankénti cím és leírás (keresőknek és megosztáshoz).
// Az egyes elemzések címe és leírása a Markdown fájl fejlécéből jön.
const seo = {
  "/": {
    title: "Vakzóna – elemzések és megvalósíthatósági tanulmányok",
    description:
      "Elemzések különböző témákban, saját megvalósíthatósági tanulmányokra, adatokra és átlátható módszertanra építve.",
  },
  "/elemzesek": {
    title: "Elemzések – Vakzóna",
    description: "A Vakzóna összes elemzése témák szerint szűrhetően.",
  },
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
