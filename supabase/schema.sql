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
