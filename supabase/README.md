# Vakzóna-fiókok (Supabase)

Felhasználónkénti hozzáférés az Akadémia tanfolyamaihoz és a jelszóval védett PDF-ekhez. Belépés e-mail-címmel
és jelszóval, megerősítő levéllel, elfelejtett jelszó funkcióval. A közös jelszó mellette tovább működik.

Személyes adatként csak az e-mail-cím és a jelszó hash-e tárolódik (Supabase `auth.users`). A haladás és az
oklevél neve továbbra is csak a látogató böngészőjében van. Amíg a `VITE_SUPABASE_*` változók nincsenek
beállítva, a fiók ki van kapcsolva, és az oldal úgy működik, mint eddig.

## Hogyan működik?

- A védett fájlok ugyanúgy titkosítva vannak a `public/` mappában (`scripts/akademia.mjs`, `scripts/vedett-pdf.mjs`).
- A visszafejtő kulcs a Supabase `kulcsok` táblájában van. Sorvédelem (RLS) miatt csak az a bejelentkezett
  felhasználó olvashatja, akinek a `hozzaferes` táblában sora van az adott tartalomhoz.
- Tartalomazonosítók: `akademia/<tanfolyam url-azonosítója>`, `pdf/<elemzés url-azonosítója>`.
- Újratitkosítás után (új só) a kulcsot újra be kell tölteni (lásd 6. lépés), addig a fiókos belépés
  „átmenetileg nem érhető el” üzenetet mutat.

## Beállítás (egyszer)

1. **Projekt** (kész, 2026-10-31: `vakzona`, Frankfurt, `xrbdhqvscmxvefuppvkd`): supabase.com → New project, régió: **Central EU (Frankfurt)**. Ingyenes csomag.
2. **Adatbázis:** SQL Editor → a `supabase/schema.sql` teljes tartalmának lefuttatása.
3. **Belépési mód:** Authentication → Sign In / Providers: csak az **Email** maradjon bekapcsolva,
   „Confirm email” bekapcsolva, minimális jelszóhossz: 8.
4. **Címek:** Authentication → URL Configuration
   - Site URL: `https://vakzona.com`
   - Redirect URLs: `https://vakzona.com/fiok`, `http://localhost:5173/fiok`
5. **Kulcsok az oldalnak:** Project Settings → API Keys → a *publishable* (vagy *anon*) kulcs és a projekt URL-je.
   - Helyben: `.env.local` (gitignore-olt)
     ```
     VITE_SUPABASE_URL=https://<projekt-azonosító>.supabase.co
     VITE_SUPABASE_KEY=<publishable kulcs>
     ```
   - Vercelen: Project → Settings → Environment Variables, ugyanez a két változó (Production, Preview, Development).
   - Ez a kulcs nyilvános (a böngészőbe kerül), a védelmet az RLS adja. A *secret / service_role* kulcs soha ne
     kerüljön ide.
6. **Tartalmak kulcsa** (minden újratitkosítás után is):
   ```
   node scripts/kulcs.mjs akademia/ai-strategia public/akademia/ai-strategia/tartalom.enc
   node scripts/kulcs.mjs pdf/mi-agensek public/elemzesek/mi-agensek/<fájl>.pdf.enc
   ```
   A szkript a terminálban kéri a jelszót (gépelés közben nem látszik), vagy a `VZ_JELSZO` változóból veszi. A kiírt `insert …` sort az SQL Editorban kell lefuttatni. A kimenetet ne mentsd fájlba a repóban.
7. **Levélküldés:** a Supabase beépített levelezője csak a projekt csapattagjainak küld, ezért éles használathoz
   saját SMTP kell. Uniós, ingyenes lehetőség: **Brevo** (Franciaország, napi 300 levél).
   - Brevo: fiók → Senders, Domains → `vakzona.com` hozzáadása, a megadott DNS-rekordok (DKIM, DMARC, ellenőrző TXT)
     felvétele a Namecheapnél → SMTP & API → SMTP-kulcs.
   - Supabase: Authentication → Emails → SMTP Settings: host `smtp-relay.brevo.com`, port 587, felhasználó és
     jelszó a Brevóból, feladó: `noreply@vakzona.com`, név: `Vakzóna`.
   - Az adatkezelési tájékoztatóban (`src/pages/Privacy.jsx`) a levélküldő helykitöltőjét ki kell tölteni.
8. **Magyar levélsablonok:** Authentication → Emails → Templates
   - *Confirm signup* – tárgy: `Erősítse meg a Vakzóna-fiókját`
     ```html
     <p>Köszönjük a regisztrációt.</p>
     <p>A fiók aktiválásához kattintson az alábbi linkre:</p>
     <p><a href="{{ .ConfirmationURL }}">Fiók megerősítése</a></p>
     <p>Ha nem Ön regisztrált, hagyja figyelmen kívül ezt a levelet.</p>
     ```
   - *Reset password* – tárgy: `Új jelszó beállítása – Vakzóna`
     ```html
     <p>Új jelszót kért a Vakzóna-fiókjához.</p>
     <p><a href="{{ .ConfirmationURL }}">Új jelszó beállítása</a></p>
     <p>Ha nem Ön kérte, hagyja figyelmen kívül ezt a levelet, a jelszava nem változik.</p>
     ```
9. **Meg nem erősített regisztrációk törlése** (ajánlott, adattakarékosság): Integrations → Cron → bekapcsolás,
   majd SQL Editor:
   ```sql
   select cron.schedule('megerositetlen-torlese', '0 3 * * *',
     $$delete from auth.users where email_confirmed_at is null and created_at < now() - interval '7 days'$$);
   ```
   Ha ez fut, a tájékoztatóban a „[helykitöltő] nap” helyére 7 kerül.

## Hozzáférés kezelése (SQL Editor)

```sql
-- hozzáférés adása
insert into public.hozzaferes (user_id, tartalom)
select id, 'akademia/ai-strategia' from auth.users where email = 'valaki@example.com';

-- visszavonás
delete from public.hozzaferes
where tartalom = 'akademia/ai-strategia'
  and user_id = (select id from auth.users where email = 'valaki@example.com');

-- ki mihez fér hozzá
select u.email, h.tartalom from public.hozzaferes h join auth.users u on u.id = h.user_id order by 1, 2;
```

Visszavonás után a felhasználónak a fiókján át már nem nyílik meg a tartalom. Aki a kulcsot korábban már
megkapta, technikailag megtarthatja, ezért teljes kizáráshoz új jelszóval újra kell titkosítani és a 6. lépést
megismételni.

## Ébren tartás

Az ingyenes projektet egy hét tétlenség után szüneteltetik. A `vercel.json` napi cronja (`api/ebreszto.js`)
naponta egyszer meghívja a `public.ebreszto()` függvényt, így ez nem történik meg.

## Költség és korlátok

Minden elem ingyenes csomagban fut (Supabase Free, Brevo Free, Vercel). A Vercel Hobby csomagja csak nem
kereskedelmi használatra való: fizetős tanfolyamhoz Pro csomag kell.
