import React from "react";

// Kategóriánként egy vonalas ábra az oldal stílusában: vékony currentColor-vonalak,
// egyetlen narancs „vakfolt” elem (.accent). A színt a szülő `color`-ja adja,
// így sötét háttéren (pl. a csempék futó feliratában) fehéren is használható.

const A = "var(--accent)";

// Gazdaság: oszlopdiagram, rajta trendvonal; egy oszlop narancs.
function Gazdasag() {
  const bars = [62, 88, 76, 118, 104, 150, 136, 178];
  const pts = bars.map((h, i) => [36 + i * 44 + 14, 250 - h]);
  return (
    <>
      <line x1="20" y1="250" x2="380" y2="250" strokeWidth="1.5" />
      {bars.map((h, i) => (
        <rect
          key={i} x={36 + i * 44} y={250 - h} width="28" height={h} rx="3"
          fill={i === 5 ? A : "currentColor"} fillOpacity={i === 5 ? 1 : 0.06}
          stroke={i === 5 ? A : "currentColor"} strokeWidth="1.5"
        />
      ))}
      <polyline
        points={pts.map((p) => `${p[0]},${p[1] - 26}`).join(" ")}
        fill="none" strokeWidth="1.5" strokeDasharray="4 5"
      />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y - 26} r={i === 5 ? 5 : 3.5}
          fill={i === 5 ? A : "var(--art-bg, #fff)"} stroke={i === 5 ? A : "currentColor"} strokeWidth="1.5" />
      ))}
    </>
  );
}

// Társadalom: „népességrács” emberalakokból; egy kis csoport narancs, a többi halványuló.
function Tarsadalom() {
  const cols = 8;
  const rows = 4;
  const accent = new Set(["3-1", "4-1", "4-2"]);
  const people = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = 48 + c * 44;
      const y = 62 + r * 54;
      const on = accent.has(`${c}-${r}`);
      const fade = 0.35 + 0.65 * (1 - Math.abs(c - 3.5) / 4.5) * (0.6 + 0.4 * ((r + c) % 3) / 2);
      people.push(
        <g key={`${c}-${r}`} opacity={on ? 1 : fade} stroke={on ? A : "currentColor"}>
          <circle cx={x} cy={y} r="7" fill={on ? A : "none"} strokeWidth="1.5" />
          <path d={`M${x - 13} ${y + 31} a13 13 0 0 1 26 0`} fill={on ? A : "none"} strokeWidth="1.5" />
        </g>
      );
    }
  }
  return <>{people}</>;
}

// Kultúra: oszlopcsarnok timpanonnal; a timpanonban a narancs pont.
function Kultura() {
  const cols = [0, 1, 2, 3, 4, 5];
  return (
    <>
      <path d="M60 104 L200 40 L340 104 Z" fill="currentColor" fillOpacity="0.05" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="200" cy="82" r="9" fill={A} stroke="none" />
      <rect x="54" y="104" width="292" height="16" rx="2" fill="none" strokeWidth="1.5" />
      {cols.map((i) => {
        const x = 76 + i * 48;
        return (
          <g key={i}>
            <rect x={x} y="120" width="24" height="10" fill="none" strokeWidth="1.5" />
            <rect x={x + 3} y="130" width="18" height="96" fill="currentColor" fillOpacity="0.04" strokeWidth="1.5" />
            <line x1={x + 9} y1="134" x2={x + 9} y2="222" strokeWidth="1" opacity="0.5" />
            <line x1={x + 15} y1="134" x2={x + 15} y2="222" strokeWidth="1" opacity="0.5" />
            <rect x={x} y="226" width="24" height="8" fill="none" strokeWidth="1.5" />
          </g>
        );
      })}
      <line x1="46" y1="242" x2="354" y2="242" strokeWidth="1.5" />
      <line x1="36" y1="252" x2="364" y2="252" strokeWidth="1.5" />
      <line x1="26" y1="262" x2="374" y2="262" strokeWidth="1.5" />
    </>
  );
}

// Történelem: évgyűrűk (az idő rétegei) és alatta idővonal; egy „esemény” narancs.
function Tortenelem() {
  const rings = [14, 28, 42, 57, 71, 86, 100, 114];
  return (
    <>
      {rings.map((r, i) => (
        <ellipse
          key={r} cx={200 + i * 0.8} cy={140 - i * 0.6} rx={r * 1.18} ry={r}
          fill="none" strokeWidth={i === rings.length - 1 ? 1.5 : 1.2}
          opacity={0.35 + (i / rings.length) * 0.65}
        />
      ))}
      <path d="M200 140 L300 82" strokeWidth="1" opacity="0.5" strokeDasharray="3 4" />
      <circle cx="200" cy="140" r="4" fill="currentColor" stroke="none" />
      <circle cx="262" cy="104" r="7" fill={A} stroke="none" />
      <line x1="30" y1="275" x2="370" y2="275" strokeWidth="1.5" />
      {Array.from({ length: 18 }, (_, i) => (
        <line key={i} x1={40 + i * 19} y1="275" x2={40 + i * 19} y2={i % 5 === 0 ? 263 : 269} strokeWidth="1.2" />
      ))}
      <circle cx="268" cy="275" r="5" fill={A} stroke="none" />
    </>
  );
}

const ART = { gazdasag: Gazdasag, tarsadalom: Tarsadalom, kultura: Kultura, tortenelem: Tortenelem };

function CategoryArt({ slug, className }) {
  const Art = ART[slug];
  if (!Art) return null;
  return (
    <svg
      className={className} viewBox="0 0 400 300" fill="none" stroke="currentColor"
      strokeLinecap="round" aria-hidden="true" preserveAspectRatio="xMidYMid meet"
    >
      <Art />
    </svg>
  );
}

export default CategoryArt;
