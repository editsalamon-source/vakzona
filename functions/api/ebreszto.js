// Napi ébresztő (GET /api/ebreszto, a .github/workflows/ebreszto.yml hívja naponta): az ingyenes Supabase-projektet
// egy hét tétlenség után szüneteltetik, ezért naponta egyszer meghívjuk az adatbázis public.ebreszto() függvényét
// (supabase/schema.sql).
export async function onRequestGet({ env }) {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_KEY;
  const valasz = (status, body) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  if (!url || !key) return valasz(200, { ok: false, reason: "nincs beállítva" });
  const r = await fetch(`${url}/rest/v1/rpc/ebreszto`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json", ...(key.split(".").length === 3 ? { Authorization: `Bearer ${key}` } : {}) },
    body: "{}",
  });
  return valasz(r.ok ? 200 : 502, { ok: r.ok, status: r.status });
}
