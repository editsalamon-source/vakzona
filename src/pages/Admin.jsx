import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CSOPORTOK, describe } from "../data/vedett";
import Arrow from "../components/Arrow";
import {
  FIOK, useAccount, errorText, isAdmin, adminUsers, setAccess, adminInvites, setInvite,
} from "../utils/fiok";
import PageCSS from "../css/Page.module.css";
import FormCSS from "../css/ProtectedPdf.module.css";
import AccountCSS from "../css/Account.module.css";
import CSS from "../css/Admin.module.css";

// Adminoldal: felhasználók és hozzáféréseik, meghívás e-mail-címre (supabase/schema.sql).
// A jogosultságot az adatbázis minden hívásnál ellenőrzi, a felület csak elrejti a nem adminok elől.

const date = (iso) => (iso ? new Date(iso).toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric" }) : "–");

function Invite({ onDone }) {
  const [email, setEmail] = useState("");
  const [picked, setPicked] = useState([]);
  const [state, setState] = useState({ busy: false, error: "", message: "" });

  async function submit(e) {
    e.preventDefault();
    if (!picked.length) return setState({ busy: false, error: "Válasszon legalább egy tartalmat.", message: "" });
    setState({ busy: true, error: "", message: "" });
    try {
      const results = await Promise.all(picked.map((id) => setInvite(email.trim(), id, true)));
      setState({
        busy: false,
        error: "",
        message: results.includes("hozzaferes")
          ? "Ezzel a címmel már van megerősített fiók: a hozzáférés azonnal érvényes."
          : "Meghívás elmentve. Amikor ezzel a címmel regisztrálnak és megerősítik a fiókot, a hozzáférés életbe lép.",
      });
      setEmail("");
      setPicked([]);
      onDone();
    } catch (err) {
      setState({ busy: false, error: errorText(err), message: "" });
    }
  }

  return (
    <form className={FormCSS.form} onSubmit={submit}>
      <p className={FormCSS.text}>
        Regisztrált és még nem regisztrált címre is adható. Ha még nincs fiók, a hozzáférés a regisztráció
        megerősítésekor lép életbe. Levelet nem küldünk, a meghívottnak Önnek kell szólnia.
      </p>
      <label className={FormCSS.label} htmlFor="meghivasEmail">E-mail-cím</label>
      <input id="meghivasEmail" type="email" required className={FormCSS.input} value={email}
        onChange={(e) => setEmail(e.target.value)} disabled={state.busy} />
      {CSOPORTOK.map((g) => (
        <fieldset key={g.label} className={CSS.picks}>
          <legend className={CSS.group}>{g.label}</legend>
          {g.items.map((v) => (
            <label key={v.id} className={AccountCSS.check}>
              <input type="checkbox" checked={picked.includes(v.id)} disabled={state.busy}
                onChange={(e) => setPicked((p) => (e.target.checked ? [...p, v.id] : p.filter((x) => x !== v.id)))} />
              <span><strong>{v.title}</strong></span>
            </label>
          ))}
        </fieldset>
      ))}
      {state.error && <p className={FormCSS.error}>{state.error}</p>}
      {state.message && <p className={AccountCSS.ok}>{state.message}</p>}
      <button type="submit" className="btn" disabled={state.busy}>
        {state.busy ? "Mentés…" : "Hozzáférés megadása"} <Arrow size={12} />
      </button>
    </form>
  );
}

function Invites({ list, onChange }) {
  const [busy, setBusy] = useState(null);
  if (!list.length) return null;
  async function revoke(m) {
    setBusy(m.email + m.tartalom);
    try {
      await setInvite(m.email, m.tartalom, false);
      onChange();
    } finally {
      setBusy(null);
    }
  }
  return (
    <div className={AccountCSS.card}>
      <h2 className={AccountCSS.blockTitle}>Függő meghívások</h2>
      <p className={FormCSS.text}>Ezekkel a címekkel még nincs megerősített fiók.</p>
      <ul className={CSS.list}>
        {list.map((m) => (
          <li key={m.email + m.tartalom} className={CSS.row}>
            <span className={CSS.who}>
              <strong>{m.email}</strong>
              <span className="meta">{describe(m.tartalom)?.title || m.tartalom} · {date(m.letrehozva)}</span>
            </span>
            <button type="button" className="btn btnGhost" disabled={busy === m.email + m.tartalom} onClick={() => revoke(m)}>
              Visszavonás
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SZUROK = [
  { id: "mind", label: "Mind", test: () => true },
  { id: "van", label: "Van hozzáférése", test: (u) => u.tartalmak.length > 0 },
  { id: "nincs", label: "Nincs hozzáférése", test: (u) => !u.tartalmak.length },
  { id: "fuggo", label: "Nincs megerősítve", test: (u) => !u.megerositve },
];
const OSSZES = CSOPORTOK.reduce((n, g) => n + g.items.length, 0);

// Egy felhasználó: tömör sor (cím, állapot, hozzáférések összegezve), kattintásra lenyílik a pipák listája.
function UserRow({ user, open, onOpen, onToggle }) {
  const titles = user.tartalmak.map((id) => describe(id)?.title || id);
  const panelId = `fh-${user.id}`;
  return (
    <li className={`${CSS.user} ${open ? CSS.userOpen : ""}`}>
      <button type="button" className={CSS.userHead} aria-expanded={open} aria-controls={panelId} onClick={onOpen}>
        <span className={`${CSS.dot} ${user.megerositve ? CSS.dotOk : ""}`}
          title={user.megerositve ? "Megerősítve" : "Nincs megerősítve"} />
        <span className={CSS.who}>
          <strong>{user.email}</strong>
          <span className="meta">
            {user.megerositve ? "Megerősítve" : "Nincs megerősítve"} · utolsó belépés: {date(user.utolso_belepes)}
          </span>
        </span>
        <span className={CSS.chips} title={titles.join("\n")}>
          {titles.slice(0, 2).map((t) => <span key={t} className={CSS.chip}>{t}</span>)}
          {titles.length > 2 && <span className={CSS.chipMore}>+{titles.length - 2}</span>}
          {!titles.length && <span className={CSS.none}>Nincs hozzáférés</span>}
        </span>
        <span className={CSS.count}>{user.tartalmak.length}/{OSSZES}</span>
        <span className={CSS.chevron} aria-hidden="true" />
      </button>
      {open && (
        <div id={panelId} className={CSS.userBody}>
          <p className="meta">Regisztrált: {date(user.letrehozva)}</p>
          <div className={CSS.grants}>
            {CSOPORTOK.map((g) => (
              <div key={g.label} className={CSS.grantGroup}>
                <span className={CSS.group}>{g.label}</span>
                {g.items.map((v) => (
                  <label key={v.id} className={AccountCSS.check}>
                    <input type="checkbox" checked={user.tartalmak.includes(v.id)}
                      onChange={(e) => onToggle(user, v.id, e.target.checked)} />
                    <span>{v.title}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

function Users({ users, setUsers }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("mind");
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(null);
  const [error, setError] = useState("");
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const f = SZUROK.find((x) => x.id === filter);
    return users.filter((u) => u.email.toLowerCase().includes(q) && f.test(u) && (!content || u.tartalmak.includes(content)));
  }, [users, query, filter, content]);

  // pipa: azonnal átállítjuk, hiba esetén visszaállítjuk
  async function toggle(user, id, on) {
    const patch = (has) =>
      setUsers((list) => list.map((u) => (u.id === user.id
        ? { ...u, tartalmak: has ? [...u.tartalmak, id] : u.tartalmak.filter((t) => t !== id) }
        : u)));
    setError("");
    patch(on);
    try {
      await setAccess(user.id, id, on);
    } catch (e) {
      patch(!on);
      setError(errorText(e));
    }
  }

  return (
    <div className={AccountCSS.card}>
      <div className={CSS.usersHead}>
        <h2 className={AccountCSS.blockTitle}>Felhasználók <span className="meta">{users.length}</span></h2>
        <input type="search" placeholder="Keresés e-mail-címre" aria-label="Keresés e-mail-címre"
          className={`${FormCSS.input} ${CSS.search}`} value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className={CSS.filters}>
        <div className={CSS.seg} role="group" aria-label="Szűrés állapot szerint">
          {SZUROK.map((f) => (
            <button key={f.id} type="button" aria-pressed={filter === f.id}
              className={filter === f.id ? CSS.segOn : ""} onClick={() => setFilter(f.id)}>
              {f.label} <span>{users.filter(f.test).length}</span>
            </button>
          ))}
        </div>
        <select className={`${FormCSS.input} ${CSS.select}`} aria-label="Szűrés tartalom szerint"
          value={content} onChange={(e) => setContent(e.target.value)}>
          <option value="">Bármely tartalom</option>
          {CSOPORTOK.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.items.map((v) => <option key={v.id} value={v.id}>{v.title}</option>)}
            </optgroup>
          ))}
        </select>
      </div>
      {error && <p className={FormCSS.error}>{error}</p>}
      <ul className={CSS.table}>
        {shown.map((u) => (
          <UserRow key={u.id} user={u} open={open === u.id} onToggle={toggle}
            onOpen={() => setOpen((o) => (o === u.id ? null : u.id))} />
        ))}
        {!shown.length && <li className={CSS.empty}>Nincs találat.</li>}
      </ul>
      <p className={CSS.note}>
        A visszavont hozzáférés a fiókon át azonnal megszűnik, de aki a tartalmat korábban már megnyitotta,
        a kulcsot technikailag megtarthatja. Teljes kizáráshoz új jelszóval újra kell titkosítani a tartalmat
        (supabase/README.md).
      </p>
    </div>
  );
}

function Panel() {
  const [users, setUsers] = useState(null);
  const [invites, setInvites] = useState([]);
  const [error, setError] = useState("");

  function load() {
    Promise.all([adminUsers(), adminInvites()])
      .then(([u, m]) => {
        setUsers(u.map((x) => ({ ...x, tartalmak: x.tartalmak || [] })));
        setInvites(m);
      })
      .catch((e) => setError(errorText(e)));
  }
  useEffect(load, []);

  if (error) return <p className={FormCSS.error}>{error}</p>;
  if (!users) return <div className={AccountCSS.placeholder} />;
  return (
    <>
      <details className={`${AccountCSS.card} ${CSS.invite}`}>
        <summary className={CSS.inviteSummary}>
          <span>Hozzáférés e-mail-címre</span>
          <span className={CSS.chevron} aria-hidden="true" />
        </summary>
        <Invite onDone={load} />
      </details>
      <Invites list={invites} onChange={load} />
      <Users users={users} setUsers={setUsers} />
    </>
  );
}

function Admin() {
  const account = useAccount(true);
  const [admin, setAdmin] = useState(null);
  useEffect(() => {
    if (!account.user) return setAdmin(null);
    isAdmin().then(setAdmin).catch(() => setAdmin(false));
  }, [account.user]);

  let body;
  if (!FIOK) body = <p className={AccountCSS.notice}>A fiókos belépés nincs bekapcsolva.</p>;
  else if (!account.ready || (account.user && admin == null)) body = <div className={AccountCSS.placeholder} />;
  else if (!account.user) {
    body = (
      <p className={AccountCSS.notice}>
        Az oldalhoz be kell jelentkezni. <Link to="/fiok?vissza=/admin">Belépés</Link>
      </p>
    );
  } else if (!admin) body = <p className={AccountCSS.notice}>Ehhez az oldalhoz nincs jogosultsága.</p>;
  else body = <Panel />;

  return (
    <div className={`wrap ${PageCSS.page} ${CSS.page}`}>
      <span className="tag">Admin</span>
      <h1 className={AccountCSS.title}>Hozzáférések</h1>
      <p className="lead">Ki melyik tanfolyamot és védett dokumentumot nyithatja meg.</p>
      <div className={AccountCSS.stack}>{body}</div>
    </div>
  );
}

export default Admin;
