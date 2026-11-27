-- Vakzóna-fiókok: felhasználónkénti hozzáférés a védett tartalmakhoz (Akadémia-tanfolyamok, védett PDF-ek).
-- A Supabase SQL Editorában egyszer kell lefuttatni (supabase/README.md). Személyes adatot csak a beépített
-- auth.users tábla tárol (e-mail-cím, jelszó-hash); itt csak a felhasználó azonosítója szerepel.

-- ki mit nyithat meg; tartalom = "akademia/<url-azonosító>" vagy "pdf/<elemzés url-azonosítója>"
create table if not exists public.hozzaferes (
  user_id uuid not null references auth.users (id) on delete cascade,
  tartalom text not null,
  primary key (user_id, tartalom)
);

-- a védett tartalmak visszafejtő kulcsa (scripts/kulcs.mjs írja ki); so = a titkosított fájl sója,
-- így újratitkosítás után látszik, ha a kulcs elavult
create table if not exists public.kulcsok (
  tartalom text primary key,
  so text not null,
  kulcs text not null
);

alter table public.hozzaferes enable row level security;
alter table public.kulcsok enable row level security;

-- mindenki csak a saját hozzáféréseit látja
drop policy if exists "sajat hozzaferes" on public.hozzaferes;
create policy "sajat hozzaferes" on public.hozzaferes
  for select to authenticated
  using (user_id = (select auth.uid()));

-- kulcsot csak az kap, akinek hozzáférése van az adott tartalomhoz
drop policy if exists "kulcs hozzaferessel" on public.kulcsok;
create policy "kulcs hozzaferessel" on public.kulcsok
  for select to authenticated
  using (exists (
    select 1 from public.hozzaferes h
    where h.user_id = (select auth.uid()) and h.tartalom = kulcsok.tartalom
  ));

-- írni csak az SQL Editorból lehet (ott az RLS nem érvényes); a böngésző csak olvas
revoke all on public.hozzaferes, public.kulcsok from anon, authenticated;
grant select on public.hozzaferes, public.kulcsok to authenticated;

-- fiók törlése a felhasználó saját kérésére (a hozzáférései a cascade miatt vele törlődnek)
create or replace function public.torol_fiokom()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = auth.uid();
$$;

revoke execute on function public.torol_fiokom() from public, anon;
grant execute on function public.torol_fiokom() to authenticated;

-- a napi ébresztő (api/ebreszto.js) ezt hívja, hogy az ingyenes projektet ne szüneteltessék; adatot nem ad vissza
create or replace function public.ebreszto()
returns int
language sql
as $$ select 1 $$;

grant execute on function public.ebreszto() to anon;

-- ---------- Adminok és meghívások (2026-10-31; az adminoldal: /admin) ----------

-- adminok: csak az SQL Editorból vehető fel (insert into public.adminok select id from auth.users where email = '…')
create table if not exists public.adminok (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- előre kiadott hozzáférés egy még nem regisztrált (vagy meg nem erősített) e-mail-címre;
-- a fiók megerősítésekor hozzáféréssé válik, és a meghívás törlődik
create table if not exists public.meghivasok (
  email text not null,
  tartalom text not null,
  letrehozva timestamptz not null default now(),
  primary key (email, tartalom)
);

-- közvetlenül senki sem olvassa és írja őket, csak az alábbi függvények
alter table public.adminok enable row level security;
alter table public.meghivasok enable row level security;
revoke all on public.adminok, public.meghivasok from anon, authenticated;

create or replace function public.admin_e()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.adminok where user_id = auth.uid());
$$;

-- a felhasználók listája a hozzáféréseikkel (csak adminnak)
create or replace function public.admin_felhasznalok()
returns table (id uuid, email text, megerositve timestamptz, utolso_belepes timestamptz, letrehozva timestamptz, tartalmak text[])
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.admin_e() then
    raise exception 'Nincs jogosultság.' using errcode = '42501';
  end if;
  return query
    select u.id, u.email::text, u.email_confirmed_at, u.last_sign_in_at, u.created_at,
           coalesce(array_agg(h.tartalom order by h.tartalom) filter (where h.tartalom is not null), '{}')
    from auth.users u
    left join public.hozzaferes h on h.user_id = u.id
    group by u.id
    order by u.created_at desc;
end;
$$;

-- hozzáférés megadása (van = true) vagy visszavonása (van = false)
create or replace function public.admin_hozzaferes(p_user uuid, p_tartalom text, p_van boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.admin_e() then
    raise exception 'Nincs jogosultság.' using errcode = '42501';
  end if;
  if p_van then
    insert into public.hozzaferes (user_id, tartalom) values (p_user, p_tartalom) on conflict do nothing;
  else
    delete from public.hozzaferes where user_id = p_user and tartalom = p_tartalom;
  end if;
end;
$$;

create or replace function public.admin_meghivasok()
returns table (email text, tartalom text, letrehozva timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.admin_e() then
    raise exception 'Nincs jogosultság.' using errcode = '42501';
  end if;
  return query select m.email, m.tartalom, m.letrehozva from public.meghivasok m order by m.letrehozva desc;
end;
$$;

-- meghívás e-mail-címre; ha már van megerősített fiók ezzel a címmel, rögtön hozzáférést ad.
-- Visszatérés: 'hozzaferes' | 'meghivas' | 'torolve'
create or replace function public.admin_meghivas(p_email text, p_tartalom text, p_van boolean)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
  v_user uuid;
begin
  if not public.admin_e() then
    raise exception 'Nincs jogosultság.' using errcode = '42501';
  end if;
  if not p_van then
    delete from public.meghivasok where email = v_email and tartalom = p_tartalom;
    return 'torolve';
  end if;
  select id into v_user from auth.users where lower(email) = v_email and email_confirmed_at is not null;
  if v_user is not null then
    insert into public.hozzaferes (user_id, tartalom) values (v_user, p_tartalom) on conflict do nothing;
    return 'hozzaferes';
  end if;
  insert into public.meghivasok (email, tartalom) values (v_email, p_tartalom) on conflict do nothing;
  return 'meghivas';
end;
$$;

revoke execute on function public.admin_e(), public.admin_felhasznalok(), public.admin_hozzaferes(uuid, text, boolean),
  public.admin_meghivasok(), public.admin_meghivas(text, text, boolean) from public, anon;
grant execute on function public.admin_e(), public.admin_felhasznalok(), public.admin_hozzaferes(uuid, text, boolean),
  public.admin_meghivasok(), public.admin_meghivas(text, text, boolean) to authenticated;

-- a fiók megerősítésekor a meghívásokból hozzáférés lesz
create or replace function public.meghivas_bevaltasa()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email_confirmed_at is not null and (tg_op = 'INSERT' or old.email_confirmed_at is null) then
    insert into public.hozzaferes (user_id, tartalom)
      select new.id, m.tartalom from public.meghivasok m where m.email = lower(new.email)
      on conflict do nothing;
    delete from public.meghivasok where email = lower(new.email);
  end if;
  return new;
end;
$$;

drop trigger if exists meghivas_bevaltasa on auth.users;
create trigger meghivas_bevaltasa
  after insert or update of email_confirmed_at on auth.users
  for each row execute function public.meghivas_bevaltasa();

-- ---------- Értesítés új felhasználóról (2026-11-04) ----------
-- Amikor egy új fiókot megerősítenek, minden admin kap egy általános levelet az adminoldal linkjével.
-- A levélben nincs név, e-mail-cím vagy más adat a felhasználóról. Küldés a Brevo API-n át (pg_net, aszinkron),
-- a Brevo API-kulcsa a Supabase Vaultban van (supabase/README.md, 10. lépés); ha nincs beállítva, nem küld semmit.
-- Hiba esetén sem akadályozza a regisztrációt.

create extension if not exists pg_net with schema extensions;

create or replace function public.uj_felhasznalo_ertesites()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_kulcs text;
  v_admin text;
begin
  if new.email_confirmed_at is null or (tg_op = 'UPDATE' and old.email_confirmed_at is not null) then
    return new;
  end if;
  begin
    select decrypted_secret into v_kulcs from vault.decrypted_secrets where name = 'brevo_api_kulcs';
    if v_kulcs is null then
      return new;
    end if;
    for v_admin in
      select u.email from public.adminok a join auth.users u on u.id = a.user_id
      where u.email is not null and u.id <> new.id
    loop
      perform net.http_post(
        url := 'https://api.brevo.com/v3/smtp/email',
        headers := jsonb_build_object('api-key', v_kulcs, 'content-type', 'application/json', 'accept', 'application/json'),
        body := jsonb_build_object(
          'sender', jsonb_build_object('name', 'Vakzóna', 'email', 'noreply@vakzona.com'),
          'to', jsonb_build_array(jsonb_build_object('email', v_admin)),
          'subject', 'Új felhasználó regisztrált – Vakzóna',
          'htmlContent', '<p>Új felhasználó regisztrált és megerősítette a fiókját a Vakzónán.</p>'
            || '<p>A hozzáférései az adminoldalon állíthatók be:</p>'
            || '<p><a href="https://vakzona.com/admin">Hozzáférések kezelése</a></p>',
          'textContent', 'Új felhasználó regisztrált és megerősítette a fiókját a Vakzónán. '
            || 'A hozzáférései az adminoldalon állíthatók be: https://vakzona.com/admin'
        )
      );
    end loop;
  exception when others then
    raise warning 'uj_felhasznalo_ertesites: %', sqlerrm;
  end;
  return new;
end;
$$;

revoke execute on function public.uj_felhasznalo_ertesites() from public, anon, authenticated;

drop trigger if exists uj_felhasznalo_ertesites on auth.users;
create trigger uj_felhasznalo_ertesites
  after insert or update of email_confirmed_at on auth.users
  for each row execute function public.uj_felhasznalo_ertesites();

-- ---------- Értesítő új tanfolyamról és elemzésről (2026-11-23) ----------
-- Csak annak megy levél, aki ehhez külön hozzájárult: a regisztrációkor (külön jelölőnégyzet, a fiók metaadatában
-- ertesites = true, a megerősítéskor válik feliratkozássá) vagy később a Fiók oldalon. Sor = feliratkozott.
-- Leiratkozás: a Fiók oldalon, vagy belépés nélkül a levél alján lévő linkkel (vakzona.com/leiratkozas?t=<token>).
-- A levelet az adminoldal állítja össze, és ez a függvény küldi ki a Brevo API-n át (ugyanaz a Vault-kulcs, mint fent).

create table if not exists public.ertesites (
  user_id uuid primary key references auth.users (id) on delete cascade,
  token uuid not null unique default gen_random_uuid(),
  feliratkozva timestamptz not null default now()
);

-- kiküldött értesítők naplója (hogy látsszon, miről ment már levél)
create table if not exists public.ertesites_kuldesek (
  id bigserial primary key,
  tartalom text not null,
  targy text not null,
  cimzettek int not null,
  kuldve timestamptz not null default now()
);

alter table public.ertesites enable row level security;
alter table public.ertesites_kuldesek enable row level security;
revoke all on public.ertesites, public.ertesites_kuldesek from anon, authenticated;

-- a felhasználó csak azt látja, hogy ő maga fel van-e iratkozva
drop policy if exists "sajat ertesites" on public.ertesites;
create policy "sajat ertesites" on public.ertesites
  for select to authenticated
  using (user_id = (select auth.uid()));
grant select (user_id, feliratkozva) on public.ertesites to authenticated;

-- fel- (p_be = true) vagy leiratkozás a Fiók oldalon
create or replace function public.ertesites_beallit(p_be boolean)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Nincs bejelentkezve.' using errcode = '42501';
  end if;
  if p_be then
    insert into public.ertesites (user_id) values (auth.uid()) on conflict do nothing;
  else
    delete from public.ertesites where user_id = auth.uid();
  end if;
  return p_be;
end;
$$;

-- leiratkozás belépés nélkül, a levélben kapott tokennel; true, ha volt ilyen feliratkozás
create or replace function public.ertesites_leiratkozas(p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_db int;
begin
  delete from public.ertesites where token = p_token;
  get diagnostics v_db = row_count;
  return v_db > 0;
end;
$$;

-- a regisztrációkor kért feliratkozás a fiók megerősítésekor lép életbe
create or replace function public.ertesites_feliratkozas()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email_confirmed_at is not null and (tg_op = 'INSERT' or old.email_confirmed_at is null)
     and coalesce(new.raw_user_meta_data ->> 'ertesites', '') = 'true' then
    insert into public.ertesites (user_id) values (new.id) on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists ertesites_feliratkozas on auth.users;
create trigger ertesites_feliratkozas
  after insert or update of email_confirmed_at on auth.users
  for each row execute function public.ertesites_feliratkozas();

-- a megerősített feliratkozók száma (csak adminnak)
create or replace function public.admin_ertesites_szam()
returns int
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.admin_e() then
    raise exception 'Nincs jogosultság.' using errcode = '42501';
  end if;
  return (select count(*) from public.ertesites e join auth.users u on u.id = e.user_id
          where u.email is not null and u.email_confirmed_at is not null);
end;
$$;

create or replace function public.admin_ertesites_naplo()
returns table (tartalom text, targy text, cimzettek int, kuldve timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.admin_e() then
    raise exception 'Nincs jogosultság.' using errcode = '42501';
  end if;
  return query select k.tartalom, k.targy, k.cimzettek, k.kuldve from public.ertesites_kuldesek k order by k.kuldve desc;
end;
$$;

-- Kiküldés: minden megerősített feliratkozó külön levelet kap (a címzettek nem látják egymást). A {{LEIRATKOZAS}}
-- jelölő helyére a címzett saját leiratkozó linkje kerül. p_proba = true: csak a hívó adminnak megy, naplózás nélkül.
-- Visszatérés: a kiküldött levelek száma. A Brevo ingyenes csomagja napi 300 levelet enged.
create or replace function public.admin_ertesites_kuldes(p_tartalom text, p_targy text, p_html text, p_szoveg text, p_proba boolean)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_kulcs text;
  v_db int := 0;
  v_link text;
  r record;
begin
  if not public.admin_e() then
    raise exception 'Nincs jogosultság.' using errcode = '42501';
  end if;
  select decrypted_secret into v_kulcs from vault.decrypted_secrets where name = 'brevo_api_kulcs';
  if v_kulcs is null then
    raise exception 'Nincs beállítva a Brevo API-kulcs (brevo_api_kulcs).';
  end if;
  if not p_proba and (select count(*) from public.ertesites) > 290 then
    raise exception 'Több mint 290 feliratkozó: a Brevo ingyenes napi kerete (300) nem elég egy kiküldéshez.';
  end if;

  for r in
    select u.email, e.token
    from auth.users u left join public.ertesites e on e.user_id = u.id
    where u.email is not null and u.email_confirmed_at is not null
      and (case when p_proba then u.id = auth.uid() else e.user_id is not null end)
  loop
    v_link := 'https://vakzona.com/leiratkozas' || coalesce('?t=' || r.token::text, '');
    perform net.http_post(
      url := 'https://api.brevo.com/v3/smtp/email',
      headers := jsonb_build_object('api-key', v_kulcs, 'content-type', 'application/json', 'accept', 'application/json'),
      body := jsonb_build_object(
        'sender', jsonb_build_object('name', 'Vakzóna', 'email', 'noreply@vakzona.com'),
        'to', jsonb_build_array(jsonb_build_object('email', r.email)),
        'subject', case when p_proba then '[Próba] ' else '' end || p_targy,
        'htmlContent', replace(p_html, '{{LEIRATKOZAS}}', v_link),
        'textContent', replace(p_szoveg, '{{LEIRATKOZAS}}', v_link),
        'headers', jsonb_build_object('List-Unsubscribe', '<' || v_link || '>')
      )
    );
    v_db := v_db + 1;
  end loop;

  if not p_proba then
    insert into public.ertesites_kuldesek (tartalom, targy, cimzettek) values (p_tartalom, p_targy, v_db);
  end if;
  return v_db;
end;
$$;

revoke execute on function public.ertesites_beallit(boolean), public.admin_ertesites_szam(), public.admin_ertesites_naplo(),
  public.admin_ertesites_kuldes(text, text, text, text, boolean) from public, anon;
grant execute on function public.ertesites_beallit(boolean), public.admin_ertesites_szam(), public.admin_ertesites_naplo(),
  public.admin_ertesites_kuldes(text, text, text, text, boolean) to authenticated;
revoke execute on function public.ertesites_leiratkozas(uuid) from public;
grant execute on function public.ertesites_leiratkozas(uuid) to anon, authenticated;
revoke execute on function public.ertesites_feliratkozas() from public, anon, authenticated;

-- ---------- Tanfolyami haladás a fiókban (2026-11-23) ----------

-- bejelentkezett felhasználónál a megnézett leckék a böngésző mellett ide is mentődnek (src/utils/haladas.js),
-- így gépek között is megmarad, és az admin látja, ki hol tart; tanfolyam = a tanfolyam url-azonosítója
create table if not exists public.haladas (
  user_id uuid not null references auth.users (id) on delete cascade,
  tanfolyam text not null check (char_length(tanfolyam) <= 100),
  kesz text[] not null default '{}' check (cardinality(kesz) <= 500),
  frissitve timestamptz not null default now(),
  primary key (user_id, tanfolyam)
);

alter table public.haladas enable row level security;

-- mindenki csak a saját haladását olvassa és írja
drop policy if exists "sajat haladas" on public.haladas;
create policy "sajat haladas" on public.haladas
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

revoke all on public.haladas from anon, authenticated;
grant select, insert, update on public.haladas to authenticated;

-- minden felhasználó haladása (csak adminnak)
create or replace function public.admin_haladas()
returns table (user_id uuid, tanfolyam text, kesz text[], frissitve timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.admin_e() then
    raise exception 'Nincs jogosultság.' using errcode = '42501';
  end if;
  return query select h.user_id, h.tanfolyam, h.kesz, h.frissitve from public.haladas h;
end;
$$;

revoke execute on function public.admin_haladas() from public, anon;
grant execute on function public.admin_haladas() to authenticated;

-- ---------- Fizetés (2026-11-27; kapcsoló: src/data/fizetes.js, supabase/README.md 12. lépés) ----------
-- A sikeres Stripe-fizetést az api/fizetes-webhook.js rögzíti a Supabase titkos (service_role) kulcsával.
-- A böngésző ezt a táblát nem olvassa és nem írja. A kártyaadat a Stripe-nál marad, itt nincs.

create table if not exists public.vasarlasok (
  stripe_session text primary key,          -- a Stripe Checkout munkamenet azonosítója (cs_…)
  user_id uuid references auth.users (id) on delete set null, -- fióktörlés után a könyveléshez a vásárlás megmarad
  tetelek text[] not null,                  -- tanfolyamok url-azonosítói
  osszeg integer not null,                  -- a fizetett összeg (forintban)
  penznem text not null,
  payment_intent text unique,               -- a visszatérítés ez alapján keresi vissza
  szamla text,                              -- a számla száma, ha a számlázó már kiállította
  statusz text not null default 'fizetve' check (statusz in ('fizetve', 'visszateritve')),
  letrehozva timestamptz not null default now(),
  visszateritve timestamptz
);

alter table public.vasarlasok enable row level security;
revoke all on public.vasarlasok from anon, authenticated;

-- sikeres fizetés rögzítése és a hozzáférések megadása; true = most rögzítettük, false = már megvolt
-- (a Stripe ugyanazt az eseményt többször is küldheti, ilyenkor semmi nem történik kétszer)
create or replace function public.fizetes_rogzites(p_session text, p_user uuid, p_tetelek text[], p_osszeg integer,
  p_penznem text, p_payment_intent text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uj int;
begin
  insert into public.vasarlasok (stripe_session, user_id, tetelek, osszeg, penznem, payment_intent)
    values (p_session, p_user, p_tetelek, p_osszeg, p_penznem, p_payment_intent)
    on conflict (stripe_session) do nothing;
  get diagnostics v_uj = row_count;
  if v_uj = 0 then
    return false;
  end if;
  insert into public.hozzaferes (user_id, tartalom)
    select p_user, 'akademia/' || t from unnest(p_tetelek) t
    on conflict do nothing;
  return true;
end;
$$;

create or replace function public.fizetes_szamla(p_session text, p_szamla text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.vasarlasok set szamla = p_szamla where stripe_session = p_session;
$$;

-- teljes visszatérítés: a vásárlás megjelölése, és ha p_visszavon, a vele kapott hozzáférések visszavonása
create or replace function public.fizetes_visszateritve(p_payment_intent text, p_visszavon boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v public.vasarlasok;
begin
  update public.vasarlasok set statusz = 'visszateritve', visszateritve = now()
    where payment_intent = p_payment_intent and statusz = 'fizetve'
    returning * into v;
  if v.stripe_session is not null and p_visszavon and v.user_id is not null then
    delete from public.hozzaferes
      where user_id = v.user_id and tartalom in (select 'akademia/' || t from unnest(v.tetelek) t);
  end if;
end;
$$;

-- ezeket csak a webhook hívhatja (service_role), a böngésző nem
revoke execute on function public.fizetes_rogzites(text, uuid, text[], integer, text, text),
  public.fizetes_szamla(text, text), public.fizetes_visszateritve(text, boolean) from public, anon, authenticated;
grant execute on function public.fizetes_rogzites(text, uuid, text[], integer, text, text),
  public.fizetes_szamla(text, text), public.fizetes_visszateritve(text, boolean) to service_role;

-- ---------- Vásárlási szándék (2026-11-27; src/data/fizetes.js: ONLINE_FIZETES = false) ----------
-- Amíg nincs online fizetés, a kosár ezzel küldi el a vásárlási szándékot: minden admin levelet kap a vásárló
-- e-mail-címével és a kosár tartalmával, a vásárló pedig visszaigazolást. A hozzáférést az admin adja meg kézzel
-- az adminoldalon. Küldés a Brevo API-n át (ugyanaz a Vault-kulcs, mint fent). Felhasználónként naponta legfeljebb
-- 5 beküldés, hogy a Brevo napi kerete ne fogyjon el. Fióktörléskor a beküldések is törlődnek.

create table if not exists public.vasarlasi_szandekok (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  tetelek jsonb not null,                   -- [{ slug, cim, ar }]
  osszeg integer not null,
  letrehozva timestamptz not null default now()
);

alter table public.vasarlasi_szandekok enable row level security;
revoke all on public.vasarlasi_szandekok from anon, authenticated;

create or replace function public.html_szoveg(p text)
returns text
language sql
immutable
set search_path = ''
as $$
  select replace(replace(replace(replace(coalesce(p, ''), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;');
$$;

-- 6950 → '6 950'
create or replace function public.forint_szoveg(p integer)
returns text
language sql
immutable
set search_path = ''
as $$
  select replace(to_char(p, 'FM999G999G999'), ',', ' ');
$$;

-- p_tetelek: [{ "slug": "ai-act", "cim": "AI Act megfelelés", "ar": 6950 }]; csak zárt tanfolyam lehet benne
-- (amelynek kulcsa a kulcsok táblában van). Hibakódok az üzenetben: 'nincs_belepve', 'ures', 'tul_sok'.
create or replace function public.vasarlasi_szandek(p_tetelek jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_email text;
  v_tetelek jsonb;
  v_osszeg integer;
  v_html text;
  v_szoveg text;
  v_kulcs text;
  v_admin text;
begin
  select email into v_email from auth.users where id = v_user and email_confirmed_at is not null;
  if v_user is null or v_email is null then
    raise exception 'nincs_belepve' using errcode = '42501';
  end if;

  -- csak létező zárt tanfolyam, legfeljebb 20 tétel, mindegyik egyszer; a cím hossza és az ár tartománya korlátozott
  select coalesce(jsonb_agg(jsonb_build_object('slug', slug, 'cim', cim, 'ar', ar) order by slug), '[]'::jsonb),
         coalesce(sum(ar), 0)
    into v_tetelek, v_osszeg
    from (
      select distinct on (t->>'slug')
        t->>'slug' as slug,
        left(coalesce(nullif(trim(t->>'cim'), ''), t->>'slug'), 200) as cim,
        least(greatest(coalesce(nullif(t->>'ar', '')::numeric, 0), 0), 1000000)::integer as ar
      from jsonb_array_elements(case when jsonb_typeof(p_tetelek) = 'array' then p_tetelek else '[]'::jsonb end) t
      where t->>'slug' ~ '^[a-z0-9-]{1,80}$'
        and exists (select 1 from public.kulcsok k where k.tartalom = 'akademia/' || (t->>'slug'))
      limit 20
    ) x;
  if jsonb_array_length(v_tetelek) = 0 then
    raise exception 'ures';
  end if;

  if (select count(*) from public.vasarlasi_szandekok
      where user_id = v_user and letrehozva > now() - interval '1 day') >= 5 then
    raise exception 'tul_sok';
  end if;

  insert into public.vasarlasi_szandekok (user_id, tetelek, osszeg) values (v_user, v_tetelek, v_osszeg);

  select '<table style="border-collapse:collapse">'
           || string_agg('<tr><td style="padding:4px 16px 4px 0">' || public.html_szoveg(t->>'cim') || '</td>'
                || '<td style="padding:4px 0;text-align:right;white-space:nowrap">'
                || public.forint_szoveg((t->>'ar')::integer) || ' Ft</td></tr>', '')
           || '<tr><td style="padding:8px 16px 4px 0;border-top:1px solid #e2e8f0"><strong>Összesen</strong></td>'
           || '<td style="padding:8px 0 4px;border-top:1px solid #e2e8f0;text-align:right;white-space:nowrap"><strong>'
           || public.forint_szoveg(v_osszeg) || ' Ft</strong></td></tr></table>',
         string_agg('- ' || (t->>'cim') || ': ' || public.forint_szoveg((t->>'ar')::integer) || ' Ft', E'\n')
           || E'\nÖsszesen: ' || public.forint_szoveg(v_osszeg) || ' Ft'
    into v_html, v_szoveg
    from jsonb_array_elements(v_tetelek) t;

  -- a levélküldés hibája nem akadályozza a rögzítést (a beküldések az SQL-ben is látszanak)
  begin
    select decrypted_secret into v_kulcs from vault.decrypted_secrets where name = 'brevo_api_kulcs';
    if v_kulcs is null then
      return;
    end if;
    for v_admin in
      select u.email from public.adminok a join auth.users u on u.id = a.user_id where u.email is not null
    loop
      perform net.http_post(
        url := 'https://api.brevo.com/v3/smtp/email',
        headers := jsonb_build_object('api-key', v_kulcs, 'content-type', 'application/json', 'accept', 'application/json'),
        body := jsonb_build_object(
          'sender', jsonb_build_object('name', 'Vakzóna', 'email', 'noreply@vakzona.com'),
          'to', jsonb_build_array(jsonb_build_object('email', v_admin)),
          'replyTo', jsonb_build_object('email', v_email),
          'subject', 'Vásárlási szándék: ' || public.forint_szoveg(v_osszeg) || ' Ft – Vakzóna',
          'htmlContent', '<p>Vásárlási szándék érkezett a Vakzóna kosarából.</p>'
            || '<p>Vásárló: <a href="mailto:' || public.html_szoveg(v_email) || '">' || public.html_szoveg(v_email) || '</a></p>'
            || v_html
            || '<p>Erre a levélre válaszolva közvetlenül a vásárlónak ír. A fizetés után a hozzáférést az adminoldalon adhatja meg:</p>'
            || '<p><a href="https://vakzona.com/admin">Hozzáférések kezelése</a></p>',
          'textContent', E'Vásárlási szándék érkezett a Vakzóna kosarából.\n\nVásárló: ' || v_email
            || E'\n\n' || v_szoveg
            || E'\n\nA fizetés után a hozzáférést az adminoldalon adhatja meg: https://vakzona.com/admin'
        )
      );
    end loop;
    perform net.http_post(
      url := 'https://api.brevo.com/v3/smtp/email',
      headers := jsonb_build_object('api-key', v_kulcs, 'content-type', 'application/json', 'accept', 'application/json'),
      body := jsonb_build_object(
        'sender', jsonb_build_object('name', 'Vakzóna', 'email', 'noreply@vakzona.com'),
        'to', jsonb_build_array(jsonb_build_object('email', v_email)),
        'replyTo', jsonb_build_object('email', 'info@vakzona.com'),
        'subject', 'Megkaptuk vásárlási szándékát – Vakzóna',
        'htmlContent', '<p>Köszönjük, megkaptuk vásárlási szándékát az alábbi tanfolyamokra:</p>'
          || v_html
          || '<p>Az online fizetés még kidolgozás alatt van, ezért hamarosan e-mailben jelentkezünk a fizetés részleteivel. '
          || 'A tanfolyamok a fizetés után a Vakzóna-fiókjában nyílnak meg. Ez a levél nem számla, és nem jár fizetési kötelezettséggel.</p>'
          || '<p>Ha kérdése van, írjon az <a href="mailto:info@vakzona.com">info@vakzona.com</a> címre.</p>'
          || '<p>Vakzóna<br><a href="https://vakzona.com">vakzona.com</a></p>',
        'textContent', E'Köszönjük, megkaptuk vásárlási szándékát az alábbi tanfolyamokra:\n\n' || v_szoveg
          || E'\n\nAz online fizetés még kidolgozás alatt van, ezért hamarosan e-mailben jelentkezünk a fizetés részleteivel. '
          || E'A tanfolyamok a fizetés után a Vakzóna-fiókjában nyílnak meg. Ez a levél nem számla, és nem jár fizetési kötelezettséggel.'
          || E'\n\nHa kérdése van, írjon az info@vakzona.com címre.\n\nVakzóna\nhttps://vakzona.com'
      )
    );
  exception when others then
    raise warning 'vasarlasi_szandek: %', sqlerrm;
  end;
end;
$$;

revoke execute on function public.vasarlasi_szandek(jsonb) from public, anon;
grant execute on function public.vasarlasi_szandek(jsonb) to authenticated;
