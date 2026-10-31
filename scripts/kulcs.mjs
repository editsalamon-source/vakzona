// Egy védett tartalom visszafejtő kulcsának kiírása a Supabase kulcsok táblájába (supabase/schema.sql).
//
//   VZ_JELSZO=… node scripts/kulcs.mjs <tartalom> <titkosított fájl>
//   pl. node scripts/kulcs.mjs akademia/ai-strategia public/akademia/ai-strategia/tartalom.enc
//       node scripts/kulcs.mjs pdf/mi-agensek public/elemzesek/mi-agensek/<fájl>.pdf.enc
//
// A jelszóból és a fájl sójából képzi a kulcsot (mint a böngésző), ellenőrzi, hogy megnyitja-e a fájlt,
// és kiír egy SQL-sort, amelyet a Supabase SQL Editorában kell lefuttatni. Az újratitkosítás (új só) után
// újra kell futtatni. A kimenet titkos: ne kerüljön a repóba.
import { readFileSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

const [id, file] = process.argv.slice(2);
if (!id || !file) {
  console.error("Használat: VZ_JELSZO=… node scripts/kulcs.mjs <tartalom> <titkosított fájl>");
  process.exit(1);
}

// VZ_JELSZO nélkül a terminálban kéri a jelszót, gépelés közben nem látszik
function ask(question) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    let value = "";
    process.stdout.write(question);
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    stdin.on("data", function onData(ch) {
      if (ch === "\r" || ch === "\n") {
        stdin.setRawMode?.(false);
        stdin.pause();
        stdin.off("data", onData);
        process.stdout.write("\n");
        resolve(value);
      } else if (ch === "\u0003") {
        process.exit(1);
      } else if (ch === "\u0008" || ch === "\u007f") {
        value = value.slice(0, -1);
      } else {
        value += ch;
      }
    });
  });
}

const password = process.env.VZ_JELSZO || (await ask("A tanfolyam jelszava (gépelés közben nem látszik), majd Enter: "));
if (!password.trim()) {
  console.error("Nincs megadva jelszó.");
  process.exit(1);
}

const buf = readFileSync(file);
if (buf.subarray(0, 4).toString() !== "VZP1") {
  console.error("Ismeretlen fájlformátum.");
  process.exit(1);
}
const salt = buf.subarray(4, 20);
const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password.trim()), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" },
  base,
  { name: "AES-GCM", length: 256 },
  true,
  ["decrypt"]
);
try {
  await crypto.subtle.decrypt({ name: "AES-GCM", iv: buf.subarray(20, 32) }, key, buf.subarray(32));
} catch (e) {
  console.error("A jelszó nem nyitja meg a fájlt.");
  process.exit(1);
}

const b64 = (b) => Buffer.from(b).toString("base64");
const raw = b64(await crypto.subtle.exportKey("raw", key));
console.log(
  `insert into public.kulcsok (tartalom, so, kulcs) values ('${id}', '${b64(salt)}', '${raw}')\n` +
    `on conflict (tartalom) do update set so = excluded.so, kulcs = excluded.kulcs;`
);
