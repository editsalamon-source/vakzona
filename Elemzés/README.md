# Elemzés: munkakönyvtár

Itt készülnek a Vakzóna-elemzések. Minden elemzés egy saját könyvtár,
amelynek neve a honlapon használt URL-azonosító (pl. `4-napos-munkahet`).

```
<url-azonosító>/
  ELEMZES_STATE.md          hol tart az elemzés (Claude vezeti)
  belso-forrasanyagok/      saját anyagok: csak te töltöd
  kulso-forrasanyagok/      internetes, hivatalos források: te is, Claude is
    FORRASJEGYZEK.md        minden külső forrás: kör, kiadó, eredeti URL, helyi fájl
    1_hazai/  2_eu/  3_nemzetkozi/   forráskörönként
  fejezetek/                az elemzés Markdown-fejezetei és mellékletei
  abrak/                    ábrák
```

## Szabályok röviden

- Csak ellenőrizhető, hivatalos forrásból dolgozunk. Ami letölthető, azt az
  eredeti hivatalos helyről letöltjük a `kulso-forrasanyagok/` mappába.
- A külső forrásokat legalább három körben vizsgáljuk: **hazai**, **uniós**,
  **nemzetközi**.
- Minden elemzés utolsó melléklete a **Forrásanyagok**: kizárólag külső
  források, a három kör szerint csoportosítva, az eredeti internetes helyre
  mutató, kattintható linkkel.
- A belső anyagokra nincs link, és nem kerülnek a Forrásanyagok mellékletbe.
- Tényt, számot nem találunk ki: ami hiányzik, `[helykitöltő]`.

## Hogyan indítsd?

Claude Code-ban a projekt gyökerében: „kezdjünk egy új elemzést …-ról”,
„folytassuk a … elemzést”, vagy `/elemzes`. A részletes munkafolyamat:
`.claude/skills/elemzes/SKILL.md`; az agentek: `.claude/agents/elemzes-*.md`.

## Git

A mappa tartalma a publikus GitHub-tárolóba NEM kerül fel (`.gitignore`):
a belső anyagok bizalmasak, a letöltött külső dokumentumok pedig mások
szerzői művei. Csak ez a README verziózott. A honlapon megjelenő rövidített
változat a `src/content/elemzesek/` mappában van.
