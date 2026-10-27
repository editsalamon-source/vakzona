import { useCallback, useEffect, useState } from "react";
import { deriveKey, exportKey, fetchSealed, importKey, open, toB64 } from "./titkositas";

// A tanfolyam védett tartalma (leckék videói, leírásai, anyagai) a public/akademia/<url-azonosító>/tartalom.enc
// fájlban van titkosítva (scripts/akademia.mjs). A jelszóból képzett kulcsot a látogató böngészője
// megjegyzi (localStorage), így legközelebb nem kell újra beírni; a „Kilépés” törli.
// Egy tanfolyam minden fájlja ugyanazzal a sóval és kulccsal készül, így az anyagok is ezzel nyílnak.
const KEY = "vz_akademia_kulcs";

function stored(slug) {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}")[slug] || null;
  } catch (e) {
    return null;
  }
}

function store(slug, value) {
  try {
    const all = JSON.parse(localStorage.getItem(KEY) || "{}");
    if (value) all[slug] = value;
    else delete all[slug];
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch (e) {
    /* nincs tárolás – legközelebb újra kéri a jelszót */
  }
}

// status: checking | locked | busy | wrong | error | open
export function useCourseContent(course) {
  const [status, setStatus] = useState("checking");
  const [content, setContent] = useState(null);
  const [key, setKey] = useState(null);
  const [message, setMessage] = useState("");

  const unlock = useCallback(
    async (password) => {
      setStatus(password == null ? "checking" : "busy");
      try {
        const sealed = await fetchSealed(course.sealed);
        const saved = password == null ? stored(course.slug) : null;
        // újratitkosítás után (új só) a megjegyzett kulcs már nem jó
        if (password == null && (!saved || saved.salt !== toB64(sealed.salt))) {
          setStatus("locked");
          return;
        }
        const k = saved ? await importKey(saved.key) : await deriveKey(password, sealed.salt);
        const plain = await open(k, sealed);
        if (!plain) {
          if (saved) store(course.slug, null);
          setStatus(saved ? "locked" : "wrong");
          return;
        }
        if (!saved) store(course.slug, { salt: toB64(sealed.salt), key: await exportKey(k) });
        setContent(JSON.parse(new TextDecoder().decode(plain)));
        setKey(k);
        setStatus("open");
      } catch (e) {
        setMessage(e.message);
        setStatus(password == null ? "locked" : "error");
      }
    },
    [course]
  );

  useEffect(() => {
    setContent(null);
    setKey(null);
    unlock(null);
  }, [unlock]);

  const lock = useCallback(() => {
    store(course.slug, null);
    setContent(null);
    setKey(null);
    setStatus("locked");
  }, [course]);

  // egy titkosított fájl (anyag, felirat) visszafejtése a tanfolyam kulcsával
  const unseal = useCallback(
    async (dir, file) => {
      const plain = await open(key, await fetchSealed(`/akademia/${course.slug}/${dir}/${encodeURIComponent(file)}.enc`));
      if (!plain) throw new Error("A fájl nem nyitható meg.");
      return plain;
    },
    [course, key]
  );

  const download = useCallback(
    async (file) => {
      const url = URL.createObjectURL(new Blob([await unseal("anyagok", file)]));
      const a = document.createElement("a");
      a.href = url;
      a.download = file;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    },
    [unseal]
  );

  // a lecke feliratának blob-URL-je a <track> elemhez
  const subtitle = useCallback(
    async (file) => URL.createObjectURL(new Blob([await unseal("feliratok", file)], { type: "text/vtt" })),
    [unseal]
  );

  return { status, content, message, unlock, lock, download, subtitle };
}
