// Napi ébresztő (vercel.json crons): az ingyenes Supabase-projektet egy hét tétlenség után szüneteltetik,
// ezért naponta egyszer meghívjuk az adatbázis public.ebreszto() függvényét (supabase/schema.sql).
export default async function handler(req, res) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_KEY;
  if (!url || !key) return res.status(200).json({ ok: false, reason: "nincs beállítva" });
  const r = await fetch(`${url}/rest/v1/rpc/ebreszto`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: "{}",
  });
  res.status(r.ok ? 200 : 502).json({ ok: r.ok, status: r.status });
}
