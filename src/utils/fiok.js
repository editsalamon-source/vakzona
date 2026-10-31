import { useEffect, useSyncExternalStore } from "react";

// Vakzóna-fiók (Supabase Auth, supabase/README.md): e-mail + jelszó, felhasználónkénti hozzáférés a védett
// tartalmakhoz. Csak az e-mail-címet és a jelszó hash-ét tároljuk; a haladás és az oklevél neve továbbra is
// csak a látogató böngészőjében van. Ha a VITE_SUPABASE_URL / VITE_SUPABASE_KEY nincs megadva, a fiók ki van
// kapcsolva, és minden a közös jelszóval működik tovább.
const URL_ = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_KEY;
export const FIOK = Boolean(URL_ && KEY);

const STORAGE = "vz_fiok";

// a Supabase-klienst csak akkor töltjük be, ha van mentett munkamenet, a címben belépő link érkezett,
// vagy a látogató a fiókoldalra lép, így a többi látogatónál nem nő az oldal mérete
function hasSession() {
  try {
    return Boolean(localStorage.getItem(STORAGE)) || /access_token|error_description/.test(window.location.hash);
  } catch (e) {
    return false;
  }
}

let state = { ready: !FIOK || (typeof window !== "undefined" && !hasSession()), user: null, recovery: false };
const listeners = new Set();
const set = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

let clientPromise = null;
export function client() {
  if (!FIOK) return Promise.reject(new Error("A fiókos belépés nincs bekapcsolva."));
  clientPromise ||= import("@supabase/supabase-js").then(({ createClient }) => {
    const c = createClient(URL_, KEY, { auth: { storageKey: STORAGE, persistSession: true, detectSessionInUrl: true } });
    c.auth.onAuthStateChange((event, session) => {
      set({ ready: true, user: session?.user || null, ...(event === "PASSWORD_RECOVERY" ? { recovery: true } : {}) });
    });
    return c;
  });
  return clientPromise;
}

export function startAccount() {
  if (FIOK && !clientPromise) client().catch(() => set({ ready: true }));
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

// { ready, user, recovery }; force = a fiókoldal mindig betölti a klienst
export function useAccount(force = false) {
  const s = useSyncExternalStore(subscribe, () => state, () => state);
  useEffect(() => {
    if (force || hasSession()) startAccount();
  }, [force]);
  return s;
}

// a Supabase hibáinak magyar szövege
const MESSAGES = {
  invalid_credentials: "Hibás e-mail-cím vagy jelszó.",
  email_not_confirmed: "Az e-mail-cím még nincs megerősítve. Kérjük, kattintson a megerősítő levélben kapott linkre.",
  weak_password: "A jelszó túl gyenge. Legalább 8 karakter legyen.",
  same_password: "Az új jelszó nem lehet ugyanaz, mint a régi.",
  over_email_send_rate_limit: "Túl sok levelet kértünk rövid idő alatt. Kérjük, próbálja újra később.",
  over_request_rate_limit: "Túl sok próbálkozás. Kérjük, várjon egy kicsit.",
  email_address_invalid: "Az e-mail-cím érvénytelen.",
  validation_failed: "Kérjük, ellenőrizze a megadott adatokat.",
};
export const errorText = (e) => MESSAGES[e?.code] || "Hiba történt, kérjük, próbálja újra.";

const back = (path) => `${window.location.origin}${path}`;

async function call(fn) {
  const { data, error } = await fn(await client());
  if (error) throw error;
  return data;
}

// regisztráció; a megerősítő levél linkje a fiókoldalra visz vissza. Már regisztrált címnél a Supabase
// ugyanígy válaszol (nem árulja el, hogy a cím létezik), ezért a felület is ugyanazt az üzenetet mutatja.
export const signUp = (email, password) =>
  call((c) => c.auth.signUp({ email, password, options: { emailRedirectTo: back("/fiok") } }));

export const signIn = (email, password) => call((c) => c.auth.signInWithPassword({ email, password }));

export const resetPassword = (email) =>
  call((c) => c.auth.resetPasswordForEmail(email, { redirectTo: back("/fiok") }));

export async function updatePassword(password) {
  await call((c) => c.auth.updateUser({ password }));
  set({ recovery: false });
}

export const signOut = () => call((c) => c.auth.signOut());

export async function deleteAccount() {
  await call((c) => c.rpc("torol_fiokom"));
  await (await client()).auth.signOut({ scope: "local" });
}

// a bejelentkezett felhasználó hozzáférései: ["akademia/ai-strategia", "pdf/mi-agensek", …]
export async function accesses() {
  const rows = await call((c) => c.from("hozzaferes").select("tartalom"));
  return rows.map((r) => r.tartalom);
}

// egy védett tartalom kulcsa ({ so, kulcs }), ha a felhasználónak van hozzáférése; különben null
export const contentKey = (id) =>
  call((c) => c.from("kulcsok").select("so, kulcs").eq("tartalom", id).maybeSingle());
