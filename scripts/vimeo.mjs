// Egy Akadémia-tanfolyam videóinak feltöltése a Vimeóra (Vimeo API, tus), a lejátszás a vakzona.com-ra szűkítve.
//
//   node scripts/vimeo.mjs <url-azonosító> [--csak 01,02] [--domain vakzona.com] [--csere] [--uj-verzio]
//
// A Vimeo személyes hozzáférési tokenjét a VIMEO_TOKEN környezeti változó adja
// (developer.vimeo.com/apps → Generate access token; jogosultság: Private, Create, Edit, Upload).
// A token sehol nem szerepelhet a repóban.
//
// Bemenet (gitignore-olt munkamappa): Akadémia/<url-azonosító>/
//   tartalom.json             a leckék azonosítói (csak ezeket tölti fel)
//   videok/<azonosító> – <cím>.mp4 (+ .vtt felirat)   a videó neve a Vimeón = a fájlnév
//   indexkepek/<azonosító> – <cím>.jpg                 indexkép, ha van
// Állapot: Akadémia/<url-azonosító>/vimeo.json (leckénként a videó URI-ja és az elvégzett lépések);
// a szkript megszakítás után újraindítható, a kész lépéseket kihagyja, a félbemaradt feltöltést folytatja.
//
// Beállítás videónként: rejtve a Vimeón (view: disable), beágyazás csak a megadott domainen, letöltés tiltva,
// nyelv magyar, magyar felirat, narancs lejátszószín.
// --csere: a tartalom.json videólinkjeit a Vimeo-linkekre cseréli (az eredetit egyszer tartalom.youtube.json-ba menti).
// --uj-verzio: a már feltöltött videók helyére új videófájlt tölt fel (Vimeo-verzió, a link nem változik), és a feliratot
//   és az indexképet is újra feltölti. Csak a --csak listában szereplő leckéknél, és csak ha a helyi fájl változott.
// Utána: VZ_JELSZO=… node scripts/akademia.mjs <url-azonosító>, majd scripts/kulcs.mjs és az SQL a Supabase-ben.
import { closeSync, copyFileSync, existsSync, openSync, readFileSync, readSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const slug = args.find((a, i) => !a.startsWith("--") && !["--csak", "--domain"].includes(args[i - 1]));
const only = opt("--csak")?.split(",").map((s) => s.trim());
const domains = (opt("--domain") || "vakzona.com").split(",").map((s) => s.trim());
const newVersion = args.includes("--uj-verzio");
const token = process.env.VIMEO_TOKEN;
if (newVersion && !only) {
  console.error("Az --uj-verzio csak a --csak kapcsolóval együtt használható (melyik leckék videója cserélődjön).");
  process.exit(1);
}
if (!slug || !token) {
  console.error("Használat: VIMEO_TOKEN=… node scripts/vimeo.mjs <url-azonosító> [--csak 01,02] [--domain vakzona.com] [--csere] [--uj-verzio]");
  process.exit(1);
}

const root = join(import.meta.dirname, "..");
const src = join(root, "Akadémia", slug);
const contentFile = join(src, "tartalom.json");
const stateFile = join(src, "vimeo.json");
const content = JSON.parse(readFileSync(contentFile, "utf8"));
const state = existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, "utf8")) : {};
const save = () => writeFileSync(stateFile, JSON.stringify(state, null, 2));

const API = "https://api.vimeo.com";
const headers = { Authorization: `bearer ${token}`, Accept: "application/vnd.vimeo.*+json;version=3.4" };

async function api(method, path, body) {
  const res = await fetch(path.startsWith("http") ? path : API + path, {
    method,
    headers: body ? { ...headers, "Content-Type": "application/json" } : headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

// a fájl feltöltése PUT-tal egy előre kapott linkre (felirat, indexkép)
async function put(link, file, type) {
  const res = await fetch(link, { method: "PUT", headers: { "Content-Type": type }, body: readFileSync(file) });
  if (!res.ok) throw new Error(`PUT ${file}: ${res.status} ${await res.text()}`);
}

// tus-feltöltés darabokban, a szerver által nyugtázott eltolástól folytatva
const CHUNK = 64 * 1024 * 1024;
async function tus(link, file) {
  const size = statSync(file).size;
  const head = await fetch(link, { method: "HEAD", headers: { "Tus-Resumable": "1.0.0" } });
  let offset = Number(head.headers.get("upload-offset") || 0);
  const fd = openSync(file, "r");
  try {
    while (offset < size) {
      const buf = Buffer.alloc(Math.min(CHUNK, size - offset));
      readSync(fd, buf, 0, buf.length, offset);
      const res = await fetch(link, {
        method: "PATCH",
        headers: { "Tus-Resumable": "1.0.0", "Upload-Offset": String(offset), "Content-Type": "application/offset+octet-stream" },
        body: buf,
      });
      if (!res.ok) throw new Error(`tus ${file}: ${res.status} ${await res.text()}`);
      offset = Number(res.headers.get("upload-offset"));
      process.stdout.write(`\r  feltöltés: ${Math.round((offset / size) * 100)}%`);
    }
  } finally {
    closeSync(fd);
  }
  process.stdout.write("\n");
}

// a lecke azonosítója a fájlnévben: "07a-plusz" → "07a+ – …", "13-plusz-plusz" → "13++ – …"
const find = (dir, id, ext) => {
  if (!existsSync(join(src, dir))) return null;
  const prefix = `${id.replace(/-plusz/g, "+")} – `;
  const name = readdirSync(join(src, dir)).find((f) => f.startsWith(prefix) && f.endsWith(ext) && !f.includes("forgatókönyv"));
  return name ? join(src, dir, name) : null;
};

const ids = Object.keys(content.leckek).filter((id) => !only || only.includes(id));
let failed = 0;
for (const id of ids) {
  const mp4 = find("videok", id, ".mp4");
  if (!mp4) {
    console.warn(`${id}: nincs videófájl, kihagyva`);
    continue;
  }
  const name = mp4.split(/[\\/]/).pop().replace(/\.mp4$/, "");
  const s = (state[id] ||= {});
  console.log(`${name}`);
  try {
    if (!s.uri) {
      const v = await api("POST", "/me/videos", {
        upload: { approach: "tus", size: statSync(mp4).size },
        name,
        locale: "hu",
        privacy: { view: "disable", embed: "whitelist", download: false, add: false, comments: "nobody" },
      });
      Object.assign(s, { uri: v.uri, id: v.uri.split("/").pop(), upload: v.upload.upload_link });
      save();
    }
    // a feltöltött fájl azonosítója (méret + módosítás ideje), ebből látszik, hogy a helyi fájl változott-e
    const stat = statSync(mp4);
    const sig = `${stat.size}-${Math.round(stat.mtimeMs)}`;
    if (newVersion && s.feltoltve && s.fajl !== sig) {
      const v = await api("POST", `${s.uri}/versions`, {
        file_name: `${name}.mp4`,
        upload: { approach: "tus", size: stat.size },
      });
      Object.assign(s, { upload: v.upload.upload_link, feltoltve: false, felirat: false, kep: false });
      save();
    }
    if (!s.feltoltve) {
      await tus(s.upload, mp4);
      Object.assign(s, { feltoltve: true, fajl: sig });
      save();
    }
    if (!s.domain) {
      for (const d of domains) await api("PUT", `${s.uri}/privacy/domains/${d}`);
      s.domain = true;
      save();
    }
    if (!s.lejatszo) {
      // a lejátszó megjelenése (csomagfüggő, hiba esetén csak figyelmeztet)
      try {
        await api("PATCH", s.uri, {
          embed: {
            color: "#ea580c",
            title: { name: "hide", owner: "hide", portrait: "hide" },
            buttons: { like: false, watchlater: false, share: false, embed: false },
          },
        });
      } catch (err) {
        console.warn(`  a lejátszó beállítása nem sikerült: ${err.message}`);
      }
      s.lejatszo = true;
      save();
    }
    const vtt = find("videok", id, ".vtt");
    if (vtt && !s.felirat) {
      // egy korábbi, félbemaradt próbálkozás üres feliratsávját töröljük (ha a tokennek nincs "delete"
      // jogosultsága, a sáv inaktív marad, a lejátszóban nem látszik)
      for (const old of (await api("GET", `${s.uri}/texttracks`)).data) {
        await api("DELETE", old.uri).catch(() => api("PATCH", old.uri, { active: false }).catch(() => {}));
      }
      const t =await api("POST", `${s.uri}/texttracks`, { type: "subtitles", language: "hu", name: "Magyar" });
      await put(t.link, vtt, "text/vtt");
      await api("PATCH", t.uri, { active: true });
      s.felirat = true;
      save();
    }
    const jpg = find("indexkepek", id, ".jpg");
    if (jpg && !s.kep) {
      const p = await api("POST", `${s.uri}/pictures`);
      await put(p.link, jpg, "image/jpeg");
      await api("PATCH", p.uri, { active: true });
      s.kep = true;
      save();
    }
    console.log(`  kész: https://vimeo.com/${s.id}`);
  } catch (err) {
    failed++;
    console.error(`  HIBA: ${err.message}`);
  }
}

if (args.includes("--csere")) {
  const backup = join(src, "tartalom.youtube.json");
  if (!existsSync(backup)) copyFileSync(contentFile, backup);
  let n = 0;
  for (const [id, s] of Object.entries(state)) {
    if (s.feltoltve && content.leckek[id]) {
      content.leckek[id].video = `https://vimeo.com/${s.id}`;
      n++;
    }
  }
  writeFileSync(contentFile, JSON.stringify(content, null, 2) + "\n");
  console.log(`tartalom.json: ${n} videólink Vimeóra cserélve (az eredeti: tartalom.youtube.json)`);
}
if (failed) {
  console.error(`${failed} videónál hiba volt, a szkript újrafuttatható.`);
  process.exit(1);
}
