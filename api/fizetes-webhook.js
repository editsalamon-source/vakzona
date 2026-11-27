// Stripe webhook (POST /api/fizetes-webhook): a sikeres fizetés után ez adja meg a hozzáférést, és innen indul a számla.
// A Stripe-ban regisztrálandó események: checkout.session.completed, checkout.session.async_payment_succeeded,
// charge.refunded (supabase/README.md 12. lépés). Csak aláírt kérést fogad el. Hiba esetén 500-zal válaszol,
// ekkor a Stripe később újrapróbálja, a rögzítés pedig ismételt hívásra sem ad kétszer hozzáférést.
import { FIZETES, VISSZATERITESKOR_VISSZAVON } from "../src/data/fizetes.js";
import { json, supabase, stripeAlairasRendben, szamlaKiallitas, zartTanfolyam } from "./_fizetes.js";

const rpc = (name, body) => supabase(`/rest/v1/rpc/${name}`, { key: process.env.SUPABASE_SERVICE_ROLE_KEY, method: "POST", body });

async function fizetve(session) {
  if (session.payment_status !== "paid") return "nem_fizetett";
  const user = session.metadata?.user_id || session.client_reference_id;
  const slugs = (session.metadata?.tetelek || "").split(",").filter((s) => zartTanfolyam(s));
  if (!user || !slugs.length) throw new Error(`Hiányos munkamenet: ${session.id}`);
  const uj = await rpc("fizetes_rogzites", {
    p_session: session.id,
    p_user: user,
    p_tetelek: slugs,
    p_osszeg: Math.round((session.amount_total || 0) / 100),
    p_penznem: session.currency || "",
    p_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null,
  });
  // számla csak az első rögzítéskor (a Stripe ugyanazt az eseményt többször is küldheti)
  if (uj) {
    const szam = await szamlaKiallitas(session);
    if (szam) await rpc("fizetes_szamla", { p_session: session.id, p_szamla: szam });
  }
  return uj ? "rogzitve" : "mar_rogzitett";
}

async function visszateritve(charge) {
  // csak a teljes visszatérítés vonja vissza a hozzáférést, a részleges nem
  if (!charge.refunded) return "reszleges";
  const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!pi) return "nincs_fizetes";
  await rpc("fizetes_visszateritve", { p_payment_intent: pi, p_visszavon: VISSZATERITESKOR_VISSZAVON });
  return "visszateritve";
}

export async function POST(request) {
  const raw = await request.text();
  if (!stripeAlairasRendben(raw, request.headers.get("stripe-signature"), process.env.STRIPE_WEBHOOK_SECRET)) {
    return json(400, { ok: false, hiba: "érvénytelen aláírás" });
  }
  if (!FIZETES || !process.env.SUPABASE_SERVICE_ROLE_KEY) return json(503, { ok: false, hiba: "kikapcsolva" });

  const event = JSON.parse(raw);
  try {
    let eredmeny = "kihagyva";
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      eredmeny = await fizetve(event.data.object);
    } else if (event.type === "charge.refunded") {
      eredmeny = await visszateritve(event.data.object);
    }
    return json(200, { ok: true, eredmeny });
  } catch (e) {
    console.error(event.type, event.id, e);
    return json(500, { ok: false });
  }
}
