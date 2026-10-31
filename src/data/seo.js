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
  "/rolunk": {
    title: "Rólunk – Vakzóna",
    description: "Miről és hogyan ír a Vakzóna, és mit kínál az Akadémia: kérdések, adatok és összehasonlítások a hírek helyett, gyakorlati videós tanfolyamok.",
  },
  "/fiok": {
    title: "Fiók – Vakzóna",
    description: "Belépés, regisztráció és elfelejtett jelszó a Vakzóna-fiókhoz, amellyel a tanfolyamok és a zárolt dokumentumok felhasználónként nyílnak meg.",
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
