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
Főoldal (`/`, `src/pages/Landing.jsx`: legfrissebb 3 elemzés), Elemzések (`/elemzesek`, témaszűrő `?tema=<téma-azonosító>`), egy elemzés (`/elemzesek/:slug`, `src/pages/Analysis.jsx`), Rólunk (`/rolunk`), 404. Kapcsolat oldal nincs: még nincs vakzona.com-os e-mail cím, ne írj be kitalált címet.

## Új elemzés
- Egy Markdown fájl: `src/content/elemzesek/<url-azonosító>.md` (ékezet nélküli, kötőjeles fájlnév = URL).
- Fejléc `---` sorok között, `kulcs: érték`: `cím`, `alcím` (ez a keresőknek szóló leírás is), `dátum` (ÉÉÉÉ-HH-NN, ez szerint rendez), `téma` (ebből lesz a szűrőgomb), `piszkozat: igen` (csak helyben látszik, élesben és a sitemapben nem), `kiemelés` (nagy szám a kártyán és a főoldali lebegő kártyán; ha nincs, a logó látszik), `kiemelés szöveg` (a lebegő kártya szövege), `szám: érték | felirat` (ismételhető; számsor a főoldali sötét sávban és az elemzés fejlécében). Számot csak a tanulmányból vegyél.
- A törzs elején lévő `>` idézetblokk = Összefoglaló doboz. A `##` címsorokból tartalomjegyzék lesz (3-tól). Táblázat: sima Markdown-táblázat, a `--:` jobbra igazít.
- Képek: `public/elemzesek/<url-azonosító>/…` és `![leírás](/elemzesek/<url-azonosító>/kep.webp)`; WebP-re optimalizálva.
- Az oldal SEO-ja (`src/utils/useSeo.js`) a fejlécből jön; fix oldalaké a `src/data/seo.js`-ben.

## Megjelent elemzések
- `4-napos-munkahet` (2026-09-29): a `C:\Users\salamon.edit\Documents\4napos munkahét` megvalósíthatósági tanulmány (forrás: `content/*.md`, ábrák: `abrak/`) rövidített webes változata. A teljes PDF-et a felhasználó kérésére egyelőre NEM tesszük letölthetővé (a „Jóváhagyó” mező még kitöltetlen lehet).

## Dizájn
A https://sustainabl-finance-44.aura.build/ sablon mintájára (2026-09-29): fehér alap, Inter, nagy szoros címek, üveghatású lebegő pirula-menü, kettéosztott hero (bal: soronként felcsúszó cím, jobb: rácsminta + keringő részecskék `HeroCanvas`, egy szeletük „vakfolt”, + lebegő szám-kártya), sötét (#050505) kiemelt sáv számsorral, hírszoba-kártyák (fénykép helyett rácsmintán a kiemelt szám), slate-50 lábléc. Akcentszín a Vakzóna-narancs (#ea580c).
- Egyedi kurzor (`Cursor.jsx`): narancs pont + késve követő, forgó nyitott logókör; link fölött megnő és narancs lesz. Csak `pointer: fine` esetén.
- Nyitóképernyő (`Loader.jsx`, `utils/intro.js`): látogatásonként egyszer; a főoldali belépő animációk `INTRO_DELAY`-jel várnak rá. `prefers-reduced-motion` esetén nincs loader, részecske-mozgás és kurzorkésés.
- A beépített böngészőpanel erősen lassítja az animációkat; valós idejű ellenőrzéshez headless Chrome CDP-képernyőkép kell (lásd sedith.art memória).

## Tanulságok (a sedith.art-ból átvéve)
- Ne használj opacity-crossfade animációt (Chrome fehér villanás), csak transform (slide/scale).
- Globális `box-sizing: border-box` az index.css-ben kell (sticky header miatt); ne tegyél `overflow-x: hidden`-t html/body-ra.
- Böngészős ellenőrzésnél a mobil nézetet utána állítsd vissza asztalira.
