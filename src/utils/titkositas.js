// Közös ügyféloldali visszafejtés a jelszóval védett tartalmakhoz (ProtectedPdf, Akadémia).
// Fájlformátum: "VZP1" (4 bájt) + só (16) + IV (12) + AES-256-GCM titkosított adat;
// kulcs: PBKDF2-SHA-256, 250 000 kör (scripts/vedett-pdf.mjs, scripts/akademia.mjs).

export async function deriveKey(password, salt) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password.trim()), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    true,
    ["decrypt"]
  );
}

export const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
export const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export const importKey = (raw) => crypto.subtle.importKey("raw", fromB64(raw), "AES-GCM", true, ["decrypt"]);
export const exportKey = async (key) => toB64(await crypto.subtle.exportKey("raw", key));

// a titkosított fájl letöltése és szétbontása; { salt, iv, data }
export async function fetchSealed(href) {
  const res = await fetch(href);
  if (!res.ok) throw new Error("A fájl nem érhető el.");
  const buf = new Uint8Array(await res.arrayBuffer());
  if (new TextDecoder().decode(buf.slice(0, 4)) !== "VZP1") throw new Error("Ismeretlen fájlformátum.");
  return { salt: buf.slice(4, 20), iv: buf.slice(20, 32), data: buf.slice(32) };
}

// visszafejtés; rossz kulcsnál null
export async function open(key, { iv, data }) {
  try {
    return await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  } catch (e) {
    return null;
  }
}
