// Kosár és fizetés (supabase/schema.sql „Fizetés” és „Vásárlási szándék” szakasza, supabase/README.md 12. lépés).
// Ezt a fájlt a böngésző és a Vercel-függvények is betöltik, ezért nem importálhat semmit.

// FIZETES: a kosár és az árak látszanak (kosár ikon a menüben és a csempéken, „Kosárba” doboz, /kosar oldal).
// Ha false, egyik sem látszik.
export const FIZETES = true;

// ONLINE_FIZETES: a kosárból Stripe-fizetés indul (api/fizetes-inditas.js), a hozzáférést a webhook adja meg.
// Ha false (2026-11-27-től így élesítve), a kosár csak vásárlási szándékot küld: az adminok levelet kapnak a kosár
// tartalmáról, a vásárló visszaigazolást, a hozzáférést az admin adja meg kézzel az adminoldalon.
export const ONLINE_FIZETES = false;

// Pénznem (Stripe-kód). A Stripe a forintot is fillérben várja (100-zal osztható összeggel), ezt az
// api/fizetes-inditas.js intézi, itt az ár egész forintban áll.
export const PENZNEM = "huf";

// Minden zárt (nem szabad hozzáférésű) tanfolyam ára egységesen, forintban (a felhasználó döntése, 2026-11-27).
export const EGYSEGAR = 6950;

// eltérő ár tanfolyamonként: url-azonosító → forint
export const ARAK = {
  "ai-jartassag": 1950, // AI-jártasság (a felhasználó döntése, 2026-11-27)
};

export const ar = (slug) => (Object.prototype.hasOwnProperty.call(ARAK, slug) ? ARAK[slug] : EGYSEGAR);

// a tétel neve a fizetésnél és a számlán
export const tetelNev = (cim) => `${cim} – online videótanfolyam`;

// Visszatérítéskor (Stripe: charge.refunded) a vásárlással kapott hozzáférés megszűnjön-e.
export const VISSZATERITESKOR_VISSZAVON = true;

// a tartalomazonosító a hozzaferes táblában (ugyanaz, mint az adminoldal pipáinál)
export const tartalomId = (slug) => `akademia/${slug}`;

export const forint = (n) => `${new Intl.NumberFormat("hu-HU").format(n)} Ft`;
