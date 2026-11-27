// Fizetés indítása a kosárból (src/pages/Cart.jsx → POST /api/fizetes-inditas).
// A böngésző csak a tanfolyamok azonosítóit küldi. Az árat a src/data/fizetes.js-ből, a tétel nevét a tanfolyam .md-jéből vesszük,
// a belépést a Supabase-token igazolja, a már meglévő hozzáférések kimaradnak. Válasz: { url } = a Stripe fizetőoldala.
import { FIZETES, ONLINE_FIZETES, PENZNEM, ar, tetelNev, tartalomId } from "../src/data/fizetes.js";
import { json, hiba, felhasznalo, supabase, stripe, zartTanfolyam } from "./_fizetes.js";

export async function POST(request) {
  if (!FIZETES || !ONLINE_FIZETES || !process.env.STRIPE_SECRET_KEY) return hiba(503, "kikapcsolva", "A fizetés jelenleg nem érhető el.");

  const user = await felhasznalo(request);
  if (!user) return hiba(401, "nincs_belepve", "A fizetéshez be kell jelentkeznie.");

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return hiba(400, "hibas_keres", "Hibás kérés.");
  }
  if (body?.azonnali !== true) return hiba(400, "beleegyezes", "A fizetéshez el kell fogadni a feltételeket.");

  const slugs = [...new Set(Array.isArray(body?.tetelek) ? body.tetelek : [])].filter((s) => zartTanfolyam(s));
  if (!slugs.length) return hiba(400, "ures", "A kosár üres.");

  // a felhasználó saját hozzáférései (a sor szintű védelem miatt csak a sajátjait látja)
  let have = [];
  try {
    have = (await supabase("/rest/v1/hozzaferes?select=tartalom", { key: process.env.VITE_SUPABASE_KEY, token: user.token })).map((r) => r.tartalom);
  } catch (e) {
    console.error(e);
    return hiba(502, "hiba", "A fizetés most nem indítható, kérjük, próbálja újra.");
  }
  const owned = slugs.filter((s) => have.includes(tartalomId(s)));
  const payable = slugs.filter((s) => !owned.includes(s));
  if (!payable.length) return hiba(409, "megvan", "A kosár minden tanfolyamához van már hozzáférése.", { megvan: owned });

  const origin = new URL(request.url).origin;
  const meta = { user_id: user.id, tetelek: payable.join(","), azonnali_hozzaferes: new Date().toISOString() };
  const params = {
    mode: "payment",
    locale: "hu",
    customer_email: user.email,
    client_reference_id: user.id,
    // a számlához név és cím kell; cégként vásárlónál adószám is megadható
    billing_address_collection: "required",
    "tax_id_collection[enabled]": "true",
    success_url: `${origin}/kosar?fizetes=siker`,
    cancel_url: `${origin}/kosar?fizetes=megszakitva`,
  };
  for (const [k, v] of Object.entries(meta)) {
    params[`metadata[${k}]`] = v;
    // a visszatérítés (charge.refunded) a fizetésből is visszakeresi, kié volt
    params[`payment_intent_data[metadata][${k}]`] = v;
  }
  payable.forEach((slug, i) => {
    const t = { ar: ar(slug), nev: tetelNev(zartTanfolyam(slug).cim) };
    params[`line_items[${i}][quantity]`] = "1";
    params[`line_items[${i}][price_data][currency]`] = PENZNEM;
    // a Stripe a forintot is fillérben várja, 100-zal osztható összeggel
    params[`line_items[${i}][price_data][unit_amount]`] = String(Math.round(t.ar) * 100);
    params[`line_items[${i}][price_data][product_data][name]`] = t.nev;
    params[`line_items[${i}][price_data][product_data][metadata][tanfolyam]`] = slug;
  });

  try {
    const session = await stripe("/checkout/sessions", params);
    return json(200, { url: session.url, megvan: owned });
  } catch (e) {
    console.error(e);
    return hiba(502, "hiba", "A fizetés most nem indítható, kérjük, próbálja újra.");
  }
}
