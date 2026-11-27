import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FIZETES, ONLINE_FIZETES, ar, forint, tartalomId } from "../data/fizetes";
import { getCourse } from "../data/akademia";
import { useCart, removeFromCart, removeManyFromCart, clearCart } from "../utils/kosar";
import { FIOK, useAccount, accesses, startCheckout, sendPurchaseIntent } from "../utils/fiok";
import { KAPCSOLAT_EMAIL } from "../data/kapcsolat";
import Arrow from "../components/Arrow";
import NotFound from "./NotFound";
import PageCSS from "../css/Page.module.css";
import FormCSS from "../css/ProtectedPdf.module.css";
import AccountCSS from "../css/Account.module.css";
import CSS from "../css/Cart.module.css";

// Kosár (/kosar): a kiválasztott tanfolyamok egy fizetésben. Két üzemmód (src/data/fizetes.js):
// - ONLINE_FIZETES = false (2026-11-27-től élesben): a kosár vásárlási szándékot küld (supabase/schema.sql,
//   vasarlasi_szandek): az adminok levelet kapnak a kosár tartalmáról, a vásárló visszaigazolást, a hozzáférést az
//   admin adja meg kézzel.
// - ONLINE_FIZETES = true: a fizetés a Stripe saját oldalán történik (functions/api/fizetes-inditas.js), a hozzáférést a
//   sikeres fizetés után a Stripe webhookja adja meg (functions/api/fizetes-webhook.js). Ez az oldal a visszatéréskor csak
//   megvárja, amíg a hozzáférés megjelenik.
const FOLYAMATBAN = "vz_fizetes_folyamatban";

const ERRORS = {
  nincs_belepve: "A fizetéshez be kell jelentkeznie.",
  ures: "A kosár üres.",
  megvan: "A kosár minden tanfolyamához van már hozzáférése.",
  beleegyezes: "A fizetéshez kérjük, jelölje be a négyzetet.",
  kikapcsolva: "A fizetés jelenleg nem érhető el.",
  tul_sok: "Ma már több vásárlási szándékot is elküldött. Kérjük, várja meg, amíg jelentkezünk, vagy írjon az info@vakzona.com címre.",
};

// a hiba kódja: a szerverfüggvénynél e.code, a Supabase-függvénynél az üzenet maga ('ures', 'tul_sok', …)
const errorCode = (e) => (e?.code && ERRORS[e.code] ? e.code : Object.keys(ERRORS).find((k) => e?.message === k));

function Item({ slug, owned }) {
  const course = getCourse(slug);
  return (
    <li className={`${CSS.item} ${owned ? CSS.owned : ""}`}>
      <div className={CSS.itemText}>
        <Link to={`/akademia/${slug}`} className={CSS.itemTitle}>{course?.title || slug}</Link>
        {course?.subtitle && <span className="meta">{course.subtitle}</span>}
        {owned && <span className={CSS.ownedNote}>Ehhez már van hozzáférése, ezért kimarad.</span>}
      </div>
      <span className={CSS.price}>{forint(ar(slug))}</span>
      <button type="button" className={CSS.remove} onClick={() => removeFromCart(slug)} aria-label={`${course?.title || slug} eltávolítása a kosárból`}>
        Eltávolítás
      </button>
    </li>
  );
}

// Visszatérés a sikeres fizetés után: a hozzáférést a webhook adja, ez általában pár másodperc.
function Success({ user }) {
  const [state, setState] = useState({ done: [], waiting: true });
  const slugs = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem(FOLYAMATBAN) || "[]");
    } catch (e) {
      return [];
    }
  }, []);

  useEffect(() => {
    removeManyFromCart(slugs);
    if (!user) return;
    let live = true;
    let tries = 0;
    async function check() {
      const have = await accesses().catch(() => []);
      const done = slugs.filter((s) => have.includes(tartalomId(s)));
      if (!live) return;
      const all = slugs.length > 0 && done.length === slugs.length;
      if (all) sessionStorage.removeItem(FOLYAMATBAN);
      setState({ done, waiting: !all && tries < 20 });
      if (!all && tries++ < 20) setTimeout(check, 2000);
    }
    check();
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <div className={AccountCSS.card}>
      <h2 className={CSS.subTitle}>Köszönjük a vásárlást!</h2>
      {state.waiting ? (
        <p className={AccountCSS.notice}>A fizetés megérkezett, a hozzáférés megnyitása folyamatban van…</p>
      ) : state.done.length === slugs.length && slugs.length ? (
        <p className={AccountCSS.notice}>A tanfolyamok megnyíltak a fiókjában. A számlát e-mailben küldjük.</p>
      ) : (
        <p className={AccountCSS.notice}>
          A hozzáférés megnyitása a vártnál tovább tart. Kérjük, nézzen vissza pár perc múlva. Ha addig sem nyílik meg,
          írjon az <a href={`mailto:${KAPCSOLAT_EMAIL}`}>{KAPCSOLAT_EMAIL}</a> címre.
        </p>
      )}
      {slugs.length > 0 && (
        <ul className={CSS.doneList}>
          {slugs.map((s) => (
            <li key={s}>
              <Link to={`/akademia/${s}`}>{getCourse(s)?.title || s}</Link>
              <span className="meta">{state.done.includes(s) ? "megnyitva" : "folyamatban"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Cart() {
  const account = useAccount(true);
  const items = useCart();
  const [params] = useSearchParams();
  const result = params.get("fizetes");
  const [owned, setOwned] = useState([]);
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState({ busy: false, error: "" });
  const [sent, setSent] = useState(null); // az elküldött vásárlási szándék: { tetelek, osszeg }
  const user = account.user;

  // bejelentkezve a már meglévő hozzáférések kimaradnak a fizetésből
  useEffect(() => {
    if (!user) return setOwned([]);
    accesses().then((list) => setOwned(items.filter((s) => list.includes(tartalomId(s))))).catch(() => {});
  }, [user?.id, items.join(",")]);

  if (!FIZETES) return <NotFound />;

  const payable = items.filter((s) => !owned.includes(s));
  const total = payable.reduce((sum, s) => sum + ar(s), 0);

  // vásárlási szándék küldése (online fizetés nélkül)
  async function sendIntent() {
    setState({ busy: true, error: "" });
    try {
      await sendPurchaseIntent(payable.map((s) => ({ slug: s, cim: getCourse(s)?.title || s, ar: ar(s) })));
      setSent({ tetelek: payable, osszeg: total });
      removeManyFromCart(payable);
      setState({ busy: false, error: "" });
    } catch (e) {
      setState({ busy: false, error: ERRORS[errorCode(e)] || "Az elküldés nem sikerült, kérjük, próbálja újra." });
    }
  }

  async function pay() {
    setState({ busy: true, error: "" });
    try {
      const url = await startCheckout(payable, consent);
      sessionStorage.setItem(FOLYAMATBAN, JSON.stringify(payable));
      window.location.assign(url);
    } catch (e) {
      if (e.owned?.length) setOwned((o) => [...new Set([...o, ...e.owned])]);
      setState({ busy: false, error: ERRORS[errorCode(e)] || e.message || "A fizetés nem indítható, kérjük, próbálja újra." });
    }
  }

  let body;
  if (!FIOK) body = <p className={AccountCSS.notice}>A fiókos belépés nincs bekapcsolva, ezért vásárolni sem lehet.</p>;
  else if (!account.ready) body = <div className={AccountCSS.placeholder} />;
  else if (result === "siker" && ONLINE_FIZETES) body = <Success user={user} />;
  else if (sent) {
    body = (
      <div className={AccountCSS.card}>
        <h2 className={CSS.subTitle}>Köszönjük, megkaptuk!</h2>
        <p className={AccountCSS.notice}>
          Vásárlási szándékát elküldtük, a visszaigazolást a <strong>{user?.email}</strong> címre is megküldtük.
          Hamarosan e-mailben jelentkezünk a fizetés részleteivel. A tanfolyamok a fizetés után ebben a fiókban
          nyílnak meg.
        </p>
        <ul className={CSS.doneList}>
          {sent.tetelek.map((s) => (
            <li key={s}>
              <Link to={`/akademia/${s}`}>{getCourse(s)?.title || s}</Link>
              <span className="meta">{forint(ar(s))}</span>
            </li>
          ))}
        </ul>
        <div className={CSS.total}>
          <span>Összesen</span>
          <strong>{forint(sent.osszeg)}</strong>
        </div>
      </div>
    );
  }
  else if (!items.length) {
    body = (
      <div className={AccountCSS.card}>
        <p className={AccountCSS.notice}>
          {result === "megszakitva" ? "A fizetés megszakadt, nem terheltünk semmit. " : ""}A kosár üres.
        </p>
        <div className={AccountCSS.row}>
          <Link to="/akademia" className="btn">Tanfolyamok <Arrow size={12} /></Link>
        </div>
      </div>
    );
  } else {
    body = (
      <>
        {result === "megszakitva" && (
          <p className={AccountCSS.notice}>A fizetés megszakadt, nem terheltünk semmit. A kosár tartalma megmaradt.</p>
        )}
        <div className={AccountCSS.card}>
          <ul className={CSS.items}>
            {items.map((s) => <Item key={s} slug={s} owned={owned.includes(s)} />)}
          </ul>
          <div className={CSS.total}>
            <span>Összesen</span>
            <strong>{forint(total)}</strong>
          </div>
          {ONLINE_FIZETES && <p className={CSS.small}>Az ár bruttó, [helykitöltő: áfa vagy alanyi adómentesség].</p>}
        </div>

        <div className={AccountCSS.card}>
          {!user ? (
            <>
              <p className={AccountCSS.notice}>
                A megvásárolt tanfolyamok a Vakzóna-fiókjához kerülnek, ezért {ONLINE_FIZETES ? "a fizetéshez" : "a vásárláshoz"} be
                kell jelentkeznie. A kosár tartalma megmarad.
              </p>
              <div className={AccountCSS.row}>
                <Link to={`/fiok?vissza=${encodeURIComponent("/kosar")}`} className="btn">
                  Belépés vagy regisztráció <Arrow size={12} />
                </Link>
              </div>
            </>
          ) : !ONLINE_FIZETES ? (
            <>
              <p className={CSS.apology}>
                <strong>Elnézést, az online fizetés még kidolgozás alatt van.</strong> Addig a kosár tartalmát
                vásárlási szándékként elküldheti nekünk, és hamarosan e-mailben jelentkezünk a fizetés részleteivel.
                Az elküldés nem jár fizetési kötelezettséggel.
              </p>
              <p className={AccountCSS.notice}>
                Bejelentkezve: <strong>{user.email}</strong>. A tanfolyamok ehhez a fiókhoz kerülnek, és erre a címre
                válaszolunk.
              </p>
              {state.error && <p className={FormCSS.error}>{state.error}</p>}
              <div className={AccountCSS.row}>
                <button type="button" className="btn" disabled={state.busy || !payable.length} onClick={sendIntent}>
                  {state.busy ? "Küldés…" : "Vásárlási szándék elküldése"} <Arrow size={12} />
                </button>
                <button type="button" className="btn btnGhost" onClick={clearCart} disabled={state.busy}>Kosár ürítése</button>
              </div>
              <p className={CSS.small}>
                Az adatok kezeléséről az <Link to="/adatkezeles">adatkezelési tájékoztatóban</Link> olvashat.
              </p>
            </>
          ) : (
            <>
              <p className={AccountCSS.notice}>
                Bejelentkezve: <strong>{user.email}</strong>. A tanfolyamok ehhez a fiókhoz kerülnek, a számlát is
                erre a címre küldjük.
              </p>
              <label className={CSS.consent}>
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>
                  Kérem, hogy a tanfolyamok a fizetés után azonnal megnyíljanak, és tudomásul veszem, hogy ezzel
                  elveszítem a 14 napos elállási jogomat. Elfogadom az [helykitöltő: Általános Szerződési Feltételek]
                  rendelkezéseit, és megismertem az <Link to="/adatkezeles">adatkezelési tájékoztatót</Link>.
                </span>
              </label>
              {state.error && <p className={FormCSS.error}>{state.error}</p>}
              <div className={AccountCSS.row}>
                <button type="button" className="btn" disabled={state.busy || !consent || !payable.length} onClick={pay}>
                  {state.busy ? "Átirányítás…" : `Fizetés: ${forint(total)}`} <Arrow size={12} />
                </button>
                <button type="button" className="btn btnGhost" onClick={clearCart} disabled={state.busy}>Kosár ürítése</button>
              </div>
              <p className={CSS.small}>
                A fizetés a Stripe biztonságos oldalán történik, a kártyaadatok nem jutnak el a Vakzónához.
              </p>
            </>
          )}
        </div>
      </>
    );
  }

  return (
    <div className={`wrap ${PageCSS.page} ${AccountCSS.page}`}>
      <span className="tag">Akadémia</span>
      <h1 className={AccountCSS.title}>Kosár</h1>
      <div className={AccountCSS.stack}>{body}</div>
    </div>
  );
}

export default Cart;
