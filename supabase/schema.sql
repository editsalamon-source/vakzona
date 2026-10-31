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
