# VAKZÓNA – elemző weboldal

Leendő élő oldal: https://vakzona.com (a www átirányít ide). Elemzések különböző témákban, jellemzően saját megvalósíthatósági tanulmányokra építve. A felhasználó magyarul kommunikál. Az oldal egyelőre csak magyar nyelvű. Az elemzésekben tényt, számot ne találj ki: ami hiányzik, maradjon `[helykitöltő]`.

A felépítés a sedith.art (`C:\SedithArt`) mintáját követi.

## Stack
React 18 + Vite, React Router v6, Framer Motion, CSS Modules, `marked` (Markdown → HTML). Nincs Next.js.
- Fejlesztői szerver: `npm start` (nem `dev`), port 5173. Build: `npm run build` (előtte a `scripts/sitemap.mjs` legenerálja a `public/sitemap.xml`-t).
- Deploy: `git add -A && git commit && git push`, majd `vercel --prod --yes` (átmeneti hiba esetén futtasd újra).
- GitHub: editsalamon-source/vakzona (publikus); Vercel projekt: vakzona (sedith csapat), a push nem deployol automatikusan.
- Domain: vakzona.com + www.vakzona.com a projekthez adva; a DNS a regisztrátornál (registrar-servers.com / Namecheap) van.

## Oldalak
Főoldal (`/`, `src/pages/Landing.jsx`: legfrissebb elemzések + kategóriakártyák), Elemzések (`/elemzesek`, felül kategóriagombok), kategóriaoldalak (`/gazdasag`, `/tarsadalom`, `/kultura`, `/tudomany`; ugyanaz a `src/pages/Analyses.jsx` `category` proppal; az üres kategória is látszik „hamarosan” jelzéssel), egy elemzés (`/elemzesek/:slug`, `src/pages/Analysis.jsx`), Rólunk (`/rolunk`), 404. Kapcsolat oldal nincs: még nincs vakzona.com-os e-mail cím, ne írj be kitalált címet.

## Kategóriák
Négy fix kategória (2026-10-01): Gazdaság, Társadalom, Kultúra, Tudomány (a Történelem helyett, 2026-10-01; a régi `/tortenelem` cím a `vercel.json`-ban átirányít). Egyetlen forrásuk a `src/data/kategoriak.js` (azonosító = URL, név, leírás = a kategóriaoldal bevezetője és SEO-leírása); ebből épül az útvonal, a menü (a pirula-menüben csak 1180 px fölött látszanak), a lábléc, a SEO és a sitemap. Új kategóriát csak ott kell felvenni. Az oldal független: pártpolitikai téma és állásfoglalás kizárt.

## Új elemzés
- Egy Markdown fájl: `src/content/elemzesek/<url-azonosító>.md` (ékezet nélküli, kötőjeles fájlnév = URL).
- Fejléc `---` sorok között, `kulcs: érték`: `cím`, `alcím` (ez a keresőknek szóló leírás is), `dátum` (ÉÉÉÉ-HH-NN, ez szerint rendez), `kategória` (kötelező; a négy kategórianév egyike, pl. `kategória: Gazdaság`), `téma` (finomabb címke a kategórián belül, pl. Munkaerőpiac; csak kiírjuk, nem szűrünk rá), `piszkozat: igen` (csak helyben látszik, élesben és a sitemapben nem), `kiemelés` (nagy szám a kártyán és a főoldali lebegő kártyán; ha nincs, a logó látszik), `kiemelés szöveg` (a lebegő kártya szövege), `szám: érték | felirat` (ismételhető; számsor a főoldali sötét sávban és az elemzés fejlécében). Számot csak a tanulmányból vegyél.
- A törzs elején lévő `>` idézetblokk = Összefoglaló doboz. A `##` címsorokból tartalomjegyzék lesz (3-tól). Táblázat: sima Markdown-táblázat, a `--:` jobbra igazít.
- Képek: `public/elemzesek/<url-azonosító>/…` és `![leírás](/elemzesek/<url-azonosító>/kep.webp)`; WebP-re optimalizálva.
- Az oldal SEO-ja (`src/utils/useSeo.js`) a fejlécből jön; fix oldalaké a `src/data/seo.js`-ben.

## Elemzések készítése (munkaanyag)
- Az elemzések munkakönyvtára `Elemzés/<url-azonosító>/` (`belso-forrasanyagok/`: csak a felhasználó tölti; `kulso-forrasanyagok/` + `FORRASJEGYZEK.md`; `fejezetek/*.md`; `abrak/`; `ELEMZES_STATE.md`). A munkafolyamat: `.claude/skills/elemzes/` skill és `.claude/agents/elemzes-*.md` agentek.
- „Elemzés”, nem megvalósíthatósági tanulmány (az csak egy lehetséges fajtája). Kimenet: Markdown, fejezetenként.
- Minden elemzés közérthető, ismeretterjesztő nyitó fejezettel kezdődik: „Alapok: miről van szó?” (`fejezetek/00a_alapok.md`, számozatlan; a webes változatban az Összefoglaló doboz utáni első `##` szakasz): miért fontos, kulcsfogalmak példával, hogyan működik, amit könnyű összekeverni (közvéleménynek nézetet csak forrással tulajdonítunk). Az `elemzes-explainer` agent írja a kész fejezetekből, új tény nélkül (`.claude/skills/elemzes/reference/kozertheto_stilus.md`).
- Csak ellenőrizhető, hivatalos forrásból dolgozunk; ami letölthető, azt az eredeti hivatalos URL-ről letöltjük (`.claude/skills/elemzes/reference/forrasszabalyok.md`).
- Csak a legfontosabb forrásokat használjuk: egy állítás, egy (a leghivatalosabb) forrás, fő dokumentum és nem közlemény; irányérték kb. 15–20 hivatkozott forrás elemzésenként. A forrásokat kutatás előtt forrástervben (`FORRASTERV.md`) választjuk ki a felhasználóval; csak azt töltjük le, csak a szükséges részt, és forrásonként egyszer kivonat készül (`kulso-forrasanyagok/kivonatok/<KÓD>.md`), amelyből az agentek dolgoznak.
- A külső forrásokat legalább három körben vizsgáljuk: hazai, uniós, nemzetközi (mappák: `1_hazai/`, `2_eu/`, `3_nemzetkozi/`; a `FORRASJEGYZEK.md` „Kör” oszlopa).
- Minden elemzés utolsó melléklete (és a webes változat végén a `## Forrásanyagok` szakasz) kizárólag külső forrást tartalmaz, a három kör szerint csoportosítva, az eredeti internetes URL-re mutató linkkel.
- Az `Elemzés/` tartalma gitignore-olt (publikus repó), csak a README verziózott.

## Letölthető PDF
- `npm run pdf -- <url-azonosító> [--verzio 1.0] [--forras <fájl|fejezet-mappa>] [--ki <út.pdf>]`: `scripts/pdf.mjs` + sablon `scripts/pdf/sablon.css` (A4, headless Chrome, két menet; PyMuPDF kell a TOC-oldalszámokhoz, a könyvjelzőkhöz és a metaadatokhoz).
- Metaadat a webes .md fejlécéből (+ opcionális `verzió:`). Szerző mindig „Vakzóna”; a PDF-ben csak vakzona.com, dátum, verzió és az elemzés URL-je szerepel, személyes/kapcsolati adat nem.
- Kimenet alapból `Elemzés/<url-azonosító>/pdf/` (gitignore-olt); nyilvánossá tenni csak a felhasználó kérésére (`public/elemzesek/<url-azonosító>/`).

## Megjelent elemzések
- `4-napos-munkahet` (2026-09-29): szakpolitikai elemzés (2026-10-01-én átírva a régi megvalósíthatósági tanulmányból, 25 hivatalos forrással). Munkaanyag: `Elemzés/4-napos-munkahet/` (fejezetek: `fejezetek/`, a régi tanulmány: `archiv-mvt/`). A teljes PDF-et a felhasználó kérésére egyelőre NEM tesszük letölthetővé.
- `szakszervezetek` (2026-10-01): „Kell-e erősebb szakszervezet Magyarországon?” – összehasonlító szakpolitikai elemzés javaslattal, 24 hivatalos forrás, forrásterv + kivonatok alapján, lezáró tényellenőrzéssel. Munkaanyag: `Elemzés/szakszervezetek/`. PDF nélkül élesítve (a felhasználó kérésére).
- `miert-tagul-ki-a-voros-orias` (2026-10-01, élesítve 2026-10-02): „Miért tágul ki a vörös óriás?” – első Tudomány-elemzés, ismeretterjesztő magyarázat (javaslat nélkül), 7 nemzetközi forrás (hazai és uniós kör indoklással üres, a felhasználó jóváhagyásával); a 2024-es Ou–Chen-cikk preprint, a szövegben így jelölve. Munkaanyag: `Elemzés/miert-tagul-ki-a-voros-orias/`. PDF nélkül.

## Dizájn
A https://sustainabl-finance-44.aura.build/ sablon mintájára (2026-09-29): fehér alap, Inter, nagy szoros címek, üveghatású lebegő pirula-menü, kettéosztott hero (bal: soronként felcsúszó cím, jobb: rácsminta + keringő részecskék `HeroCanvas`, egy szeletük „vakfolt”, + lebegő szám-kártya), sötét (#050505) kiemelt sáv számsorral, hírszoba-kártyák (fénykép helyett rácsmintán a kiemelt szám), slate-50 lábléc. Akcentszín a Vakzóna-narancs (#ea580c).
- Kategóriacsempék a főoldalon (`CategoryTiles.jsx`, 2026-10-01): az obsidian.aura.build „Shop by Category” blokkja mintájára teljes szélességű oszlopsor; hoverre a kurzorhoz közelebbi szélről sötét réteg csúszik be futó felirattal (csak transform; érintőképernyőn nincs).
- Ábrák: fénykép helyett saját vonalas SVG-illusztrációk kategóriánként (`CategoryArt.jsx`: oszlopdiagram, népességrács, oszlopcsarnok, atom), egy narancs „vakfolt” elemmel; a csempéken és az elemzéskártyák borítóján is.
- Az oldal szövegeiben (főoldal, Rólunk) jelezzük, hogy az elemzésekhez MI-eszközöket használunk, emberi forrásellenőrzéssel.
- Egyedi kurzor (`Cursor.jsx`): narancs pont + késve követő, forgó nyitott logókör; link fölött megnő és narancs lesz. Csak `pointer: fine` esetén.
- Nyitóképernyő (`Loader.jsx`, `utils/intro.js`): látogatásonként egyszer; a főoldali belépő animációk `INTRO_DELAY`-jel várnak rá. `prefers-reduced-motion` esetén nincs loader, részecske-mozgás és kurzorkésés.
- A beépített böngészőpanel erősen lassítja az animációkat; valós idejű ellenőrzéshez headless Chrome CDP-képernyőkép kell (lásd sedith.art memória).

## Tanulságok (a sedith.art-ból átvéve)
- Ne használj opacity-crossfade animációt (Chrome fehér villanás), csak transform (slide/scale).
- Globális `box-sizing: border-box` az index.css-ben kell (sticky header miatt); ne tegyél `overflow-x: hidden`-t html/body-ra.
- Böngészős ellenőrzésnél a mobil nézetet utána állítsd vissza asztalira.
