import courses, { formatLength } from "../data/akademia";
import analyses from "../data/analyses";
import { KAPCSOLAT_EMAIL } from "../data/kapcsolat";

// Az értesítő levél (src/data/ertesito.js) tartalmai és sablonja. A {{LEIRATKOZAS}} jelölő helyére az adatbázis
// (admin_ertesites_kuldes) írja be a címzett saját leiratkozó linkjét.
const SITE = "https://vakzona.com";
// a név ragozva (AKADEMIA.name: „Vakzóna Akadémia”; a puszta „n” rag „Akadémian” lenne)
const AKADEMIAN = "a Vakzóna Akadémián";
export const UNSUB = "{{LEIRATKOZAS}}";

// HTML → sima szöveg (a tanfolyam nyilvános bevezetőjéből)
function plain(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || "").replace(/\s+/g, " ").trim();
}

// minden kiküldhető tartalom, a legfrissebb elöl: { id, kind, title, subtitle, date, summary, details, url, cta }
export function mailItems() {
  const c = courses.map((x) => ({
    id: `akademia/${x.slug}`,
    kind: "tanfolyam",
    title: x.title,
    subtitle: x.subtitle,
    date: x.date,
    summary: plain(x.introHtml),
    // zárt tanfolyamnál a link a belépő oldalra visz (bemutató + leírás), ezért a gomb ezt ígéri, és a levél
    // megmondja, hogyan lehet hozzáférést kérni
    details: `${x.lessons.length} lecke, ${formatLength(x.seconds)}. ${
      x.free
        ? "Szabadon, belépés nélkül nézhető."
        : `Zárt tanfolyam: a bemutató és a leírás szabadon megnézhető, hozzáférést az ${KAPCSOLAT_EMAIL} címen kérhet.`
    }`,
    url: `${SITE}/akademia/${x.slug}`,
    cta: x.free ? "Megnézem" : "Bemutató és részletek",
  }));
  const a = analyses.map((x) => ({
    id: `elemzes/${x.slug}`,
    kind: "elemzés",
    title: x.title,
    subtitle: "",
    date: x.date,
    summary: x.subtitle,
    details: `${x.category.name}, kb. ${x.readingMinutes} perc olvasás.`,
    url: `${SITE}/elemzesek/${x.slug}`,
    cta: "Elolvasom",
  }));
  return [...c, ...a].sort((p, q) => q.date.localeCompare(p.date));
}

export const defaultSubject = (item) =>
  item.kind === "tanfolyam" ? `Új tanfolyam ${AKADEMIAN}: ${item.title}` : `Új elemzés a Vakzónán: ${item.title}`;

const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// { html, text } a választott tartalomból és a (szerkeszthető) összefoglalóból
export function buildMail(item, summary) {
  const lead = item.kind === "tanfolyam" ? `Új tanfolyam jelent meg ${AKADEMIAN}:` : "Új elemzés jelent meg a Vakzónán:";
  const foot = "Azért kapja ezt a levelet, mert a vakzona.com fiókjában értesítést kért az új tanfolyamokról és elemzésekről.";
  const paras = summary.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  const html = `<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;color:#0f172a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px">
<tr><td style="padding:28px 32px 0;font-size:15px;font-weight:700;letter-spacing:-0.01em">Vakzóna<span style="color:#ea580c">.</span></td></tr>
<tr><td style="padding:22px 32px 0;font-size:15px;line-height:1.6;color:#334155">Kedves Feliratkozó!</td></tr>
<tr><td style="padding:10px 32px 0;font-size:15px;line-height:1.6;color:#334155">${esc(lead)}</td></tr>
<tr><td style="padding:18px 32px 0"><div style="font-size:22px;line-height:1.25;font-weight:700;letter-spacing:-0.02em">${esc(item.title)}</div>${
    item.subtitle ? `<div style="margin-top:6px;font-size:15px;line-height:1.5;color:#475569">${esc(item.subtitle)}</div>` : ""
  }</td></tr>
${paras.map((p) => `<tr><td style="padding:16px 32px 0;font-size:15px;line-height:1.65;color:#334155">${esc(p)}</td></tr>`).join("\n")}
<tr><td style="padding:16px 32px 0;font-size:13px;line-height:1.5;color:#64748b">${esc(item.details)}</td></tr>
<tr><td style="padding:24px 32px 0"><a href="${esc(item.url)}" style="display:inline-block;background:#ea580c;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:999px">${esc(item.cta)} →</a></td></tr>
<tr><td style="padding:28px 32px 28px;font-size:15px;line-height:1.6;color:#334155">Üdvözlettel:<br>Vakzóna</td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px"><tr><td style="padding:16px 32px;font-size:12px;line-height:1.55;color:#94a3b8">${esc(foot)} <a href="${UNSUB}" style="color:#64748b">Leiratkozás</a></td></tr></table>
</td></tr></table></body></html>`;

  const text = [
    "Kedves Feliratkozó!",
    lead,
    item.title + (item.subtitle ? `\n${item.subtitle}` : ""),
    ...paras,
    item.details,
    `${item.cta}: ${item.url}`,
    "Üdvözlettel:\nVakzóna",
    `${foot}\nLeiratkozás: ${UNSUB}`,
  ].join("\n\n");

  return { html, text };
}
