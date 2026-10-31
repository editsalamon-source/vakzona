import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import courses from "../data/akademia";
import analyses from "../data/analyses";
import Arrow from "../components/Arrow";
import {
  FIOK, useAccount, errorText, signIn, signUp, signOut, resetPassword, updatePassword, deleteAccount, accesses,
} from "../utils/fiok";
import PageCSS from "../css/Page.module.css";
import FormCSS from "../css/ProtectedPdf.module.css";
import CSS from "../css/Account.module.css";

const MIN = 8;
// a felület saját hibaüzenete (a Supabase hibái errorText-tel kapnak magyar szöveget)
const own = (message) => Object.assign(new Error(message), { own: true });

// a hozzáférés-azonosító (supabase/schema.sql) címe és linkje
function describe(id) {
  const [kind, slug] = id.split("/");
  if (kind === "akademia") {
    const c = courses.find((x) => x.slug === slug);
    return c && { title: c.title, kind: "Tanfolyam", to: `/akademia/${slug}` };
  }
  if (kind === "pdf") {
    const a = analyses.find((x) => x.slug === slug);
    return a?.pdfProtected && { title: a.pdfProtected.title || a.title, kind: "Védett dokumentum", to: `/elemzesek/${slug}` };
  }
  return null;
}

function Field({ id, label, ...props }) {
  return (
    <>
      <label className={FormCSS.label} htmlFor={id}>{label}</label>
      <input id={id} className={FormCSS.input} {...props} />
    </>
  );
}

// egy űrlap közös állapota: busy, hiba, siker
function useForm() {
  const [state, setState] = useState({ busy: false, error: "", done: false });
  async function run(fn) {
    setState({ busy: true, error: "", done: false });
    try {
      await fn();
      setState({ busy: false, error: "", done: true });
    } catch (e) {
      setState({ busy: false, error: e.own ? e.message : errorText(e), done: false });
    }
  }
  return [state, run];
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, run] = useForm();
  return (
    <form className={FormCSS.form} onSubmit={(e) => (e.preventDefault(), run(() => signIn(email.trim(), password)))}>
      <Field id="belepesEmail" label="E-mail-cím" type="email" autoComplete="email" required
        value={email} onChange={(e) => setEmail(e.target.value)} disabled={state.busy} />
      <Field id="belepesJelszo" label="Jelszó" type="password" autoComplete="current-password" required
        value={password} onChange={(e) => setPassword(e.target.value)} disabled={state.busy} />
      {state.error && <p className={FormCSS.error}>{state.error}</p>}
      <button type="submit" className="btn" disabled={state.busy}>
        {state.busy ? "Belépés…" : "Belépés"} <Arrow size={12} />
      </button>
    </form>
  );
}

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [state, run] = useForm();
  if (state.done) {
    return (
      <p className={CSS.notice}>
        Ha ez az e-mail-cím még nincs regisztrálva, megerősítő levelet küldtünk rá. A fiók a levélben
        kapott linkre kattintva aktiválódik.
      </p>
    );
  }
  return (
    <form
      className={FormCSS.form}
      onSubmit={(e) => {
        e.preventDefault();
        run(async () => {
          if (password.length < MIN) throw own(`A jelszó legalább ${MIN} karakter legyen.`);
          await signUp(email.trim(), password);
        });
      }}
    >
      <Field id="regEmail" label="E-mail-cím" type="email" autoComplete="email" required
        value={email} onChange={(e) => setEmail(e.target.value)} disabled={state.busy} />
      <Field id="regJelszo" label={`Jelszó (legalább ${MIN} karakter)`} type="password" autoComplete="new-password"
        required minLength={MIN} value={password} onChange={(e) => setPassword(e.target.value)} disabled={state.busy} />
      <label className={CSS.check}>
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
        <span>
          Elolvastam az <Link to="/adatkezeles" target="_blank">adatkezelési tájékoztatót</Link>, és hozzájárulok,
          hogy a fiókhoz az e-mail-címemet tárolják.
        </span>
      </label>
      {state.error && <p className={FormCSS.error}>{state.error}</p>}
      <button type="submit" className="btn" disabled={state.busy || !agree}>
        {state.busy ? "Regisztráció…" : "Regisztráció"} <Arrow size={12} />
      </button>
    </form>
  );
}

function Forgot() {
  const [email, setEmail] = useState("");
  const [state, run] = useForm();
  if (state.done) {
    return (
      <p className={CSS.notice}>
        Ha ehhez az e-mail-címhez tartozik fiók, elküldtük rá a jelszó visszaállításához szükséges linket.
      </p>
    );
  }
  return (
    <form className={FormCSS.form} onSubmit={(e) => (e.preventDefault(), run(() => resetPassword(email.trim())))}>
      <p className={FormCSS.text}>Adja meg a fiókja e-mail-címét. Küldünk rá egy linket, amellyel új jelszót állíthat be.</p>
      <Field id="elfelejtettEmail" label="E-mail-cím" type="email" autoComplete="email" required
        value={email} onChange={(e) => setEmail(e.target.value)} disabled={state.busy} />
      {state.error && <p className={FormCSS.error}>{state.error}</p>}
      <button type="submit" className="btn" disabled={state.busy}>
        {state.busy ? "Küldés…" : "Link küldése"} <Arrow size={12} />
      </button>
    </form>
  );
}

function NewPassword({ title = "Jelszó módosítása", onDone }) {
  const [password, setPassword] = useState("");
  const [state, run] = useForm();
  useEffect(() => {
    if (state.done) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.done]);
  return (
    <form
      className={FormCSS.form}
      onSubmit={(e) => {
        e.preventDefault();
        run(async () => {
          if (password.length < MIN) throw own(`A jelszó legalább ${MIN} karakter legyen.`);
          await updatePassword(password);
          setPassword("");
        });
      }}
    >
      <h2 className={CSS.blockTitle}>{title}</h2>
      <Field id="ujJelszo" label={`Új jelszó (legalább ${MIN} karakter)`} type="password" autoComplete="new-password"
        required minLength={MIN} value={password} onChange={(e) => setPassword(e.target.value)} disabled={state.busy} />
      {state.error && <p className={FormCSS.error}>{state.error}</p>}
      {state.done && <p className={CSS.ok}>Az új jelszó beállítva.</p>}
      <button type="submit" className="btn" disabled={state.busy}>
        {state.busy ? "Mentés…" : "Új jelszó mentése"}
      </button>
    </form>
  );
}

function Delete() {
  const [sure, setSure] = useState(false);
  const [state, run] = useForm();
  return (
    <div className={CSS.danger}>
      <h2 className={CSS.blockTitle}>Fiók törlése</h2>
      <p className={FormCSS.text}>
        A fiók törlésével az e-mail-címe és a hozzáférései véglegesen törlődnek. A böngészőben tárolt haladás
        és oklevélnév ezen az eszközön megmarad.
      </p>
      {state.error && <p className={FormCSS.error}>{state.error}</p>}
      {sure ? (
        <div className={CSS.row}>
          <button type="button" className={`btn ${CSS.dangerBtn}`} disabled={state.busy} onClick={() => run(deleteAccount)}>
            {state.busy ? "Törlés…" : "Igen, végleges törlés"}
          </button>
          <button type="button" className="btn btnGhost" onClick={() => setSure(false)} disabled={state.busy}>Mégse</button>
        </div>
      ) : (
        <button type="button" className="btn btnGhost" onClick={() => setSure(true)}>Fiók törlése</button>
      )}
    </div>
  );
}

function Dashboard({ user }) {
  const [list, setList] = useState(null);
  useEffect(() => {
    accesses().then(setList).catch(() => setList([]));
  }, [user.id]);
  const items = (list || []).map(describe).filter(Boolean);

  return (
    <>
      <div className={CSS.card}>
        <span className="eyebrow">Bejelentkezve</span>
        <p className={CSS.email}>{user.email}</p>
        <button type="button" className="btn btnGhost" onClick={() => signOut().catch(() => {})}>Kijelentkezés</button>
      </div>

      <div className={CSS.card}>
        <h2 className={CSS.blockTitle}>Hozzáférései</h2>
        {list == null ? (
          <p className={FormCSS.text}>Betöltés…</p>
        ) : items.length ? (
          <ul className={CSS.access}>
            {items.map((i) => (
              <li key={i.to}>
                <Link to={i.to}>
                  <span className="meta">{i.kind}</span>
                  <strong>{i.title}</strong>
                  <Arrow size={12} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={FormCSS.text}>
            A fiókjához még nincs zárolt tartalom rendelve. A hozzáférést a Vakzóna állítja be.
          </p>
        )}
      </div>

      <div className={CSS.card}><NewPassword /></div>
      <div className={CSS.card}><Delete /></div>
    </>
  );
}

const TABS = [
  { id: "belepes", label: "Belépés", el: <SignIn /> },
  { id: "regisztracio", label: "Regisztráció", el: <SignUp /> },
  { id: "elfelejtett", label: "Elfelejtett jelszó", el: <Forgot /> },
];

function Account() {
  const account = useAccount(true);
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const tab = TABS.find((t) => t.id === params.get("lap")) || TABS[0];
  const back = params.get("vissza");

  // belépés után vissza oda, ahonnan jött (csak az oldalon belüli címre)
  useEffect(() => {
    if (account.user && !account.recovery && back?.startsWith("/") && !back.startsWith("//")) navigate(back, { replace: true });
  }, [account.user, account.recovery, back, navigate]);

  let body;
  if (!FIOK) body = <p className={CSS.notice}>A fiókos belépés még nincs bekapcsolva.</p>;
  else if (!account.ready) body = <div className={CSS.placeholder} />;
  else if (account.recovery && account.user)
    body = <div className={CSS.card}><NewPassword title="Új jelszó beállítása" /></div>;
  else if (account.user) body = <Dashboard user={account.user} />;
  else {
    body = (
      <div className={CSS.card}>
        <div className={CSS.tabs} role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={t === tab}
              className={t === tab ? CSS.tabOn : ""}
              onClick={() => {
                const next = new URLSearchParams(params);
                next.set("lap", t.id);
                setParams(next, { replace: true });
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        {React.cloneElement(tab.el, { key: tab.id })}
      </div>
    );
  }

  return (
    <div className={`wrap ${PageCSS.page} ${CSS.page}`}>
      <span className="tag">Fiók</span>
      <h1 className={CSS.title}>Vakzóna-fiók</h1>
      <p className="lead">
        A fiókkal az Akadémia tanfolyamai és a zárolt dokumentumok felhasználónként nyílnak meg. Csak az
        e-mail-címét tároljuk.
      </p>
      <div className={CSS.stack}>{body}</div>
    </div>
  );
}

export default Account;
