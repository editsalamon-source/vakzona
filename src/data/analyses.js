import { Marked } from "marked";
import slugify from "../utils/slugify";
import KATEGORIAK, { getKategoria } from "./kategoriak";

// Minden elemzés egy Markdown fájl: src/content/elemzesek/<url-azonosító>.md
// Az elején `kulcs: érték` fejléc --- sorok között (cím, alcím, dátum, kategória, téma, piszkozat,
// kiemelés + kiemelés szöveg = a kártyák nagy száma, szám: érték | felirat = számsor, ismételhető,
// pdf: fájlnév | felirat = a teljes tanulmány PDF-je a public/elemzesek/<url-azonosító>/ mappában).
const files = import.meta.glob("../content/elemzesek/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const MONTHS = [
  "január", "február", "március", "április", "május", "június",
  "július", "augusztus", "szeptember", "október", "november", "december",
];

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, body: raw };
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

export function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m) return iso;
  return d ? `${y}. ${MONTHS[m - 1]} ${d}.` : `${y}. ${MONTHS[m - 1]}`;
}

// pdf: fájlnév | felirat → { href, label }; a „/”-rel kezdődő út változatlan marad
function parsePdf(value, slug) {
  if (!value) return null;
  const [file, label = ""] = value.split("|").map((s) => s.trim());
  return { href: file.startsWith("/") ? file : `/elemzesek/${slug}/${file}`, label };
}

// Markdown → HTML; a ## címsorok horgonyt kapnak a tartalomjegyzékhez.
function render(body) {
  const toc = [];
  const marked = new Marked({
    renderer: {
      heading({ tokens, depth, text }) {
        const id = slugify(text);
        if (depth === 2) toc.push({ id, text });
        return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
      },
    },
  });
  // a táblázat görgethető keretbe kerül, hogy telefonon se lógjon ki
  const html = marked
    .parse(body)
    .replace(/<table>/g, '<div class="tableWrap"><table>')
    .replace(/<\/table>/g, "</table></div>");
  return { html, toc };
}

const analyses = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split("/").pop().replace(/\.md$/, "");
    const { meta, body } = parseFrontmatter(raw);
    const words = body.split(/\s+/).filter(Boolean).length;
    const category = getKategoria(meta["kategória"]);
    if (!category) console.warn(`Ismeretlen vagy hiányzó kategória: ${slug}.md („${meta["kategória"] || ""}”)`);
    return {
      slug,
      title: meta["cím"] || slug,
      subtitle: meta["alcím"] || "",
      date: meta["dátum"] || "",
      category: category || { slug: "", name: "Egyéb" },
      topic: meta["téma"] || "Egyéb",
      draft: /^(igen|true)$/i.test(meta["piszkozat"] || ""),
      highlight: meta["kiemelés"] || "",
      highlightText: meta["kiemelés szöveg"] || "",
      stats: meta.stats || [],
      pdf: parsePdf(meta.pdf, slug),
      readingMinutes: Math.max(1, Math.round(words / 200)),
      body,
    };
  })
  // a piszkozatok csak a helyi fejlesztői szerveren látszanak, élesben nem
  .filter((a) => import.meta.env.DEV || !a.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export function getAnalysis(slug) {
  const analysis = analyses.find((a) => a.slug === slug);
  return analysis ? { ...analysis, ...render(analysis.body) } : null;
}

// a kategóriák a hozzájuk tartozó elemzések számával (az üresek is, „hamarosan” jelzéshez)
export function getCategories() {
  return KATEGORIAK.map((k) => ({
    ...k,
    count: analyses.filter((a) => a.category.slug === k.slug).length,
  }));
}

export default analyses;
