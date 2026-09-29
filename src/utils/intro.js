// A nyitóképernyő látogatásonként egyszer jelenik meg. Az eldöntés a modul betöltésekor,
// egyszer történik, így a Loader és a főoldali címsor-animáció ugyanazt látja.
const SEEN_KEY = "vakzona-loader";

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

const reducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const SHOW_LOADER = !readSeen() && !reducedMotion;

// ennyi másodperccel később indulnak a főoldal belépő animációi
export const INTRO_DELAY = SHOW_LOADER ? 1.25 : 0;

export function markLoaderSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* privát módban nincs sessionStorage */
  }
}
