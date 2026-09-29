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
Főoldal (`/`, `src/pages/Landing.jsx`: legfrissebb 3 elemzés), Elemzések (`/elemzesek`, témaszűrő `?tema=<téma-azonosító>`), egy elemzés (`/elemzesek/:slug`, `src/pages/Analysis.jsx`), Rólunk (`/rolunk`), Kapcsolat (`/kapcsolat`, e-mail: info@vakzona.com), 404.

## Új elemzés
- Egy Markdown fájl: `src/content/elemzesek/<url-azonosító>.md` (ékezet nélküli, kötőjeles fájlnév = URL).
- Fejléc `---` sorok között, `kulcs: érték`: `cím`, `alcím` (ez a keresőknek szóló leírás is), `dátum` (ÉÉÉÉ-HH-NN, ez szerint rendez), `téma` (ebből lesz a szűrőgomb), `piszkozat: igen` (csak helyben látszik, élesben és a sitemapben nem).
- A törzs elején lévő `>` idézetblokk = Összefoglaló doboz. A `##` címsorokból tartalomjegyzék lesz (3-tól). Táblázat: sima Markdown-táblázat, a `--:` jobbra igazít.
- Képek: `public/elemzesek/<url-azonosító>/…` és `![leírás](/elemzesek/<url-azonosító>/kep.webp)`; WebP-re optimalizálva.
- Az oldal SEO-ja (`src/utils/useSeo.js`) a fejlécből jön; fix oldalaké a `src/data/seo.js`-ben.

## Megjelent elemzések
- `4-napos-munkahet` (2026-09-29): a `C:\Users\salamon.edit\Documents\4napos munkahét` megvalósíthatósági tanulmány (forrás: `content/*.md`, ábrák: `abrak/`) rövidített webes változata. A teljes PDF-et a felhasználó kérésére egyelőre NEM tesszük letölthetővé (a „Jóváhagyó” mező még kitöltetlen lehet).

## Tanulságok (a sedith.art-ból átvéve)
- Ne használj opacity-crossfade animációt (Chrome fehér villanás), csak transform (slide/scale).
- Globális `box-sizing: border-box` az index.css-ben kell (sticky header miatt); ne tegyél `overflow-x: hidden`-t html/body-ra.
- Böngészős ellenőrzésnél a mobil nézetet utána állítsd vissza asztalira.
