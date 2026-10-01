// Letölthető PDF egy elemzésből, a Vakzóna-arculat szerint.
//
//   npm run pdf -- <url-azonosító> [--verzio 1.0] [--forras <fájl vagy mappa>] [--ki <kimenet.pdf>]
//
// Alapból a webes Markdownt (src/content/elemzesek/<url-azonosító>.md) szedi; --forras esetén
// egy másik fájlt vagy egy fejezet-mappát (Elemzés/<url-azonosító>/fejezetek/*.md, ábécérendben).
// A metaadatok (cím, alcím, dátum, téma, kiemelés, számsor, verzió) mindig a webes fájl fejlécéből
// jönnek, a verziót a --verzio felülírja. A kimenet alapból Elemzés/<url-azonosító>/pdf/ (gitignore-olt),
// hogy semmi ne kerüljön véletlenül nyilvánosságra.
//
// Két menet: az elsőből a PyMuPDF (python -m pip install pymupdf) kiolvassa, melyik oldalra mutatnak
// a tartalomjegyzék linkjei, a másodikba ezek az oldalszámok kerülnek. PyMuPDF nélkül is elkészül,
// csak oldalszám nélküli tartalomjegyzékkel.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, rmSync } from "node:fs";
import { join, dirname, resolve, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { Marked } from "marked";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE = join(ROOT, "scripts", "pdf");
const SITE = "vakzona.com";

const MONTHS = [
  "január", "február", "március", "április", "május", "június",
  "július", "augusztus", "szeptember", "október", "november", "december",
];

// ---------- paraméterek ----------
const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args.splice(i, 2)[1] : undefined;
};
const versionArg = opt("verzio");
const sourceArg = opt("forras");
const outArg = opt("ki");
// url-azonosító, vagy közvetlenül egy .md fájl útja (pl. üres minta)
const slug = args[0] && args[0].endsWith(".md") ? basename(args[0], ".md") : args[0];
if (!slug) {
  console.error("Használat: npm run pdf -- <url-azonosító> [--verzio 1.0] [--forras <fájl|mappa>] [--ki <kimenet.pdf>]");
  process.exit(1);
}

const webFile = args[0].endsWith(".md")
  ? resolve(args[0])
  : join(ROOT, "src", "content", "elemzesek", `${slug}.md`);
if (!existsSync(webFile)) {
  console.error(`Nincs ilyen elemzés: ${webFile}`);
  process.exit(1);
}

// ---------- Markdown + fejléc (ugyanaz a formátum, mint a src/data/analyses.js-ben) ----------
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: { stats: [] }, body: raw };
  const meta = { stats: [] };
  match[1].split(/\r?\n/).forEach((line) => {
    const i = line.indexOf(":");
    if (i <= 0) return;
    const key = line.slice(0, i).trim().toLowerCase();
    const value = line.slice(i + 1).trim();
    if (key === "szám") {
      const [stat, label = ""] = value.split("|").map((s) => s.trim());
      meta.stats.push({ value: stat, label });
    } else {
      meta[key] = value;
    }
  });
  return { meta, body: raw.slice(match[0].length) };
}

function formatDate(iso) {
  const [y, m, d] = (iso || "").split("-").map(Number);
  if (!y || !m) return iso || "";
  return d ? `${y}. ${MONTHS[m - 1]} ${d}.` : `${y}. ${MONTHS[m - 1]}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// a CSS content: "…" értékéhez
const cssString = (s = "") => `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ")}"`;

const { meta, body: webBody } = parseFrontmatter(readFileSync(webFile, "utf8"));

let body = webBody;
if (sourceArg) {
  const src = resolve(sourceArg);
  const files = statSync(src).isDirectory()
    ? readdirSync(src).filter((f) => f.endsWith(".md")).sort().map((f) => join(src, f))
    : [src];
  body = files.map((f) => parseFrontmatter(readFileSync(f, "utf8")).body.trim()).join("\n\n");
}

const doc = {
  slug,
  title: meta["cím"] || slug,
  subtitle: meta["alcím"] || "",
  date: formatDate(meta["dátum"]),
  topic: meta["téma"] || "",
  version: versionArg || meta["verzió"] || "1.0",
  highlight: meta["kiemelés"] || "",
  highlightText: meta["kiemelés szöveg"] || "",
  stats: meta.stats || [],
  url: `${SITE}/elemzesek/${slug}`,
};

// ---------- a törzs szétbontása: összefoglaló, bevezető, fejezetek ----------
let figureNo = 0;
const marked = new Marked({
  renderer: {
    heading({ tokens, depth, text }) {
      return `<h${depth} id="${slugify(text)}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
    },
    // kép + dőlt ábrafelirat ugyanabban a bekezdésben → <figure>
    paragraph({ tokens }) {
      const img = tokens.find((t) => t.type === "image");
      const rest = tokens.filter((t) => t !== img && !(t.type === "text" && !t.text.trim()) && t.type !== "br");
      if (img && rest.every((t) => t.type === "em")) {
        figureNo += 1;
        const caption = rest.length ? this.parser.parseInline(rest[0].tokens) : esc(img.text);
        return `<figure><div class="figFrame"><img src="${esc(img.href)}" alt="${esc(img.text)}"></div><figcaption>${caption}</figcaption></figure>\n`;
      }
      return `<p>${this.parser.parseInline(tokens)}</p>\n`;
    },
  },
});

const tokens = marked.lexer(body);
const renderTokens = (list) => {
  list.links = tokens.links;
  return marked
    .parser(list)
    .replace(/<table>/g, '<div class="tableWrap"><table>')
    .replace(/<\/table>/g, "</table></div>");
};

let summary = "";
const intro = [];
const chapters = [];
for (const token of tokens) {
  if (token.type === "heading" && token.depth === 1) continue; // a cím a borítón van
  if (token.type === "heading" && token.depth === 2) {
    chapters.push({ title: token.text, id: slugify(token.text), tokens: [] });
    continue;
  }
  if (!chapters.length) {
    if (!summary && token.type === "blockquote") summary = renderTokens([token]);
    else intro.push(token);
  } else {
    chapters[chapters.length - 1].tokens.push(token);
  }
}

let n = 0;
chapters.forEach((c) => {
  c.appendix = /forrás|melléklet|irodalom/i.test(c.title);
  c.label = c.appendix ? "Melléklet" : String(++n).padStart(2, "0");
  c.html = renderTokens(c.tokens);
});

// az abszolút (/elemzesek/…) képutak a public/ mappára mutassanak
const publicUrl = pathToFileURL(join(ROOT, "public")).href;
const fixSrc = (html) => html.replace(/src="\/(?!\/)/g, `src="${publicUrl}/`);

// ---------- díszítés: a hero részecskéi állóképként, a logó résével azonos „vakfolttal” ----------
function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function constellation({ size, count, seed, gapFrom = -1.15, gapTo = -0.35 }) {
  const rand = rng(seed);
  const c = size / 2;
  const s = size / 520;
  const pts = [];
  for (let i = 0; i < count; i++) {
    const angle = rand() * Math.PI * 2;
    const radius = rand() * 150 + 70;
    const r = rand() * 2 + 1.2;
    const y = rand() - 0.5;
    const accent = rand() > 0.82;
    const a = Math.atan2(Math.sin(angle), Math.cos(angle));
    if (a > gapFrom && a < gapTo) continue; // vakfolt
    const x = c + Math.cos(angle) * radius * s;
    const py = c + y * size * 0.42 * Math.sin(angle * 0.5) + Math.sin(radius) * 18 * s;
    const depth = (Math.sin(angle) + 2) / 3;
    pts.push({ x, y: py, r: r * depth * s * 1.4, o: depth, accent });
  }
  let lines = "";
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      const lim = 70 * s;
      if (d < lim) {
        lines += `<line x1="${pts[i].x.toFixed(1)}" y1="${pts[i].y.toFixed(1)}" x2="${pts[j].x.toFixed(1)}" y2="${pts[j].y.toFixed(1)}" stroke-opacity="${(0.28 * (1 - d / lim)).toFixed(3)}"/>`;
      }
    }
  }
  const dots = pts
    .map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r.toFixed(2)}" fill="${p.accent ? "#ea580c" : "#cbd5e1"}" fill-opacity="${p.o.toFixed(2)}"/>`)
    .join("");
  // a logó nyitott köre, nagyban, a rés a vakfolt irányában
  const ring = (r, w, op, dash) =>
    `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="#fff" stroke-opacity="${op}" stroke-width="${w}" stroke-dasharray="${dash}" transform="rotate(${(gapTo * 180) / Math.PI} ${c} ${c})"/>`;
  const circ = (r) => 2 * Math.PI * r;
  const r1 = 246 * s, r2 = 200 * s, r3 = 120 * s;
  const gapFrac = (gapTo - gapFrom) / (2 * Math.PI);
  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${ring(r1, 7 * s, 0.9, `${circ(r1) * (1 - gapFrac)} ${circ(r1) * gapFrac}`)}
    ${ring(r2, 1 * s, 0.16, `${3 * s} ${9 * s}`)}
    ${ring(r3, 1 * s, 0.1, `${circ(r3) * (1 - gapFrac)} ${circ(r3) * gapFrac}`)}
    <g stroke="#94a3b8" stroke-width="${(0.6 * s).toFixed(2)}">${lines}</g>
    ${dots}
    <circle cx="${c}" cy="${c}" r="${30 * s}" fill="#ea580c" fill-opacity=".18"/>
    <circle cx="${c}" cy="${c}" r="${14 * s}" fill="#ea580c"/>
  </svg>`;
}

const logo = (size = 28, color = "currentColor") => `
  <svg width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="16" cy="16" r="13" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="62 20" transform="rotate(-60 16 16)"/>
    <circle cx="16" cy="16" r="4.5" fill="#ea580c"/>
  </svg>`;

// ---------- oldalak ----------
const metaStrip = `
  <dl class="metaStrip">
    <div><dt>Szerző</dt><dd>Vakzóna</dd></div>
    <div><dt>Dátum</dt><dd>${esc(doc.date)}</dd></div>
    <div><dt>Verzió</dt><dd>${esc(doc.version)}</dd></div>
    <div class="wide"><dt>Online</dt><dd><a href="https://${doc.url}">${esc(doc.url)}</a></dd></div>
  </dl>`;

const cover = `
<section class="cover">
  <div class="coverGrid"></div>
  <div class="coverArt">${constellation({ size: 1040, count: 190, seed: 29 })}</div>
  <header class="coverTop">
    <a class="brand" href="https://${SITE}">${logo(30, "#fff")}<span>Vakzóna</span></a>
    <span class="pill">Elemzés${doc.topic ? ` <i></i> ${esc(doc.topic)}` : ""}</span>
  </header>
  <div class="coverMain">
    <p class="eyebrow">Elemzés · ${esc(doc.date)}</p>
    <h1>${esc(doc.title)}</h1>
    ${doc.subtitle ? `<p class="coverLead">${esc(doc.subtitle)}</p>` : ""}
  </div>
  ${doc.highlight ? `
  <aside class="floatCard">
    <span class="floatDot"></span>
    <strong>${esc(doc.highlight)}</strong>
    ${doc.highlightText ? `<p>${esc(doc.highlightText)}</p>` : ""}
  </aside>` : ""}
  ${metaStrip}
</section>`;

const statsBand = doc.stats.length
  ? `<div class="statsBand">
      <div class="statsGrid"></div>
      <p class="eyebrow">Számokban</p>
      <div class="stats" style="--cols:${Math.min(doc.stats.length, 4)}">
        ${doc.stats.map((s) => `<div><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join("")}
      </div>
    </div>`
  : "";

const tocEntries = [
  ...(summary || intro.length ? [{ id: "osszefoglalo", label: "—", title: "Összefoglaló" }] : []),
  ...chapters.map((c) => ({ id: c.id, label: c.appendix ? "M" : c.label, title: c.title, appendix: c.appendix })),
];

const tocPage = (pages = {}) => `
<section class="front">
  <p class="eyebrow">Tartalom</p>
  <h2 class="frontTitle">${esc(doc.title)}</h2>
  <ol class="toc">
    ${tocEntries
      .map(
        (e) => `<li class="${e.appendix ? "tocAppendix" : ""}"><a href="#${e.id}">
          <span class="tocNo">${esc(e.label)}</span>
          <span class="tocTitle">${esc(e.title)}</span>
          <span class="tocDots"></span>
          <span class="tocPage">${pages[e.id] ? String(pages[e.id]).padStart(2, "0") : "&nbsp;&nbsp;"}</span>
        </a></li>`
      )
      .join("")}
  </ol>
  <div class="colophon">
    <div class="colophonLogo">${logo(36)}</div>
    <div>
      <p><strong>Kiadja:</strong> Vakzóna · <a href="https://${SITE}">${SITE}</a></p>
      <p><strong>Online változat:</strong> <a href="https://${doc.url}">${esc(doc.url)}</a></p>
      <p><strong>Verzió:</strong> ${esc(doc.version)} · <strong>Dátum:</strong> ${esc(doc.date)}</p>
      <p class="colophonNote">Ez a dokumentum a ${SITE} oldalon megjelent elemzés letölthető változata. A forrásokra mutató linkek a PDF-ben is kattinthatók.</p>
    </div>
  </div>
</section>`;

const summaryPage = summary || intro.length
  ? `
<section class="opening" id="osszefoglalo">
  <h2 class="openingTitle">Röviden</h2>
  ${summary ? `<div class="summary">${summary}</div>` : ""}
  ${statsBand}
  ${intro.length ? `<div class="prose intro">${renderTokens(intro)}</div>` : ""}
</section>`
  : "";

const chapterHtml = chapters
  .map(
    (c) => `
<section class="chapter${c.appendix ? " appendix" : ""}" id="${c.id}">
  <header class="chapterHead">
    <div class="chapterGrid"></div>
    ${c.appendix ? "" : `<span class="chapterNo">${esc(c.label)}</span>`}
    <p class="eyebrow">${c.appendix ? "Melléklet" : `${c.label}. fejezet`}</p>
    <h2>${esc(c.title)}</h2>
  </header>
  <div class="prose">${c.html}</div>
</section>`
  )
  .join("");

const back = `
<section class="back">
  <div class="coverGrid"></div>
  <div class="backArt">${constellation({ size: 1040, count: 150, seed: 7 })}</div>
  <div class="backMain">
    <p class="eyebrow">Vakzóna</p>
    <p class="backClaim">Ami kimarad<br>a látómezőből.</p>
    <a class="backSite" href="https://${SITE}">${SITE}</a>
  </div>
  <dl class="metaStrip backStrip">
    <div><dt>Elemzés</dt><dd>${esc(doc.title)}</dd></div>
    <div><dt>Verzió</dt><dd>${esc(doc.version)}</dd></div>
    <div><dt>Dátum</dt><dd>${esc(doc.date)}</dd></div>
    <div class="wide"><dt>Online</dt><dd><a href="https://${doc.url}">${esc(doc.url)}</a></dd></div>
  </dl>
</section>`;

// a futó fejléc/lábléc (CSS @page margódobozok) szövegei
const running = `
:root {
  --run-title: ${cssString(doc.title)};
  --run-url: ${cssString(doc.url)};
  --run-meta: ${cssString(`v${doc.version} · ${doc.date}`)};
}
@page body {
  @top-left { content: ${cssString("VAKZÓNA  ·  ELEMZÉS")}; }
  @top-right { content: ${cssString(doc.title.length > 70 ? doc.title.slice(0, 68) + "…" : doc.title)}; }
  @bottom-left { content: ${cssString(doc.url)}; }
  @bottom-center { content: ${cssString(`v${doc.version}  ·  ${doc.date}`)}; }
}`;

function page(pages) {
  figureNo = 0;
  return `<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<title>${esc(doc.title)} – Vakzóna</title>
<meta name="author" content="Vakzóna (${SITE})">
<meta name="description" content="${esc(doc.subtitle)}">
<meta name="keywords" content="${esc([doc.topic, "Vakzóna", "elemzés"].filter(Boolean).join(", "))}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=block" rel="stylesheet">
<link rel="stylesheet" href="${pathToFileURL(join(TEMPLATE, "sablon.css")).href}">
<style>${running}</style>
</head>
<body>
${cover}
${tocPage(pages)}
<main class="body">
${summaryPage}
${fixSrc(chapterHtml)}
</main>
${back}
</body>
</html>`;
}

// ---------- nyomtatás headless Chrome-mal ----------
function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) throw new Error("Nem található Chrome/Edge; add meg a CHROME_PATH környezeti változóval.");
  return found;
}

const chrome = findChrome();
const work = join(tmpdir(), `vakzona-pdf-${process.pid}`);
mkdirSync(work, { recursive: true });

function print(html, out) {
  const htmlFile = join(work, "elemzes.html");
  writeFileSync(htmlFile, html);
  execFileSync(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    `--user-data-dir=${join(work, "profil")}`,
    "--allow-file-access-from-files",
    "--no-pdf-header-footer",
    "--virtual-time-budget=20000",
    `--print-to-pdf=${out}`,
    pathToFileURL(htmlFile).href,
  ], { stdio: "ignore" });
  if (!existsSync(out)) throw new Error("A Chrome nem hozta létre a PDF-et.");
}

// a TOC linkjeinek céloldala az első menet PDF-jéből (PyMuPDF)
function tocPages(pdf) {
  const py = `
import sys, json, pymupdf as fitz
doc = fitz.open(sys.argv[1])
out = []
for link in doc[1].get_links():
    if link.get("kind") in (fitz.LINK_GOTO, fitz.LINK_NAMED) and link.get("page", -1) >= 0:
        out.append([link["from"].y0, link["page"] + 1])
out.sort()
print(json.dumps([p for _, p in out]))
`;
  try {
    const res = execFileSync("python", ["-c", py, pdf], { encoding: "utf8" });
    const list = JSON.parse(res);
    if (list.length !== tocEntries.length) return null;
    return Object.fromEntries(tocEntries.map((e, i) => [e.id, list[i]]));
  } catch (e) {
    if (process.env.PDF_DEBUG) console.error(e);
    return null;
  }
}

const out = resolve(outArg || join(ROOT, "Elemzés", slug, "pdf", `${slug}-v${doc.version}.pdf`));
mkdirSync(dirname(out), { recursive: true });

const first = join(work, "elso.pdf");
print(page({}), first);
const pages = tocPages(first);
if (pages) {
  print(page(pages), out);
} else {
  writeFileSync(out, readFileSync(first));
  console.warn("Figyelem: PyMuPDF nélkül a tartalomjegyzékben nincs oldalszám (python -m pip install pymupdf).");
}
// PDF-metaadatok: a szerző a portál (a Chrome ezt nem írja bele)
try {
  const info = JSON.stringify({
    title: doc.title,
    author: "Vakzóna",
    subject: doc.subtitle,
    keywords: [doc.topic, "Vakzóna", "elemzés", doc.url].filter(Boolean).join(", "),
    creator: `${SITE} · v${doc.version}`,
    producer: SITE,
    // könyvjelzők (a PDF-olvasó oldalsávja): borító, tartalom, fejezetek
    toc: [
      [1, "Borító", 1],
      [1, "Tartalom", 2],
      ...(pages ? tocEntries.map((e) => [1, e.appendix || e.label === "—" ? e.title : `${e.label}. ${e.title}`, pages[e.id]]) : []),
    ],
  });
  const py = `
import sys, json, pymupdf
d = pymupdf.open(sys.argv[1])
info = json.loads(sys.argv[2])
toc = info.pop("toc")
m = d.metadata
m.update(info)
d.set_metadata(m)
d.set_toc(toc)
d.saveIncr()
`;
  execFileSync("python", ["-c", py, out, info], { stdio: "ignore" });
} catch {
  console.warn("Figyelem: a PDF-metaadatokat (szerző) csak PyMuPDF-fel lehet beállítani.");
}
rmSync(work, { recursive: true, force: true });
console.log(`Kész: ${out}`);
if (process.env.PDF_HTML) writeFileSync(join(dirname(out), `${basename(out, ".pdf")}.html`), page(pages || {}));
