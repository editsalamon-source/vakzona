# Vakzóna-fiókok (Supabase)

Felhasználónkénti hozzáférés az Akadémia tanfolyamaihoz és a jelszóval védett PDF-ekhez. Belépés e-mail-címmel
és jelszóval, megerősítő levéllel, elfelejtett jelszó funkcióval. A közös jelszó mellette tovább működik.

Személyes adatként az e-mail-cím és a jelszó hash-e tárolódik (Supabase `auth.users`), bejelentkezett
felhasználónál pedig a tanfolyami haladás (`haladas` tábla: megnézett leckék tanfolyamonként, 2026-11-23-tól,
az adminoldalon látszik). Az oklevél neve csak a látogató böngészőjében van. Amíg a `VITE_SUPABASE_*` változók nincsenek
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
   - A Cloudflare-függvényeknek: a `wrangler.toml` `[vars]` része, ugyanez a két változó (nyilvánosak, a repóban lehetnek).
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
10. **Értesítés új felhasználóról** (2026-11-04): ha valaki regisztrál és megerősíti a fiókját, minden admin
    kap egy általános levelet az adminoldal linkjével (`vakzona.com/admin`), a felhasználó neve, e-mail-címe és
    más adata nélkül. A `schema.sql` „Értesítés új felhasználóról” szakasza (pg_net + trigger) végzi.
    - Brevo: SMTP & API → **API Keys** → Generate a new API key (név: `supabase-ertesites`). Ez nem azonos az
      SMTP-kulccsal. Ha a Brevóban be van kapcsolva az *Authorised IPs* védelem, ki kell kapcsolni (a Supabase
      kimenő címe nem fix), különben a Brevo elutasítja a hívást.
    - Supabase: Project Settings → Vault (vagy SQL Editor) → új titok, név: `brevo_api_kulcs`, érték: az API-kulcs:
      ```sql
      select vault.create_secret('<API-kulcs>', 'brevo_api_kulcs');
      ```
      A kulcs soha ne kerüljön a repóba. Lejárat vagy csere: `select vault.update_secret(id, '<új kulcs>') from vault.secrets where name = 'brevo_api_kulcs';`
    - Hibakeresés: `select status_code, content from net._http_response order by created desc limit 5;`
11. **Értesítő levél új tanfolyamról és elemzésről** (2026-11-23, bekapcsolva ugyanaznap): a feliratkozók e-mailt
    kapnak, amikor az adminoldalon kiküldjük. Csak az kap levelet, aki ehhez külön hozzájárult (regisztrációkor
    külön jelölőnégyzet, vagy később a Fiók oldalon), és bármikor leiratkozhat (Fiók oldal, vagy belépés nélkül a
    levél alján lévő link: `vakzona.com/leiratkozas?t=<token>`).
    - Bekapcsolás: (1) a `schema.sql` „Értesítő új tanfolyamról és elemzésről” szakaszának lefuttatása az SQL
      Editorban, (2) `src/data/ertesito.js`: `ERTESITO = true`, majd deploy. A Brevo API-kulcs a 10. lépésé.
    - Küldés: `/admin` → „Értesítő levél új tartalomról”: tartalom kiválasztása, a tárgy és a rövid összefoglaló
      (alapból a tanfolyam nyilvános bevezetője, illetve az elemzés alcíme) szerkeszthető, előnézet, próbalevél
      magunknak, majd kiküldés. A kiküldések naplózva vannak (`ertesites_kuldesek`), a választóban „már kiküldve”.
    - A Brevo ingyenes csomagja napi 300 levelet enged: 290 feliratkozó fölött a függvény nem küld.
    - Feliratkozók SQL-lel: `select count(*) from public.ertesites;`
12. **Kosár és fizetés** (2026-11-27). Két kapcsoló a `src/data/fizetes.js`-ben: `FIZETES` (kosár és árak
    látszanak) és `ONLINE_FIZETES`. Ár: minden zárt tanfolyam egységesen 6 950 Ft (`EGYSEGAR`, eltérés: `ARAK`).
    - **Vásárlási szándék** (`ONLINE_FIZETES = false`, így élesítve): a kosár „Vásárlási szándék elküldése” gombja a
      `vasarlasi_szandek` függvényt hívja (`schema.sql` „Vásárlási szándék” szakasza, egyszer le kell futtatni). Minden
      admin levelet kap a vásárló címével és a tételekkel (a válasz a vásárlónak megy), a vásárló visszaigazolást.
      Csak zárt tanfolyam (amelynek kulcsa a `kulcsok` táblában van), felhasználónként naponta legfeljebb 5 beküldés.
      A hozzáférést a fizetés után az adminoldalon kell kézzel megadni. Beküldések SQL-lel:
      `select s.letrehozva, u.email, s.tetelek, s.osszeg from public.vasarlasi_szandekok s join auth.users u on u.id = s.user_id order by s.letrehozva desc;`
    - **Online fizetés** (`ONLINE_FIZETES = true`, MEGÉPÍTVE, KIKAPCSOLVA): több tanfolyam egy fizetésben (Stripe
      Checkout), a hozzáférést a sikeres fizetés után a Stripe webhookja automatikusan megadja. Kód: `src/data/fizetes.js`, `src/utils/kosar.js` (a kosár a böngészőben), `src/pages/Cart.jsx` (`/kosar`),
    `functions/api/fizetes-inditas.js` (a szerver számolja az árat, ellenőrzi a belépést), `functions/api/fizetes-webhook.js`
    (aláírás-ellenőrzés, rögzítés, számla, visszatérítés), `szerver/fizetes.js`. Bekapcsolás lépésenként:
    1. Stripe-fiók (a teszt mód aktiválás és cégadatok nélkül is működik).
    2. A `schema.sql` „Fizetés” szakaszának lefuttatása az SQL Editorban.
    3. Cloudflare → Workers & Pages → vakzona → Settings → Variables and Secrets (titkosként): `STRIPE_SECRET_KEY` (teszteléshez `sk_test_…`),
       `SUPABASE_SERVICE_ROLE_KEY` (Supabase → Project Settings → API Keys, a *secret* kulcs). Titkos, a repóba
       és a chatbe nem kerülhet.
    4. Stripe → Developers → Webhooks → új végpont: `https://vakzona.com/api/fizetes-webhook`, események:
       `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`. Az aláíró kulcsot
       (`whsec_…`) `STRIPE_WEBHOOK_SECRET` néven a Cloudflare-re.
    5. `src/data/fizetes.js`: `ONLINE_FIZETES = true`, deploy, majd próbavásárlás a Stripe tesztkártyájával. Éleshez a Stripe-fiók aktiválása és az `sk_live_…` kulcs,
       új (éles) webhook-kulccsal.
    - Hátravan bekapcsolás előtt: a számlázó bekötése (`szamlaKiallitas` az `szerver/fizetes.js`-ben, Számlázz.hu vagy
      Billingo), az ÁSZF, a kosár és az adatkezelési tájékoztató `[helykitöltő]`-i (áfa, ÁSZF, megőrzési idő, ezek
      csak online fizetésnél látszanak), az
      elállási jogról szóló szöveg jogi átnézése, és a vállalkozási forma.
    - Visszatérítéskor a hozzáférés megszűnik (`VISSZATERITESKOR_VISSZAVON` a `fizetes.js`-ben), részleges
      visszatérítésnél nem.
    - Vásárlások SQL-lel: `select * from public.vasarlasok order by letrehozva desc;`

## Hozzáférés kezelése

**Adminoldal:** `vakzona.com/admin` (a menüben a fiók ikon mellett pajzs ikon, csak adminnak látszik, 2026-11-04).
Itt pipákkal adható és vonható vissza a hozzáférés, és e-mail-címre előre is kiadható (meghívás): ha a címmel
még nincs megerősített fiók, a hozzáférés a regisztráció megerősítésekor lép életbe (`meghivas_bevaltasa` trigger).
Az új tanfolyamok és `pdf védett:` dokumentumok maguktól megjelennek (`src/data/vedett.js`).

**Admin felvétele** (csak az SQL Editorból):

```sql
insert into public.adminok (user_id) select id from auth.users where email = 'valaki@example.com';
```

**Ugyanez SQL-lel** (ha az oldal nem érhető el):

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

Az ingyenes projektet egy hét tétlenség után szüneteltetik. A GitHub Actions napi ütemezése (`.github/workflows/ebreszto.yml`) az `/api/ebreszto` végponton (`functions/api/ebreszto.js`) át
naponta egyszer meghívja a `public.ebreszto()` függvényt, így ez nem történik meg.

## Költség és korlátok

Minden elem ingyenes csomagban fut (Supabase Free, Brevo Free, Cloudflare Pages Free, GitHub Actions). A Cloudflare
Pages ingyenes csomagja kereskedelmi célra is használható (a Vercel Hobby nem, ezért költöztünk 2026-11-27-én).
