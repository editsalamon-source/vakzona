# Akadémia: munkakönyvtár

Itt vannak a Vakzóna Akadémia tanfolyamainak nem publikus munkaanyagai. Minden
tanfolyam egy saját könyvtár, amelynek neve a honlapon használt URL-azonosító
(pl. `ai-strategia` → vakzona.com/akademia/ai-strategia).

```
<url-azonosító>/
  tartalom.json   a védett tartalom: leckénként videó-URL, felirat, leírás, anyagok
  anyagok/        a letölthető anyagok (PDF, Word, Excel …)
  feliratok/      a videók WebVTT-feliratai (<lecke-azonosító>.vtt)
  videok/         csak helyi teszthez: a videófájlok (mappacsatolás is lehet)
```

## A tanfolyam két része

1. **Nyilvános:** `src/content/akademia/<url-azonosító>.md` – cím, leírás,
   bemutatóvideó, logó és a tananyag (modulok, leckék, hosszak). Ez látszik
   jelszó nélkül is.
2. **Védett:** a fenti `tartalom.json` és az anyagok. Titkosítva kerülnek a
   `public/akademia/<url-azonosító>/` mappába:

   ```
   VZ_JELSZO=… node scripts/akademia.mjs <url-azonosító>
   ```

   A jelszó sehol nem szerepel a repóban. Jelszócsere = a parancs újrafuttatása
   az új jelszóval (a látogatóktól ilyenkor újra kéri).

`tartalom.json` mintája:

```json
{
  "leckek": {
    "01": {
      "video": "https://…/01.mp4",
      "felirat": "01.vtt",
      "leiras": "Rövid Markdown-leírás (nem kötelező).",
      "anyagok": [{ "fajl": "kezikonyv.pdf", "felirat": "Kézikönyv" }]
    }
  }
}
```

A `video` lehet YouTube- vagy Vimeo-link, illetve közvetlen videófájl-URL
(mp4). A `/akademia-helyi/<url-azonosító>/<fájl>` cím csak a helyi
fejlesztői szerveren él (a `videok/` mappából), élesben nem.

## Git

A mappa tartalma nem kerül a publikus GitHub-tárolóba (`.gitignore`), csak ez
a README.
