import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FIOK, errorText, unsubscribe } from "../utils/fiok";
import PageCSS from "../css/Page.module.css";
import FormCSS from "../css/ProtectedPdf.module.css";
import CSS from "../css/Account.module.css";

// Leiratkozás az értesítő levelekről belépés nélkül: a levél alján lévő link (/leiratkozas?t=<token>) ide visz.
// A leiratkozás gombnyomásra történik, hogy a levelezők linkellenőrzője ne iratkoztassa le véletlenül a címzettet.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("t") || "";
  const [state, setState] = useState({ busy: false, error: "", done: false });

  async function submit() {
    setState({ busy: true, error: "", done: false });
    try {
      await unsubscribe(token);
      setState({ busy: false, error: "", done: true });
    } catch (e) {
      setState({ busy: false, error: errorText(e), done: false });
    }
  }

  let body;
  if (!FIOK) body = <p className={CSS.notice}>A fiókos funkciók nincsenek bekapcsolva.</p>;
  else if (state.done) {
    body = (
      <p className={CSS.notice}>
        Leiratkozott, több értesítő levelet nem küldünk. Ha meggondolja magát, a{" "}
        <Link to="/fiok">Fiók</Link> oldalon újra bekapcsolhatja.
      </p>
    );
  } else if (!UUID.test(token)) {
    body = (
      <p className={CSS.notice}>
        A leiratkozó link hiányos. Bejelentkezés után a <Link to="/fiok">Fiók</Link> oldalon is kikapcsolhatja
        az értesítéseket.
      </p>
    );
  } else {
    body = (
      <div className={CSS.card}>
        <p className={FormCSS.text}>
          A gombra kattintva leiratkozik a Vakzóna értesítő leveleiről (új tanfolyam, új elemzés). A fiókja és a
          hozzáférései megmaradnak.
        </p>
        {state.error && <p className={FormCSS.error}>{state.error}</p>}
        <div className={CSS.row}>
          <button type="button" className="btn" disabled={state.busy} onClick={submit}>
            {state.busy ? "Leiratkozás…" : "Leiratkozom"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`wrap ${PageCSS.page} ${CSS.page}`}>
      <span className="tag">Értesítések</span>
      <h1 className={CSS.title}>Leiratkozás</h1>
      <div className={CSS.stack}>{body}</div>
    </div>
  );
}

export default Unsubscribe;
