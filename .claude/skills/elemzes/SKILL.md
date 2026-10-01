---
name: elemzes
description: Végigvezet egy Vakzóna-elemzés elkészítésén vagy folytatásán (feladat-meghatározás, belső és külső forrásanyagok gyűjtése hivatalos internetes forrásból letöltéssel, szerkezet, fejezetenkénti Markdown-kidolgozás, összegzés, ellenőrzés, webes változat). Akkor használd, ha a felhasználó új elemzést kezd, egy meglévőt folytat, forrást gyűjtet, fejezetet írat, vagy egy elemzés bármely lépését kéri.
---

# elemzes — Vakzóna-elemzés építő skill

Több ülésen át tartó munkafolyamatot vezényel. Az elemzés tárgya bármi lehet
(szakpolitika, piac, jogszabály, társadalmi jelenség, megvalósíthatóság stb.);
a megvalósíthatósági tanulmány csak az egyik lehetséges fajtája.

## Alapelvek (minden fázisban érvényesek)

1. **Csak ellenőrizhető, hivatalos forrásból dolgozunk.** Külső anyagot kizárólag
   a kiadó saját, hivatalos helyéről keresünk, töltünk le és dolgozunk fel
   (l. `reference/forrasszabalyok.md`). Ami ennek nem felel meg, azt nem
   használjuk, legfeljebb jelöltként megmutatjuk a felhasználónak.
2. **Tényt, számot, idézetet nem találunk ki.** Ami hiányzik, `[helykitöltő]`.
3. **Külső és belső forrás élesen elválik.**
   - `belso-forrasanyagok/`: CSAK a felhasználó tölti. Claude olvassa, de nem
     ír bele, nem töröl belőle, nem nevez át benne semmit.
   - `kulso-forrasanyagok/`: a felhasználó és Claude is tölti.
   - Belső anyagra nincs link, nem kerül a Forrásanyagok mellékletbe, és a
     webes változatba csak a felhasználó kifejezett engedélyével kerülhet
     belőle tartalom.
4. **Minden elemzésnek van Forrásanyagok melléklete**, amely KIZÁRÓLAG a külső
   forrásokat sorolja fel, mindegyiket az eredeti internetes helyére mutató,
   kattintható linkkel (nem a helyi fájlra).
5. **Csak a legfontosabb források.** Egy állítás, egy (a leghivatalosabb)
   forrás; fő dokumentum, nem közlemény vagy több változat; irányérték kb.
   15–20 hivatkozott forrás elemzésenként (l. „Forrás-takarékosság” a
   forrásszabályokban). A forrásokat kutatás ELŐTT forrástervben választjuk
   ki; amit nem hivatkozunk, azt nem töltjük le.
6. **Kivonatból dolgozunk.** Minden forrásból letöltéskor egyszer rövid
   kivonat készül (`kulso-forrasanyagok/kivonatok/<KÓD>.md`); az író és az
   ellenőrző agent ezt olvassa, nem a teljes PDF-et/HTML-t.
7. **Formátum: Markdown**, fejezetenként külön fájlban.
8. **Minden elemzés közérthető nyitó fejezettel kezdődik**: „Alapok: miről van
   szó?” (`fejezetek/00a_alapok.md`, a webes változatban az Összefoglaló
   utáni első szakasz), amely a fogalmakat, a kontextust és a gyakori
   könnyen összemosható fogalmakat ismeretterjesztő stílusban mutatja be
   (`reference/kozertheto_stilus.md`, `elemzes-explainer` agent).

## Könyvtárszerkezet

Minden elemzés a projekt `Elemzés/` mappájában, saját könyvtárban él. A
könyvtár neve az elemzés URL-azonosítója (ékezet nélküli, kötőjeles, ugyanaz,
mint a honlapon: `src/content/elemzesek/<url-azonosító>.md`).

```
Elemzés/<url-azonosító>/
  ELEMZES_STATE.md            állapotfájl (l. lent)
  belso-forrasanyagok/        a felhasználó tölti
  kulso-forrasanyagok/
    FORRASTERV.md             jóváhagyott forrásterv (kutatás előtt)
    FORRASJEGYZEK.md          minden külső forrás nyilvántartása
    kivonatok/<KÓD>.md        forrásonként rövid kivonat (ezt olvassák az agentek)
    1_hazai/                  forráskörönként (l. forrasszabalyok.md),
    2_eu/                     bennük szükség szerint témánkénti almappák:
    3_nemzetkozi/             letöltött fájlok
    munkajegyzetek/           kutatási jegyzetek, tényellenőrzés (tenyellenorzes.md)
    KEZI_LETOLTES.md          amit a felhasználónak kell kézzel letöltenie
  fejezetek/
    00_osszefoglalo.md
    00a_alapok.md             közérthető nyitó fejezet (számozatlan)
    01_<nev>.md …             törzsfejezetek
    M01_<nev>.md …            mellékletek
    Mnn_forrasanyagok.md      mindig az utolsó melléklet
  abrak/                      ábrák (a webre WebP-ben kerülnek)
```

Új elemzés indításakor hozd létre az üres szerkezetet (a `FORRASJEGYZEK.md`-t
a `reference/forrasjegyzek_sablon.md` alapján).

## Első lépés minden meghívásnál: állapot betöltése

Kérdezd meg vagy állapítsd meg, melyik elemzésről van szó, és keresd meg az
`Elemzés/<url-azonosító>/ELEMZES_STATE.md` fájlt.

- **Ha nincs**: új elemzés. Hozd létre a szerkezetet és az állapotfájlt, indulj
  a 0. fázissal.
- **Ha van**: olvasd be, és röviden mondd el, hol tartotok („Legutóbb X-nél
  álltunk meg, Y jóvá volt hagyva, most Z következik”). Ha a felhasználó konkrét
  lépést kér, ugorj oda; a fázisok sorrendje nem kötelező.

### `ELEMZES_STATE.md` sablon

```markdown
# Elemzés állapota: <munkacím>

## Fázis
<0–6>

## Feladat-brief (0. fázis)
- Tárgy és kérdés:
- Elemzés fajtája: <pl. helyzetelemzés / szakpolitikai / megvalósíthatósági / összehasonlító>
- Hatókör / kívül esik:
- Célközönség:
- Korlátok (terjedelem, határidő):
- Belső forrásanyag: <van / nincs>

## Források (1. fázis)
- Belső: <fájlok rövid listája, vagy „nincs”>
- Forrásterv: kulso-forrasanyagok/FORRASTERV.md (<n> tétel, jóváhagyva: dátum)
- Külső: l. kulso-forrasanyagok/FORRASJEGYZEK.md (<n> tétel, lezárás dátuma); kivonatok: <n>/<n>
- Forráskódok / azonosító-séma: <ha van>

## Jóváhagyott szerkezet (2. fázis)
- [ ] 00 Összefoglaló
- [ ] 01 …
- [ ] Mnn Forrásanyagok

## Haladás (3–4. fázis)
| Fájl | Állapot | Dátum | Nyitott kérdés |
|---|---|---|---|

## Ellenőrzési napló (5. fázis)
- <dátum>: <mit talált/javított>

## Webes változat (6. fázis)
- src/content/elemzesek/<url-azonosító>.md: <nincs / piszkozat / megjelent (dátum)>
```

Frissítsd MINDEN fázis vagy érdemi lépés lezárásakor.

## Fázisok

### 0. fázis: feladat meghatározása

Tisztázd a felhasználóval: mi a tárgy és a kérdés, milyen fajta elemzés,
mi a hatókör és mi esik kívül, ki az olvasó, van-e terjedelmi/időbeli korlát,
van-e (vagy lesz-e) belső forrásanyag. Írd a briefbe, és kérj rá jóváhagyást.

### 1. fázis: forrásanyagok

1. **Belső anyagok felmérése**: nézd meg, mi van a `belso-forrasanyagok/`
   mappában (csak olvasás). Ha üres, kérdezd meg, lesz-e.
2. **Forrásterv**: te magad írd meg a
   `kulso-forrasanyagok/FORRASTERV.md`-t a forrásszabályok „Forrásterv”
   része szerint: a brief kérdéseiből kiindulva kérdésenként 1–2 hivatalos
   forrás, összesen kb. 15–20, mindhárom forráskörből (hazai, uniós,
   nemzetközi; ha egy kör nem releváns, indokold), és hogy mi kell
   belőlük. Kulcskérdésenként EGY frissességi keresés (újabb kiadás vagy
   fejlemény), vitatott/ok-okozati kérdésnél ellenálláspont-forrás. Mutasd be a felhasználónak tömör táblázatban, és kérj
   jóváhagyást. Csak a jóváhagyott terv alapján menj tovább.
3. **Letöltés + kivonat, egy körben**: a jóváhagyott tervre hívd meg az
   **`elemzes-source-researcher`** agentet („letöltés” mód). Forrásonként
   megkeresi a pontos hivatalos URL-t (ha nem ismert), letölti a szükséges
   részt a forráskörének megfelelő `kulso-forrasanyagok/<n_kor>/` mappába,
   elkészíti a `kivonatok/<KÓD>.md` kivonatot, és felveszi a
   `FORRASJEGYZEK.md`-be. Ami blokkolt vagy nem található, azt jelenti, és
   nem keres helyette mást (azt te döntöd el a felhasználóval).
4. **Hiány esetén** szűk „kutatás” mód csak a konkrét hiányzó tételre
   (egy kérdés, egy pótforrás), a felhasználó jóváhagyásával.
5. Ha a felhasználó maga tett be külső anyagot, azt is vedd fel a
   forrásjegyzékbe (eredeti URL-lel; ha nem tudod ellenőrizni az eredetét,
   kérdezz rá).
6. Ha kell, alakítsatok ki forráskódokat / azonosító-sémát
   (`reference/id_scheme.md`).

### 2. fázis: szerkezet

A `reference/szerkezet_sablon.md` menüjéből a felhasználóval közösen
állítsátok össze a fejezet- és melléklet-listát (az elemzés fajtájához
igazítva). Az „Alapok” fejezet (`00a_alapok`) és a Forrásanyagok melléklet
mindig benne van, utóbbi mindig utolsóként.
Írd az állapotfájlba checklistként; ez a 3–4. fázis backlogja.

### 3–4. fázis: tartalmi kidolgozás

A backlog minden „tervezett” tételére:
1. Gyűjtsd össze a releváns forrásokat: külsőnél a `kivonatok/<KÓD>.md`
   fájlokat (nem az eredeti PDF-et/HTML-t), belsőnél a fájlt.
2. Hívd meg az **`elemzes-section-writer`** agentet: téma, célfájl(ok)
   (`fejezetek/…md`), a kivonat-lista, azonosító-séma.
3. Frissítsd a haladás-táblázatot.
4. Minden tétel után hívd meg az **`elemzes-proofreader`** agentet „fix”
   módban.

A Forrásanyagok mellékletet (`Mnn_forrasanyagok.md`) a `FORRASJEGYZEK.md`-ből
állítsd elő szkripttel, kézzel ne szerkeszd:

```
python .claude/skills/elemzes/scripts/forrasanyagok.py "Elemzés/<url-azonosító>" <melléklet-szám> "<lezárás dátuma>"
```

Csak azok a külső források kerülnek bele, amelyekre a szöveg ténylegesen
hivatkozik. A szkript kiírja a jegyzékben nem szereplő (hibás) kódokat is.
Minden szövegváltozás után futtasd újra.

### 4. fázis vége: összegzés

Ha minden elemző fejezet kész, sorrendben:
1. **`elemzes-explainer`**: az „Alapok” fejezet (`00a_alapok.md`), a kész
   fejezetekből.
2. **`elemzes-synthesizer`**: előbb a következtetések (és ha az elemzés
   fajtája ezt kívánja, javaslat) fejezet, majd az Összefoglaló, amely az
   „Alapok” fogalmaira épít, és nem ismétli őket. A javaslatot mutasd be a felhasználónak,
mielőtt továbblépnél.

### 5. fázis: ellenőrzés

Az `elemzes-proofreader` minden tartalmi lépés után fut, és önállóan is
hívható („check” vagy „fix” mód). Közben a kivonattal veti össze a
szöveget. Lezárás előtt kötelező egy teljes kör („lezáró” mód), benne:
- linkellenőrzés;
- **tényellenőrzés az eredetivel**: a kész szöveg minden száma, dátuma és
  jogszabályi/ítéleti állítása célzottan, a kivonatban megadott helyen
  összevetve az eredeti fájllal (forrásszabályok „Lezáró tényellenőrzés”);
  eredmény: `munkajegyzetek/tenyellenorzes.md`.

### 6. fázis: webes változat

Az elemzésből rövidített webes változat készül a honlapra:
`src/content/elemzesek/<url-azonosító>.md`, a projekt CLAUDE.md-jében leírt
fejléc- és formai szabályok szerint (előbb `piszkozat: igen`). Szabályok:
- az Összefoglaló doboz utáni első szakasz: „## Alapok: miről van szó?”, az
  `00a_alapok.md` rövidített változata (`reference/kozertheto_stilus.md`),
- számot, tényt csak az elemzésből vegyél át,
- belső forrásból származó tartalom csak a felhasználó engedélyével,
- a végén `## Forrásanyagok` szakasz, kizárólag külső forrásokkal, az eredeti
  URL-re mutató linkekkel,
- ábrák: `public/elemzesek/<url-azonosító>/…`, WebP-ben.
Élesítés (a `piszkozat` sor törlése, deploy) csak a felhasználó kérésére.

## Környezeti emlékeztető (Windows)

- Letöltéshez `curl -L --fail -o <fájl> "<URL>"` a Bash eszközben; utána
  ellenőrizd (`file <fájl>`), hogy tényleg a várt formátum jött-e le (nem
  HTML-hibaoldal vagy bot-blokk).
- PDF-szöveg kinyeréséhez PowerShellből `python` + `pymupdf` (csak a
  szükséges oldalak), vagy `pdftotext -enc UTF-8 -f <első> -l <utolsó>`; a
  Read eszköz `pages` paramétere itt nem működik (nincs poppler).
- Letöltött forrásban célzottan keress, ne olvasd végig:
  `python .claude/skills/elemzes/scripts/kereses.py <fájl> "kulcsszó" …`
  (PDF/DOCX/CSV/MD; találatok oldalszámmal és rövid környezettel;
  `--oldalak 3-5` adott oldalak szövege; `--info` áttekintés).
- Gépies ellenőrzések agent helyett szkripttel (kódfeloldás, kivonat-
  lefedettség, forrásszám, halmozás, `[helykitöltő]`, tiltott maradványok,
  `--linkek`, kivonatok „Fenntartások” része; lezáráskor `--lezaro`): `python .claude/skills/elemzes/scripts/ellenorzes.py "Elemzés/<url-azonosító>" [--linkek | --lezaro]`
- Agentet mindig a dedikált `elemzes-*` típussal hívj (Sonnet), ne általános
  (general-purpose) agenttel, mert az a drágább fő modellt örökli. Ne
  indíts széles, párhuzamos kutató agenteket: csak a forrásterv sorait add át.
- Python-szkriptet PowerShellből futtass, `$env:PYTHONIOENCODING="utf-8"`
  előtaggal (a Bash alatti `python` gyakran Microsoft Store stub).
