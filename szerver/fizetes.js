// Közös segédek a fizetési függvényekhez (functions/api/fizetes-inditas.js, functions/api/fizetes-webhook.js).
// A functions/ mappán kívül van, így a Cloudflare Pages nem csinál belőle végpontot.
//
// Környezeti változók (env): a nyilvánosak a wrangler.toml [vars] részében, a titkosak a Cloudflare felületén
// (Workers & Pages → vakzona → Settings → Variables and Secrets, supabase/README.md 12. lépés):
//   STRIPE_SECRET_KEY          a Stripe titkos kulcsa (teszt módban sk_test_…, élesben sk_live_…)
//   STRIPE_WEBHOOK_SECRET      a webhook aláíró kulcsa (whsec_…)
//   SUPABASE_SERVICE_ROLE_KEY  a Supabase titkos (secret / service_role) kulcsa, csak a webhook használja
//   VITE_SUPABASE_URL, VITE_SUPABASE_KEY  a nyilvános beállítások
// Egyik titkos kulcs sem kerülhet a repóba vagy a böngészőbe.
import TANFOLYAMOK from "./tanfolyamok.gen.js";

// Megvásárolható tanfolyam: { slug, cim }, vagy null, ha nincs ilyen, piszkozat vagy szabad hozzáférésű.
// A lista a buildkor készül a src/content/akademia/*.md fejlécéből (scripts/tanfolyamok.mjs), mert a
// Cloudflare-függvény nem olvashat fájlt.
export function zartTanfolyam(slug) {
  if (typeof slug !== "string" || !/^[a-z0-9-]{1,80}$/.test(slug)) return null;
  const cim = Object.prototype.hasOwnProperty.call(TANFOLYAMOK, slug) ? TANFOLYAMOK[slug] : null;
  return cim ? { slug, cim } : null;
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

export async function supabase(env, path, { key, token, method = "GET", body } = {}) {
  const r = await fetch(`${env.VITE_SUPABASE_URL}${path}`, {
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
export async function felhasznalo(env, request) {
  const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  try {
    const user = await supabase(env, "/auth/v1/user", { key: env.VITE_SUPABASE_KEY, token });
    return user?.id && user.email_confirmed_at ? { id: user.id, email: user.email, token } : null;
  } catch (e) {
    return null;
  }
}

// Stripe API-hívás (űrlapkódolt törzs, külön csomag nélkül)
export async function stripe(env, path, params) {
  const r = await fetch(`https://api.stripe.com/v1${path}`, {
    method: params ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params ? new URLSearchParams(params).toString() : undefined,
  });
  const data = await r.json();
  if (!r.ok) throw new Error(`Stripe ${r.status}: ${data?.error?.message || "ismeretlen hiba"}`);
  return data;
}

// A Stripe-Signature fejléc ellenőrzése (t=…,v1=…): HMAC-SHA256 a "t.törzs" szövegen, legfeljebb 5 perces eltéréssel.
// Így a webhookot csak a Stripe hívhatja, a hamisított kérés elakad. Web Crypto, Node-modul nélkül.
export async function stripeAlairasRendben(raw, header, secret, turesMp = 300) {
  if (!header || !secret) return false;
  const parts = header.split(",").map((p) => p.split("="));
  const t = parts.find(([k]) => k === "t")?.[1];
  const sigs = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!t || !sigs.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > turesMp) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(`${t}.${raw}`)));
  const expected = [...mac].map((b) => b.toString(16).padStart(2, "0")).join("");
  // állandó idejű összehasonlítás
  return sigs.some((s) => {
    if (s.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < s.length; i++) diff |= s.charCodeAt(i) ^ expected.charCodeAt(i);
    return diff === 0;
  });
}

// Számla kiállítása a sikeres fizetés után. MÉG NINCS BEKÖTVE: a számlázó (Számlázz.hu vagy Billingo) kiválasztása
// és a fiók létrehozása után ide kerül a hívása (a NAV-bejelentést a számlázó végzi). A vevő adatai a Stripe
// munkamenetéből jönnek (session.customer_details: név, e-mail, cím, ha a fizetésnél bekérjük), a tételek a
// session.metadata.tetelek alapján a src/data/fizetes.js TERMEKEK neveivel és áraival.
// Visszatérés: a számla száma, vagy null, ha nincs számlázó beállítva.
export async function szamlaKiallitas(/* env, session */) {
  return null;
}
