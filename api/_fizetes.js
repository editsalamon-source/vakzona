// Közös segédek a fizetési függvényekhez (api/fizetes-inditas.js, api/fizetes-webhook.js).
// Az aláhúzással kezdődő fájlból a Vercel nem csinál végpontot.
//
// Környezeti változók (Vercel → Settings → Environment Variables, supabase/README.md 12. lépés):
//   STRIPE_SECRET_KEY          a Stripe titkos kulcsa (teszt módban sk_test_…, élesben sk_live_…)
//   STRIPE_WEBHOOK_SECRET      a webhook aláíró kulcsa (whsec_…)
//   SUPABASE_SERVICE_ROLE_KEY  a Supabase titkos (secret / service_role) kulcsa, csak a webhook használja
//   VITE_SUPABASE_URL, VITE_SUPABASE_KEY  a meglévő nyilvános beállítások
// Egyik titkos kulcs sem kerülhet a repóba vagy a böngészőbe.
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Megvásárolható tanfolyam a src/content/akademia/<slug>.md fejlécéből (a vercel.json includeFiles-a csomagolja
// a függvény mellé): { slug, cim }, vagy null, ha nincs ilyen, piszkozat vagy szabad hozzáférésű.
export function zartTanfolyam(slug) {
  if (typeof slug !== "string" || !/^[a-z0-9-]{1,80}$/.test(slug)) return null;
  let raw;
  try {
    raw = readFileSync(join(process.cwd(), "src", "content", "akademia", `${slug}.md`), "utf8");
  } catch (e) {
    return null;
  }
  const head = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || "";
  const meta = {};
  for (const line of head.split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim().toLowerCase()] ??= line.slice(i + 1).trim();
  }
  if (/^(igen|true)$/i.test(meta["szabad hozzáférés"] || "") || /^(igen|true)$/i.test(meta["piszkozat"] || "")) return null;
  return { slug, cim: meta["cím"] || slug };
}

export const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

export const hiba = (status, kod, uzenet, extra = {}) => json(status, { kod, uzenet, ...extra });

// Supabase REST-hívás; a régi (JWT) kulcs az Authorization fejlécbe is mehet, az új sb_… kulcs csak az apikey-be
function supabaseHeaders(key, token = null) {
  const h = { apikey: key, "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  else if (key.split(".").length === 3) h.Authorization = `Bearer ${key}`;
  return h;
}

export async function supabase(path, { key, token, method = "GET", body } = {}) {
  const url = process.env.VITE_SUPABASE_URL;
  const r = await fetch(`${url}${path}`, {
    method,
    headers: supabaseHeaders(key, token),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await r.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`);
  return data;
}

// a belépett felhasználó a böngészőből kapott Supabase-tokenből; null, ha érvénytelen
export async function felhasznalo(request) {
  const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  try {
    const user = await supabase("/auth/v1/user", { key: process.env.VITE_SUPABASE_KEY, token });
    return user?.id && user.email_confirmed_at ? { id: user.id, email: user.email, token } : null;
  } catch (e) {
    return null;
  }
}

// Stripe API-hívás (űrlapkódolt törzs, külön csomag nélkül)
export async function stripe(path, params) {
  const r = await fetch(`https://api.stripe.com/v1${path}`, {
    method: params ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params ? new URLSearchParams(params).toString() : undefined,
  });
  const data = await r.json();
  if (!r.ok) throw new Error(`Stripe ${r.status}: ${data?.error?.message || "ismeretlen hiba"}`);
  return data;
}

// A Stripe-Signature fejléc ellenőrzése (t=…,v1=…): HMAC-SHA256 a "t.törzs" szövegen, legfeljebb 5 perces eltéréssel.
// Így a webhookot csak a Stripe hívhatja, a hamisított kérés elakad.
export function stripeAlairasRendben(raw, header, secret, turesMp = 300) {
  if (!header || !secret) return false;
  const parts = header.split(",").map((p) => p.split("="));
  const t = parts.find(([k]) => k === "t")?.[1];
  const sigs = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!t || !sigs.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > turesMp) return false;
  const expected = Buffer.from(crypto.createHmac("sha256", secret).update(`${t}.${raw}`, "utf8").digest("hex"));
  return sigs.some((s) => {
    const b = Buffer.from(s);
    return b.length === expected.length && crypto.timingSafeEqual(b, expected);
  });
}

// Számla kiállítása a sikeres fizetés után. MÉG NINCS BEKÖTVE: a számlázó (Számlázz.hu vagy Billingo) kiválasztása
// és a fiók létrehozása után ide kerül a hívása (a NAV-bejelentést a számlázó végzi). A vevő adatai a Stripe
// munkamenetéből jönnek (session.customer_details: név, e-mail, cím, ha a fizetésnél bekérjük), a tételek a
// session.metadata.tetelek alapján a src/data/fizetes.js TERMEKEK neveivel és áraival.
// Visszatérés: a számla száma, vagy null, ha nincs számlázó beállítva.
export async function szamlaKiallitas(/* session */) {
  return null;
}
