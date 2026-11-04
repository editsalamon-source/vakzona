import KATEGORIAK from "./kategoriak.js";
import AKADEMIA from "./akademiaNev.js";

export const SITE_URL = "https://vakzona.com";
export const SITE_NAME = "Vakzóna";

// Oldalankénti cím és leírás (keresőknek és megosztáshoz).
// Az egyes elemzések címe és leírása a Markdown fájl fejlécéből jön.
const seo = {
  "/": {
    title: "Vakzóna – független elemzések",
    description:
      "Független elemzések gazdasági, társadalmi, kulturális, tudományos és MI-témákban, hivatalos forrásokra, adatokra és átlátható módszertanra építve.",
  },
  "/elemzesek": {
    title: "Elemzések – Vakzóna",
    description: "A Vakzóna összes elemzése kategóriák szerint: gazdaság, társadalom, kultúra, tudomány és mesterséges intelligencia.",
  },
  ...Object.fromEntries(
    KATEGORIAK.map((k) => [`/${k.slug}`, { title: `${k.name} – ${SITE_NAME}`, description: k.description }]),
  ),
  "/akademia": {
    title: `${AKADEMIA.name} – videós tanfolyamok`,
    description: AKADEMIA.description,
  },
  ...Object.fromEntries(
    KATEGORIAK.filter((k) => AKADEMIA.kategoriak.includes(k.slug)).map((k) => [
      `/akademia/${k.slug}`,
      { title: `${k.name} tanfolyamok – ${AKADEMIA.name}`, description: AKADEMIA.leirasok[k.slug] },
    ]),
  ),
  "/rolunk": {
    title: "Rólam – Vakzóna",
    description: "Salamon Edit, a Vakzóna szerzője: miről és hogyan írok, és mit kínál az Akadémia. Kérdések, adatok és összehasonlítások a hírek helyett, gyakorlati videós tanfolyamok.",
  },
  "/fiok": {
    title: "Fiók – Vakzóna",
    description: "Belépés, regisztráció és elfelejtett jelszó a Vakzóna-fiókhoz, amellyel a tanfolyamok és a zárolt dokumentumok felhasználónként nyílnak meg.",
  },
  "/admin": {
    title: "Hozzáférések – Vakzóna",
    description: "A Vakzóna-fiókok hozzáféréseinek kezelése.",
    noindex: true,
  },
  "/adatkezeles": {
    title: "Adatkezelési tájékoztató – Vakzóna",
    description: "Milyen adatot kezel a Vakzóna a fiókokhoz, miért, meddig, és milyen jogai vannak.",
  },
  notFound: {
    title: "Az oldal nem található – Vakzóna",
    description: "A keresett oldal nem létezik, vagy elköltözött.",
  },
};

export default seo;
