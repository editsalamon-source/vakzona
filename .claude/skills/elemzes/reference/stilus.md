# Stíluskonvenciók (Markdown)

Minden tartalmat író vagy ellenőrző agent ezt követi, hogy az egymás után
hívott agentek egységes szöveget írjanak.

## Fájlok

- Minden fejezet és melléklet külön fájl a `fejezetek/` mappában:
  `NN_nev.md` (törzs), `Mnn_nev.md` (melléklet).
- Egy fájl egy `#` címsorral kezdődik (`# 3. Magyarországi helyzetkép`,
  `# 2. melléklet: Jogi keretek`), alatta `##`, `###` szintek. Alfejezet-
  számozás: `## 3.1 …`.
- Táblázat: sima Markdown-táblázat, számoszlop `--:` jobbra igazítással.
- Ábra: `![leírás](../abrak/fajl.png)` és alatta dőlt ábracím forrással.

## Kiemelés

- **Félkövér**: kulcstények, számok, rövid kifejezések; sose egész mondat.
- *Dőlt*: mellékletre és ábracímre utalás; sose félkövérrel együtt.

## Mellékletre mutató záró mondat

Mellékletet összefoglaló szakasz végén, külön bekezdésben:

> → *Bővebben: 4. melléklet (Helyzetkép adattáblái).*

## Hivatkozás

- Minden számszerű vagy tényszerű állítás mögött forrás: a forráskód
  szögletes zárójelben, pl. `[ESTAT-LFS]`, amely feloldható a Forrásanyagok
  mellékletben. Ha nincs forráskód-séma, a Forrásanyagok-beli tétel rövid
  neve.
- Belső forrásra csak rövid névvel hivatkozz (pl. „[belső: munkacsoporti
  jegyzet, 2026]”), link nélkül; a Forrásanyagok mellékletbe nem kerül.
- Hiányzó adat: `[helykitöltő]`, sose becslés.

## Mondatszerkesztés

- Folyó szövegben ne legyen mondatközi pontosvessző: pont, vessző vagy
  felsorolás. Kivétel: idézet és forráslista.
- Rövid, egyenes mondatok; kerüld a hosszú mellékmondat-láncot.
- A törzsszöveg szintetizál, nem másolja a mellékletet.

## Magyar nyelvhelyesség

- a/az: a kiejtett alak dönt. Magánhangzóval kezdődő szám előtt „az” (az 1.,
  az 5., az 50., az 500.), egyébként „a” (a 2., a 8., a 10.).
- Dátum: 2026. szeptember 29.; táblázatban 2026-09-29 is elfogadható.
- Ezres tagolás: szóköz (12 500), tizedesvessző (3,5).

## Amit sose tegyél

- Ne találj ki forrást, idézetet, számot.
- Ne keverd a belső és a külső forrást.
- Az összegző fejezetekbe ne írj új elemzést vagy tényt.
