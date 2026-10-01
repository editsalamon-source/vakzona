# Forrásszabályok

Minden forrással dolgozó agent és a skill is ezt követi.

## Mi számít elfogadható külső forrásnak?

Csak **ellenőrizhető, hivatalos vagy elsődleges** forrás, a kiadó saját,
hivatalos helyén:

- jogszabálytárak: Nemzeti Jogszabálytár (njt.hu), Magyar Közlöny, EUR-Lex;
- uniós intézmények és ügynökségek (europa.eu aldomainek: Bizottság,
  Parlament, Tanács, Eurostat, Eurofound, EU-OSHA, JRC stb.);
- nemzetközi szervezetek (OECD, ILO, WHO, IMF, Világbank, ENSZ);
- hazai kormányzati szervek, hatóságok, statisztikai hivatal (KSH), MNB,
  Állami Számvevőszék, minisztériumok, önkormányzatok hivatalos oldalai;
- más országok kormányzati és hatósági oldalai;
- lektorált tudományos publikáció a kiadó vagy az intézményi repozitórium
  oldalán (DOI-val, ha van);
- kutatóintézet vagy érdekelt fél SAJÁT, elsődleges kiadványa a saját
  oldalán (pl. egy pilotprogram szervezőjének jelentése), a kiadó
  megnevezésével.

## Forráskörök

Minden külső forrás pontosan egy körbe tartozik. A kutatás mindhárom kört
lefedi, és a Forrásanyagok melléklet is e szerint tagolódik (legalább ez a
három csoport, témánként tovább bontható).

| Kör | Mappa | Mi tartozik ide |
|---|---|---|
| **Hazai** | `1_hazai/` | magyar kiadó vagy magyar vonatkozású elsődleges forrás: magyar jogszabály, KSH, MNB, magyar hatóság, minisztérium, önkormányzat, magyar kutatóintézet, érdekképviselet, párt, cég saját közlése |
| **Uniós** | `2_eu/` | az Európai Unió intézményei és ügynökségei: uniós jog (EUR-Lex), Bizottság, Parlament, Tanács, EGSZB, Eurostat, Eurofound, EU-OSHA, JRC |
| **Nemzetközi** | `3_nemzetkozi/` | nem uniós nemzetközi szervezetek (OECD, ILO, WHO, IMF, ENSZ), más országok (uniós tagállamok is) kormányzati, hatósági, egyetemi és egyéb elsődleges forrásai, nemzetközi tudományos publikációk |

## Forrás-takarékosság: csak a legfontosabbak

Kevesebb, de erősebb forrás. Az olvasónak a Forrásanyagok mellékletben a
kulcsdokumentumokat kell látnia, nem minden érintett anyagot.

- **Egy állítás, egy forrás**: a leghivatalosabb, legfrissebb elsődleges
  forrás. Második forrás csak akkor, ha ellentmond az elsőnek, vagy érdemben
  mást tesz hozzá.
- **Egy dokumentum, egy tétel**: a fő dokumentum (jelentés, jogszabály,
  adattábla), nem a róla szóló sajtóközlemény, hír vagy összefoglaló; nem
  több nyelvi változat, köztes és zárójelentés egyszerre (a zárójelentés az
  alap, a köztes csak ha más adat kell belőle).
- **Adat: egy tábla**, nem több gyorstájékoztató; a legfrissebb közlés.
- **Egy szereplő, egy álláspont**: érdekképviseletnél, pártnál a legfrissebb,
  legátfogóbb saját dokumentum.
- **Irányérték**: egy elemzés **kb. 15–20** hivatkozott forrással dolgozik,
  forráskörönként arányosan. Ha ennél több kell, a felhasználó jóváhagyása
  és az állapotfájlban indoklás kell.
- **Előbb terv, aztán keresés**: a forrásokat a kutatás ELŐTT, a brief
  kérdéseiből levezetett **forrástervben** választjuk ki (kérdésenként 1–2
  forrás), és a felhasználó jóváhagyja. Csak a tervben szereplő forrásokat
  keressük meg és töltjük le; ami nincs a tervben, azt nem.
- **Nincs „háttér” letöltés**: amit nem fogunk hivatkozni, azt nem töltjük le.

## Forrásterv (`kulso-forrasanyagok/FORRASTERV.md`)

A brief jóváhagyása után a skill (nem az agent) írja meg a témában ismert
hivatalos forrásokból. Táblázat:

`| # | Kérdés / állítás, amit alátámaszt | Javasolt forrás (kiadó, dokumentum) | Kör | Mi kell belőle (fejezet, cikk, tábla, oldal) |`

- Minden sor egy konkrét kérdést szolgál; ugyanarra a kérdésre legfeljebb két
  forrás (pl. adat + jogszabály).
- **Frissességi keresés**: kulcskérdésenként EGY rövid webes keresés (nem
  több), hogy van-e a tervezett forrásnak újabb kiadása, vagy a témában
  azóta történt-e hivatalos fejlemény (új jogszabály, ítélet, jelentés,
  adatközlés). Ha igen, a terv az újabbat tartalmazza. A keresés eredményét
  egy sorban jegyezd a terv alá.
- **Ellenálláspont**: vitatott vagy ok-okozati kérdésben (pl. „X hatása
  Y-ra”, szakpolitikai javaslat) legalább egy forrás a másik álláspontot
  vagy a bizonytalanságot képviselje (pl. eltérő eredményű hivatalos
  elemzés, a másik érdekelt fél saját dokumentuma). A „Kérdés” oszlopban
  jelöld: *(vitatott)*.
- A „Mi kell belőle” oszlop korlátozza a letöltést és a kivonatot.
- Ha egy forrás pontos URL-je nem ismert, az agent keresi meg, de csak azt
  az egy dokumentumot.

## Kivonat (`kulso-forrasanyagok/kivonatok/<KÓD>.md`)

Letöltéskor minden forrásból egyszer kivonat készül; ezután az író és az
ellenőrző agent a kivonatot olvassa, nem az eredeti fájlt.

```markdown
# <KÓD> – <cím>
Kiadó: … | Dátum: … | Kör: … | URL: <eredeti URL> | Helyi fájl: …

## Tények
- <tény / szám, szó szerint idézőjelben> (hely: o. 12 / 4. cikk / 2. tábla)
- …

## Fenntartások és érvényesség
- Fogalom / mutató alapja: <pl. „percentage of employees”, nem foglalkoztatottak> (hely)
- Hatókör, vonatkozási év, adattörés, becslés, módszertani megjegyzés (hely)
- Hatályos állapot dátuma (jogszabálynál), ill. „nem lektorált munkaanyag” stb.
```

- Csak a forrástervben megjelölt rész tényei, kb. 5–20 pont, legfeljebb kb.
  600 szó.
- **Szó szerint, hellyel**: minden szám és jogszabályi állítás a forrás
  saját szavaival (idézőjelben; idegen nyelvű forrásnál az eredeti nyelven,
  mellette zárójelben a magyar fordítás), pontos hellyel. Ne foglald össze
  saját szavaiddal azt, amire a szöveg számként vagy jogi tényként épül.
- **Fenntartások kötelezőek**: a használt számokhoz és állításokhoz tartozó
  fogalommeghatározás, a mutató alapja, hatókör, adattörés, becslés,
  lábjegyzet; ha nincs ilyen, írd: „nincs”.
- Szám: pontosan, vonatkozási évvel, mértékegységgel; jogszabály: cikk/§
  szerint, a lényeg szó szerint.
- Az eredeti fájlhoz később csak akkor nyúlunk, ha a kivonatból hiányzik
  valami; ilyenkor a kivonatot ki kell egészíteni, nem a fájlt újraolvasni
  minden fejezetnél.

A tényellenőrzéshez esetleg megnyitott, de nem hivatkozott anyag nem kerül a
mellékletbe.

## Lezáró tényellenőrzés az eredetivel

A kivonat egyetlen hibapont lehet, ezért lezárás előtt (5. fázis) a kész
szöveg MINDEN számát, dátumát és jogszabályi/ítéleti állítását egyszer az
eredeti forrással is össze kell vetni, célzottan: a kivonatban megadott
helyen (`kereses.py "<fájl>" "<kulcsszó>"`, majd csak azok az oldalak).
Teljes dokumentumot ehhez sem olvasunk végig. Az eredményt a
`munkajegyzetek/tenyellenorzes.md` rögzíti (állítás → hely → egyezik /
javítva), az eltérést a kivonatban és a szövegben is javítani kell.

## Mi nem elfogadható?

- tükörszerverek, dokumentum-megosztók, „shadow library”-k, aggregátorok
  (Scribd, SlideShare, ResearchGate-feltöltés helyett a kiadói oldal kell);
- blog, vélemény, közösségi média, Wikipédia (legfeljebb a mögötte lévő
  elsődleges forrás felkutatására);
- fizetőfal megkerülése;
- hírportál: csak akkor, ha az adott tényre nincs elsődleges forrás, és a
  felhasználó jóváhagyta; ilyenkor „K” (közepes) megbízhatósággal jelöld, és
  keresd tovább az elsődleges forrást;
- MI által generált összefoglaló vagy bármi, aminek a kiadója nem azonosítható.

Ha egy forrás hitelessége bizonytalan, ne használd; jelöltként, „bizonytalan”
címkével mutasd meg a felhasználónak.

## Letöltés

- **A tervben szereplő forrás letölthető fájlját le kell tölteni**: PDF,
  XLSX, CSV, DOCX, ODS, ZIP-elt adatállomány stb. Mindig az eredeti,
  hivatalos URL-ről (`curl -L --fail -o …`), soha nem másolatról.
- **Csak a szükséges rész**: adatbázisból csak a kellő országok/évek táblája
  (nem a teljes adatbázis); weboldal-csoportból csak a kellő aloldal; nagy
  jelentésnél, ha külön tölthető, csak a kellő fejezet.
- Letöltés után ellenőrizd a fájltípust (`file`), és hogy nem hibaoldal,
  captcha vagy bot-blokk jött-e le. Ha a letöltés blokkolt, NE kerüld meg:
  jelezd a felhasználónak, aki kézzel letöltheti.
- **HTML-oldal** (nincs letölthető fájl): a tartalmát mentsd szöveges
  pillanatképként `.md` fájlba (WebFetch), a fájl elején az eredeti URL-lel és
  a mentés dátumával.
- **Adatbázis-lekérdezés** (pl. Eurostat, KSH STADAT): töltsd le a táblát
  (CSV/XLSX), és jegyezd fel a tábla kódját és a lekérdezés dátumát.
- Fájlnév: `<FORRÁSKÓD>_<rövid-leírás>.<kiterjesztés>`, ékezet és szóköz nélkül.
- Minden letöltött vagy mentett anyag bekerül a `FORRASJEGYZEK.md`-be.

## Feldolgozás

- Tényt, számot, idézetet csak ténylegesen elolvasott forrásszövegből vegyél
  át, a pontos helyet (oldal, táblázat, fejezet) jegyezd fel a kivonatban.
- Ha két hivatalos forrás ellentmond egymásnak, mindkettőt jelezd, ne válassz
  csendben.
- Adatnál mindig rögzítsd a vonatkozási évet és a lekérdezés dátumát.
