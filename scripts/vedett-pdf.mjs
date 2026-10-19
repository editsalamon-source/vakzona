// Jelszóval védett letöltés: a PDF-et titkosítva tesszük a public/ mappába, a böngésző csak a helyes
// jelszóval tudja visszafejteni (src/components/ProtectedPdf.jsx). A jelszó sehol nem szerepel a repóban.
//
//   node scripts/vedett-pdf.mjs <bemenet.pdf> <kimenet.pdf.enc>   (a jelszót a VZ_JELSZO környezeti változó adja)
//
// Formátum: "VZP1" (4 bájt) + só (16) + IV (12) + AES-256-GCM titkosított adat (+16 bájt hitelesítő címke).
// Kulcs: PBKDF2-SHA-256, 250 000 kör – ugyanez a ProtectedPdf.jsx-ben.
import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

const [input, output] = process.argv.slice(2);
const password = process.env.VZ_JELSZO;
if (!input || !output || !password) {
  console.error("Használat: VZ_JELSZO=… node scripts/vedett-pdf.mjs <bemenet.pdf> <kimenet.pdf.enc>");
  process.exit(1);
}

const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password.trim()), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" },
  base,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt"]
);
const data = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, readFileSync(input)));
writeFileSync(output, Buffer.concat([Buffer.from("VZP1"), salt, iv, data]));
console.log(`Kész: ${output} (${(data.length / 1048576).toFixed(1)} MB)`);
