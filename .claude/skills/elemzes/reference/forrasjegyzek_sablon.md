# Forrásjegyzék és Forrásanyagok melléklet: sablonok

## 1. `kulso-forrasanyagok/FORRASJEGYZEK.md` (munkanyilvántartás)

Ez a belső munkanyilvántartás: minden külső forrás egy sor, akkor is, ha a
szövegben végül nem hivatkozunk rá.

```markdown
# Külső forrásanyagok jegyzéke: <elemzés munkacíme>

Utolsó frissítés: ÉÉÉÉ-HH-NN. Megbízhatóság: **M** = magas (hivatalos,
lektorált vagy elsődleges intézményi forrás), **K** = közepes (érdekelt fél
elsődleges közlése vagy felhasználó által jóváhagyott hírforrás).

| Kód | Kör | Cím | Kiadó | Dátum | Eredeti URL | Helyi fájl | Letöltve | Megb. | Felvette | Megjegyzés |
|---|---|---|---|---|---|---|---|---|---|---|
| EUR-WTD | uniós | 2003/88/EK irányelv … | EP és Tanács | 2003 | https://eur-lex.europa.eu/… | 2_eu/EUR-WTD_munkaido-iranyelv.pdf | 2026-09-29 | M | Claude | |
```

- „Kör”: `hazai` / `uniós` / `nemzetközi` (l. `forrasszabalyok.md`).
- A „Helyi fájl” a `kulso-forrasanyagok/`-hoz relatív út. Ha nem volt
  letölthető és pillanatkép sem készült: `–`, és a Megjegyzésben az ok.
- „Felvette”: `Claude` vagy `felhasználó`.

## 2. `fejezetek/Mnn_forrasanyagok.md` (a melléklet)

KIZÁRÓLAG külső forrás. Minden tétel kattintható link az EREDETI internetes
helyre (nem a helyi fájlra). Belső forrás soha nem szerepel benne.

```markdown
# nn. melléklet: Forrásanyagok

A források lezárásának dátuma: ÉÉÉÉ. hónap NN. Minden hivatkozás az eredeti,
hivatalos lelőhelyre mutat.

## Hazai források

| Kód | Forrás | Kiadó | Dátum | Megb. |
|---|---|---|---|---|

## Uniós források

| Kód | Forrás | Kiadó | Dátum | Megb. |
|---|---|---|---|---|
| EUR-WTD | [2003/88/EK irányelv a munkaidő-szervezés egyes szempontjairól](https://eur-lex.europa.eu/legal-content/HU/TXT/?uri=celex:32003L0088) | EP és Tanács | 2003 | M |

## Nemzetközi források

| Kód | Forrás | Kiadó | Dátum | Megb. |
|---|---|---|---|---|
```

A három csoport mindig megvan ebben a sorrendben. Egy csoporton belül
témánkénti `###` alcsoportok lehetnek. Üres csoport helyett egy mondat
indokolja, miért nincs abban a körben forrás.

## 3. Webes változat (`src/content/elemzesek/<url-azonosító>.md`)

A végén:

```markdown
## Forrásanyagok

### Hazai
- [Forrás címe (kiadó, év)](https://eredeti-url)

### Uniós
- …

### Nemzetközi
- …
```
