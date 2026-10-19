import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Arrow from "./Arrow";
import CSS from "../css/ProtectedPdf.module.css";

// Jelszóval védett PDF (ügyféloldali, a Védőnői napló mintájára). A fájl a public/ mappában titkosítva
// van (scripts/vedett-pdf.mjs); a jelszóból PBKDF2-vel képzett kulcs fejti vissza, a jelszó a kódban nem szerepel.
// Sikeres belépés után a kulcs a munkamenet végéig a sessionStorage-ban marad, így újra nem kell beírni.
const KEY = "vz_pdf_kulcs";

async function deriveKey(password, salt) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password.trim()), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    true,
    ["decrypt"]
  );
}

const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

function savedKey(href) {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}")[href] || null;
  } catch (e) {
    return null;
  }
}

function saveKey(href, raw) {
  try {
    const all = JSON.parse(sessionStorage.getItem(KEY) || "{}");
    all[href] = raw;
    sessionStorage.setItem(KEY, JSON.stringify(all));
  } catch (e) {
    /* privát ablakban nincs tárolás – legközelebb újra kéri */
  }
}

// a titkosított fájl letöltése és visszafejtése; rossz jelszónál null
async function decrypt(href, password) {
  const res = await fetch(href);
  if (!res.ok) throw new Error("A fájl nem érhető el.");
  const buf = new Uint8Array(await res.arrayBuffer());
  if (new TextDecoder().decode(buf.slice(0, 4)) !== "VZP1") throw new Error("Ismeretlen fájlformátum.");
  const salt = buf.slice(4, 20);
  const iv = buf.slice(20, 32);
  const stored = password == null ? savedKey(href) : null;
  const key = stored
    ? await crypto.subtle.importKey("raw", fromB64(stored), "AES-GCM", true, ["decrypt"])
    : await deriveKey(password || "", salt);
  try {
    const pdf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, buf.slice(32));
    if (!stored) saveKey(href, toB64(await crypto.subtle.exportKey("raw", key)));
    return new Blob([pdf], { type: "application/pdf" });
  } catch (e) {
    return null;
  }
}

function LockIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="1.2" />
    </svg>
  );
}

function Dialog({ pdf, onClose }) {
  const [password, setPassword] = useState("");
  const [state, setState] = useState("idle"); // idle | busy | wrong | error | ready
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState(null);
  const [shake, setShake] = useState(0);
  const input = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    // ha ebben a munkamenetben már beírták a jelszót, rögtön visszafejtjük
    if (savedKey(pdf.href)) open(null);
    else input.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => url && URL.revokeObjectURL(url), [url]);

  async function open(pw) {
    setState("busy");
    try {
      const blob = await decrypt(pdf.href, pw);
      if (!blob) {
        setState(pw == null ? "idle" : "wrong");
        if (pw != null) setShake((n) => n + 1);
        input.current?.select();
        return;
      }
      const u = URL.createObjectURL(blob);
      setUrl(u);
      setState("ready");
      // letöltés indítása; a megnyitás gomb új lapon mutatja
      const a = document.createElement("a");
      a.href = u;
      a.download = pdf.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      setMessage(e.message);
      setState("error");
    }
  }

  return createPortal(
    <div className={CSS.backdrop} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={CSS.dialog} role="dialog" aria-modal="true" aria-labelledby="vedettCim">
        <button type="button" className={CSS.close} onClick={onClose} aria-label="Bezárás">×</button>
        <span className={CSS.icon}><LockIcon size={22} /></span>
        <p className={CSS.eyebrow}>Jelszóval védett dokumentum</p>
        <h2 id="vedettCim" className={CSS.title}>{pdf.title || "Szakmai tanulmány"}</h2>
        {state === "ready" ? (
          <>
            <p className={CSS.text}>A letöltés elindult. Ha mégsem, innen is megnyitható:</p>
            <a className="btn" href={url} target="_blank" rel="noopener">
              Megnyitás új lapon <Arrow size={12} />
            </a>
          </>
        ) : (
          <form
            key={shake}
            className={`${CSS.form} ${shake ? CSS.shake : ""}`}
            onSubmit={(e) => {
              e.preventDefault();
              open(password);
            }}
          >
            <p className={CSS.text}>A dokumentum letöltéséhez jelszó szükséges.</p>
            <label className={CSS.label} htmlFor="vedettJelszo">Jelszó</label>
            <input
              id="vedettJelszo"
              ref={input}
              type="password"
              autoComplete="current-password"
              className={CSS.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={state === "busy"}
            />
            {state === "wrong" && <p className={CSS.error}>Hibás jelszó.</p>}
            {state === "error" && <p className={CSS.error}>{message || "Hiba történt, kérjük, próbálja újra."}</p>}
            <button type="submit" className="btn" disabled={state === "busy" || !password.trim()}>
              {state === "busy" ? "Feloldás…" : "Feloldás és letöltés"}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}

// variant: "box" = nagy doboz az Összefoglaló után, "button" = gomb a fejlécben
function ProtectedPdf({ pdf, variant = "box", className = "" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {variant === "button" ? (
        <button type="button" className={`btn btnGhost ${className}`} onClick={() => setOpen(true)}>
          <LockIcon /> {pdf.button || "Szakmai tanulmány (jelszóval)"}
        </button>
      ) : (
        <button type="button" className={`${CSS.box} ${className}`} onClick={() => setOpen(true)}>
          <span className={CSS.boxIcon}><LockIcon size={26} /></span>
          <span className={CSS.boxText}>
            <span className={CSS.eyebrow}>Szakmai tanulmány · jelszóval</span>
            <strong>{pdf.title || "Szakmai tanulmány"}</strong>
            <span className={CSS.boxMeta}>Jelszóval védett PDF{pdf.label ? ` · ${pdf.label}` : ""}</span>
          </span>
          <span className={CSS.boxGo}>
            Feloldás <Arrow size={12} />
          </span>
        </button>
      )}
      {open && <Dialog pdf={pdf} onClose={() => setOpen(false)} />}
    </>
  );
}

export default ProtectedPdf;
