import { useSyncExternalStore } from "react";
import { FIZETES } from "../data/fizetes";
import { getCourse } from "../data/akademia";

// Kosár: a kiválasztott tanfolyamok url-azonosítói a látogató böngészőjében (localStorage). Árat nem tárol,
// azt mindig a src/data/fizetes.js adja, a fizetésnél pedig a szerver (functions/api/fizetes-inditas.js) számolja újra.

// megvásárolható = minden létező, nem szabad hozzáférésű tanfolyam (bekapcsolt kosárnál)
export const megveheto = (slug) => {
  const c = FIZETES && getCourse(slug);
  return Boolean(c && !c.free);
};
const STORAGE = "vz_kosar";
const listeners = new Set();

function read() {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE) || "[]");
    return Array.isArray(list) ? list.filter((s) => typeof s === "string" && megveheto(s)) : [];
  } catch (e) {
    return [];
  }
}

let items = typeof window === "undefined" ? [] : read();

function write(next) {
  items = [...new Set(next)];
  try {
    if (items.length) localStorage.setItem(STORAGE, JSON.stringify(items));
    else localStorage.removeItem(STORAGE);
  } catch (e) {
    /* privát mód: csak erre a látogatásra marad meg */
  }
  listeners.forEach((l) => l());
}

// másik lapon módosított kosár
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE) {
      items = read();
      listeners.forEach((l) => l());
    }
  });
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useCart = () => useSyncExternalStore(subscribe, () => items, () => items);

export const addToCart = (slug) => megveheto(slug) && write([...items, slug]);
export const removeFromCart = (slug) => write(items.filter((s) => s !== slug));
export const removeManyFromCart = (slugs) => write(items.filter((s) => !slugs.includes(s)));
export const clearCart = () => write([]);
