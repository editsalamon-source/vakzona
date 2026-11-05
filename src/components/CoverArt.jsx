import React from "react";
import CategoryArt from "./CategoryArt";

// Elemzésenként és tanfolyamonként saját borítóábra, hogy a kártyák ne csak a kategória
// ábráját mutassák (egy kategórián belül is megkülönböztethetők legyenek). A stílus a
// CategoryArt-é: vékony currentColor-vonalak, egyetlen narancs „vakfolt” elem.
// A motívumot a .md fejléc `borító:` sora választja ki; ha nincs (vagy ismeretlen),
// a kategória ábrája látszik.

const A = "var(--accent)";
const BG = "var(--art-bg, #fff)";

// Heti naptár: hét nap, négy munkanap kitöltve, az ötödik (péntek) narancs, „felszabaduló” nap.
function Naptar() {
  const days = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];
  return (
    <>
      <rect x="40" y="46" width="320" height="214" rx="14" fill="currentColor" fillOpacity="0.03" strokeWidth="1.5" />
      <line x1="40" y1="88" x2="360" y2="88" strokeWidth="1.5" />
      {[110, 290].map((x) => (
        <rect key={x} x={x - 5} y="32" width="10" height="28" rx="5" fill={BG} strokeWidth="1.5" />
      ))}
      {days.map((d, i) => {
        const x = 52 + i * 44;
        const work = i < 4;
        const fri = i === 4;
        return (
          <g key={d}>
            <text x={x + 18} y="74" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor" stroke="none"
              fontFamily="Inter, sans-serif">{d}</text>
            <rect x={x} y="104" width="36" height="140" rx="6"
              fill={fri ? A : "currentColor"} fillOpacity={fri ? 0.14 : work ? 0.1 : 0.02}
              stroke={fri ? A : "currentColor"} strokeWidth="1.5" strokeDasharray={work || fri ? undefined : "3 4"} />
            {work && [0, 1, 2, 3].map((r) => (
              <line key={r} x1={x + 8} y1={122 + r * 26} x2={x + 28} y2={122 + r * 26} strokeWidth="1.5" opacity="0.55" />
            ))}
            {fri && <circle cx={x + 18} cy="174" r="9" fill={A} stroke="none" />}
          </g>
        );
      })}
    </>
  );
}

// Szakszervezet: összekapaszkodó emberek sora, fölöttük a tagsági arányt mutató kördiagram
// kis narancs szelettel.
function Osszefogas() {
  const cx = 200;
  const cy = 92;
  const r = 52;
  const share = 0.074;
  const a = share * 2 * Math.PI;
  const x2 = cx + r * Math.sin(a);
  const y2 = cy - r * Math.cos(a);
  const people = [0, 1, 2, 3, 4, 5];
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="currentColor" fillOpacity="0.05" strokeWidth="1.5" />
      <path d={`M${cx} ${cy} L${cx} ${cy - r} A${r} ${r} 0 0 1 ${x2} ${y2} Z`} fill={A} stroke={A} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={cx} cy={cy} r={r + 12} strokeWidth="1" strokeDasharray="3 5" opacity="0.5" />
      {people.map((i) => {
        const x = 70 + i * 52;
        const on = i === 2;
        const c = on ? A : "currentColor";
        return (
          <g key={i} stroke={c}>
            <circle cx={x} cy="196" r="9" fill={on ? A : BG} strokeWidth="1.5" />
            <path d={`M${x - 15} 252 v-22 a15 15 0 0 1 30 0 v22`} fill={on ? A : "none"} fillOpacity={on ? 0.15 : 0} strokeWidth="1.5" />
            {i < people.length - 1 && (
              <path d={`M${x + 15} 226 q 11 -8 22 0`} stroke="currentColor" fill="none" strokeWidth="1.5" />
            )}
          </g>
        );
      })}
      <line x1="40" y1="262" x2="360" y2="262" strokeWidth="1.5" />
    </>
  );
}

// Vörös óriás: a mai Nap kis köre, körülötte a táguló csillag egyre nagyobb, szaggatott körei,
// a legkülső narancs ív. A bolygópályák elnyelődnek.
function Csillag() {
  const cx = 200;
  const cy = 150;
  return (
    <>
      {[34, 62, 92].map((r, i) => (
        <circle key={r} cx={cx} cy={cy} r={r} strokeWidth="1.5" strokeDasharray={i ? "4 6" : undefined}
          fill="currentColor" fillOpacity={0.05 - i * 0.012} opacity={1 - i * 0.2} />
      ))}
      <path d={`M${cx - 124} ${cy} A124 124 0 0 1 ${cx + 124} ${cy}`} stroke={A} strokeWidth="2" />
      <path d={`M${cx + 124} ${cy} A124 124 0 0 1 ${cx - 124} ${cy}`} stroke={A} strokeWidth="1.5" strokeDasharray="4 7" opacity="0.6" />
      <circle cx={cx} cy={cy} r="10" fill={A} stroke="none" />
      {/* bolygók: a belsők a táguló csillagon belülre kerülnek */}
      {[[48, 0.5], [78, 0.7], [108, 0.85], [150, 1]].map(([d, o], i) => (
        <circle key={d} cx={cx + d * Math.cos(-0.5 - i * 0.35)} cy={cy + d * Math.sin(-0.5 - i * 0.35)} r={3 + i}
          fill={BG} strokeWidth="1.5" opacity={o} />
      ))}
    </>
  );
}

// Petőfi sírja: szintvonalas domborzat, rajta a feltételezett sírhelyek kis keresztjei,
// egyetlen narancs helyjelölő.
function Terkep() {
  const sites = [[96, 110], [132, 172], [168, 96], [204, 210], [236, 132], [262, 182], [290, 98], [118, 228], [312, 220], [182, 150], [70, 172]];
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i}
          d={`M${20} ${70 + i * 44} C ${110} ${40 + i * 44}, ${170} ${120 + i * 40}, ${250} ${78 + i * 44} S ${350} ${60 + i * 46}, ${384} ${84 + i * 42}`}
          strokeWidth="1" opacity={0.25 + i * 0.1} />
      ))}
      {sites.map(([x, y], i) => (
        <g key={i} strokeWidth="1.5" opacity="0.75">
          <line x1={x - 5} y1={y - 5} x2={x + 5} y2={y + 5} />
          <line x1={x - 5} y1={y + 5} x2={x + 5} y2={y - 5} />
        </g>
      ))}
      <circle cx="236" cy="132" r="26" stroke={A} strokeWidth="1.5" strokeDasharray="3 4" />
      <path d="M236 132 c-14 -18 -14 -34 0 -40 c14 6 14 22 0 40 z" transform="translate(0 -6)" fill={A} stroke={A} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="236" cy="104" r="5" fill={BG} stroke="none" />
    </>
  );
}

// Pályakezdők: létra, amelynek alsó fokai hiányoznak; a hiányzó fok helye narancs,
// fönt emberalakok, lent egy, aki nem tud fellépni.
function Letra() {
  const rungs = [70, 104, 138, 172, 206, 240];
  return (
    <>
      <line x1="170" y1="40" x2="170" y2="262" strokeWidth="1.5" />
      <line x1="236" y1="40" x2="236" y2="262" strokeWidth="1.5" />
      {rungs.map((y, i) => {
        const missing = i >= 3;
        return missing ? (
          <line key={y} x1="176" y1={y} x2="230" y2={y} stroke={i === 4 ? A : "currentColor"}
            strokeWidth="1.5" strokeDasharray="3 5" opacity={i === 4 ? 1 : 0.45} />
        ) : (
          <line key={y} x1="170" y1={y} x2="236" y2={y} strokeWidth="1.5" />
        );
      })}
      {[[284, 74], [318, 104]].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="8" fill={BG} strokeWidth="1.5" />
          <path d={`M${x - 14} ${y + 34} a14 14 0 0 1 28 0`} strokeWidth="1.5" />
        </g>
      ))}
      <circle cx="104" cy="214" r="8" fill={A} stroke="none" />
      <path d="M90 248 a14 14 0 0 1 28 0" fill={A} fillOpacity="0.15" stroke={A} strokeWidth="1.5" />
      <line x1="40" y1="262" x2="360" y2="262" strokeWidth="1.5" />
    </>
  );
}

// Vállalati MI-platform: egymásra épülő rétegek (izometrikus lapok); a középső narancs.
function Retegek() {
  const layers = [218, 176, 134, 92];
  const lap = (y) => `M200 ${y - 36} L316 ${y} L200 ${y + 36} L84 ${y} Z`;
  return (
    <>
      {layers.map((y, i) => {
        const on = i === 2;
        return (
          <g key={y}>
            <path d={lap(y)} fill={on ? A : BG} fillOpacity={on ? 0.16 : 1} stroke={on ? A : "currentColor"} strokeWidth="1.5" strokeLinejoin="round" />
            {i > 0 && [-1, 1].map((s) => (
              <line key={s} x1={200 + s * 116} y1={y} x2={200 + s * 116} y2={y + 42} strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
            ))}
          </g>
        );
      })}
      {[[-40, 0], [0, -14], [40, 0]].map(([dx, dy], i) => (
        <circle key={i} cx={200 + dx} cy={92 + dy} r="5" fill={BG} strokeWidth="1.5" />
      ))}
      <circle cx="200" cy="134" r="7" fill={A} stroke="none" />
    </>
  );
}

// MI-ágensek: az ágens-hurok (észlel, tervez, cselekszik, ellenőriz) négy csomóponttal
// és nyilakkal; a „cselekszik” csomópont narancs.
function Hurok() {
  const cx = 200;
  const cy = 150;
  const r = 92;
  const nodes = [0, 1, 2, 3].map((i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const arcs = [0, 1, 2, 3].map((i) => {
    const a1 = -Math.PI / 2 + (i * Math.PI) / 2 + 0.32;
    const a2 = a1 + Math.PI / 2 - 0.64;
    return [cx + r * Math.cos(a1), cy + r * Math.sin(a1), cx + r * Math.cos(a2), cy + r * Math.sin(a2), a2];
  });
  return (
    <>
      <circle cx={cx} cy={cy} r="34" fill="currentColor" fillOpacity="0.05" strokeWidth="1" strokeDasharray="3 5" />
      <circle cx={cx} cy={cy} r="7" fill="currentColor" stroke="none" opacity="0.6" />
      {arcs.map(([x1, y1, x2, y2, a], i) => {
        const tx = -Math.sin(a);
        const ty = Math.cos(a);
        const nx = Math.cos(a);
        const ny = Math.sin(a);
        return (
          <g key={i}>
            <path d={`M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`} strokeWidth="1.5" />
            <path d={`M${x2 - tx * 9 + nx * 6} ${y2 - ty * 9 + ny * 6} L${x2} ${y2} L${x2 - tx * 9 - nx * 6} ${y2 - ty * 9 - ny * 6}`}
              strokeWidth="1.5" strokeLinejoin="round" />
          </g>
        );
      })}
      {nodes.map(([x, y], i) => {
        const on = i === 2;
        return (
          <rect key={i} x={x - 18} y={y - 18} width="36" height="36" rx={i % 2 ? 18 : 8}
            fill={on ? A : BG} stroke={on ? A : "currentColor"} strokeWidth="1.5" />
        );
      })}
      <path d="M318 222 l18 18 M336 222 l-18 18" strokeWidth="1.5" opacity="0.5" />
      <rect x="306" y="210" width="42" height="42" rx="10" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
    </>
  );
}

// Adatvédelmi garanciák: pajzs, benne zár kulcslyukkal (narancs); kívülről adatpontok
// érkeznek, egy részük a pajzs szélén megáll.
function Pajzs() {
  const dots = [[48, 82], [72, 126], [44, 170], [80, 214], [352, 92], [330, 140], [358, 190], [322, 226]];
  return (
    <>
      {dots.map(([x, y], i) => (
        <g key={i} opacity="0.6">
          <line x1={x} y1={y} x2={x < 200 ? x + 46 : x - 46} y2={y + (150 - y) * 0.2} strokeWidth="1" strokeDasharray="2 4" />
          <rect x={x - 5} y={y - 5} width="10" height="10" rx="2" fill={BG} strokeWidth="1.5" />
        </g>
      ))}
      <path d="M200 36 L284 66 V146 C284 204 246 240 200 262 C154 240 116 204 116 146 V66 Z"
        fill="currentColor" fillOpacity="0.05" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M200 58 L264 81 V146 C264 192 236 220 200 238 C164 220 136 192 136 146 V81 Z"
        strokeWidth="1" strokeDasharray="3 5" opacity="0.5" strokeLinejoin="round" />
      <rect x="170" y="134" width="60" height="50" rx="8" fill={BG} strokeWidth="1.5" />
      <path d="M182 134 v-14 a18 18 0 0 1 36 0 v14" strokeWidth="1.5" />
      <circle cx="200" cy="154" r="7" fill={A} stroke="none" />
      <path d="M197 158 h6 l2 14 h-10 z" fill={A} stroke="none" />
    </>
  );
}

// AI stratégia: útiterv kanyargó úttal és mérföldkövekkel, a végén narancs zászló
// (a jóváhagyott stratégia).
function Utiterv() {
  const stops = [[56, 236], [128, 188], [208, 214], [262, 142], [196, 96]];
  return (
    <>
      <path d="M40 252 C 90 250, 96 196, 128 188 S 180 222, 208 214 S 270 180, 262 142 S 214 112, 196 96 S 250 56, 318 64"
        strokeWidth="1.5" strokeDasharray="5 6" />
      {stops.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="11" fill={BG} strokeWidth="1.5" />
          <circle cx={x} cy={y} r="3.5" fill="currentColor" stroke="none" opacity="0.6" />
        </g>
      ))}
      <line x1="318" y1="64" x2="318" y2="20" stroke={A} strokeWidth="2" />
      <path d="M318 22 L356 32 L318 44 Z" fill={A} stroke={A} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="318" cy="66" r="5" fill={A} stroke="none" />
      {[[300, 196], [330, 230], [92, 112]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="40" height="28" rx="4" strokeWidth="1" opacity="0.4" />
      ))}
    </>
  );
}

// AI-ágensek tanfolyam: a beszélgetéstől a cselekvésig, balra szövegbuborék,
// narancs nyíl, jobbra az eszközök (ablak, fogaskerék-szerű kör, mappa).
function Cselekves() {
  return (
    <>
      <path d="M44 74 h120 a14 14 0 0 1 14 14 v62 a14 14 0 0 1 -14 14 h-78 l-24 22 v-22 h-18 a14 14 0 0 1 -14 -14 v-62 a14 14 0 0 1 14 -14 z"
        fill="currentColor" fillOpacity="0.05" strokeWidth="1.5" strokeLinejoin="round" />
      {[100, 120, 140].map((y, i) => (
        <line key={y} x1="56" y1={y} x2={i === 2 ? 120 : 160} y2={y} strokeWidth="1.5" opacity="0.55" />
      ))}
      <path d="M194 126 H254" stroke={A} strokeWidth="2" />
      <path d="M244 114 L258 126 L244 138" stroke={A} strokeWidth="2" strokeLinejoin="round" />
      <rect x="276" y="52" width="88" height="58" rx="8" fill={BG} strokeWidth="1.5" />
      <line x1="276" y1="68" x2="364" y2="68" strokeWidth="1.5" />
      <circle cx="320" cy="152" r="20" fill={BG} strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i * Math.PI) / 3;
        return <line key={i} x1={320 + 20 * Math.cos(a)} y1={152 + 20 * Math.sin(a)} x2={320 + 29 * Math.cos(a)} y2={152 + 29 * Math.sin(a)} strokeWidth="2" />;
      })}
      <circle cx="320" cy="152" r="6" fill={A} stroke="none" />
      <path d="M276 206 h30 l8 10 h50 v40 h-88 z" fill={BG} strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="40" y1="262" x2="200" y2="262" strokeWidth="1" opacity="0.4" />
    </>
  );
}

// AI-jártasság tanfolyam: az AI által írt dokumentum, rajta nagyító; a nagyító alatt
// az egyetlen narancs sor (a magabiztos tévedés, amelyet az ellenőrzés kiszúr).
function Jartassag() {
  const rows = [96, 120, 144, 168, 192, 216];
  return (
    <>
      <rect x="64" y="40" width="190" height="230" rx="10" fill="currentColor" fillOpacity="0.03" strokeWidth="1.5" />
      <line x1="84" y1="66" x2="180" y2="66" strokeWidth="2" opacity="0.7" />
      {rows.map((y, i) => (
        <line key={y} x1="84" y1={y} x2={[234, 220, 230, 206, 228, 170][i]} y2={y} strokeWidth="1.5"
          stroke={i === 3 ? A : "currentColor"} opacity={i === 3 ? 1 : 0.45} />
      ))}
      <circle cx="226" cy="168" r="50" fill={BG} fillOpacity="0.55" strokeWidth="1.5" />
      <line x1="122" y1="168" x2="206" y2="168" stroke={A} strokeWidth="3" />
      <circle cx="226" cy="168" r="50" strokeWidth="1.5" />
      <line x1="262" y1="204" x2="312" y2="254" strokeWidth="9" />
      <line x1="262" y1="204" x2="312" y2="254" stroke={BG} strokeWidth="5" />
      <circle cx="226" cy="168" r="60" strokeWidth="1" strokeDasharray="3 5" opacity="0.5" />
      <path d="M300 64 l10 10 l20 -22" strokeWidth="2" opacity="0.55" strokeLinejoin="round" />
    </>
  );
}

// MI-szolgáltatások és adatvédelem tanfolyam: döntési térkép (sorok: konstrukciók, oszlopok: adatkörök).
// A felső sor csupa „nem” (áthúzott), a többi cella szaggatott („feltétellel”), egyetlen narancs
// cella a feltétel nélküli igen.
function Dontesiterkep() {
  const cols = [0, 1, 2, 3, 4];
  const rows = [0, 1, 2, 3, 4];
  return (
    <>
      <rect x="60" y="40" width="280" height="230" rx="12" fill="currentColor" fillOpacity="0.03" strokeWidth="1.5" />
      {cols.map((c) => (
        <line key={c} x1={112 + c * 48} y1="56" x2={136 + c * 48} y2="56" strokeWidth="2" opacity="0.5" />
      ))}
      {rows.map((r) => (
        <line key={r} x1="74" y1={90 + r * 38} x2="94" y2={90 + r * 38} strokeWidth="2" opacity="0.5" />
      ))}
      {rows.map((r) =>
        cols.map((c) => {
          const x = 104 + c * 48;
          const y = 74 + r * 38;
          const yes = r === 4 && c === 1;
          const no = r === 0 || (c === 4 && r < 4);
          return (
            <g key={`${r}-${c}`}>
              <rect x={x} y={y} width="40" height="30" rx="5"
                fill={yes ? A : "currentColor"} fillOpacity={yes ? 0.18 : no ? 0.06 : 0.02}
                stroke={yes ? A : "currentColor"} strokeWidth="1.5" strokeDasharray={yes || no ? undefined : "3 3"} />
              {no && <path d={`M${x + 14} ${y + 9} l12 12 M${x + 26} ${y + 9} l-12 12`} strokeWidth="1.5" opacity="0.6" />}
              {!yes && !no && <circle cx={x + 20} cy={y + 15} r="3" fill="currentColor" stroke="none" opacity="0.45" />}
              {yes && <path d={`M${x + 12} ${y + 15} l6 6 l11 -12`} stroke={A} strokeWidth="2.5" strokeLinejoin="round" />}
            </g>
          );
        })
      )}
    </>
  );
}

// AI Act megfelelés tanfolyam: a négy kockázati szint piramisa (a csúcson a tiltott, áthúzva),
// a narancs sáv a nagy kockázatú szint, ebből vezet a nyíl a megfelelési dossziéhoz.
function Piramis() {
  return (
    <>
      <path d="M150 56 L176 99 L124 99 Z" fill="currentColor" fillOpacity="0.08" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M142 72 l16 16 M158 72 l-16 16" strokeWidth="1.5" opacity="0.6" />
      <path d="M121 106 L179 106 L205 151 L95 151 Z" fill={A} fillOpacity="0.16" stroke={A} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M92 158 L208 158 L234 203 L66 203 Z" fill="currentColor" fillOpacity="0.05" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M63 210 L237 210 L264 256 L36 256 Z" fill="currentColor" fillOpacity="0.02" strokeWidth="1.5"
        strokeDasharray="3 4" strokeLinejoin="round" />
      <path d="M210 128 C 236 128 250 120 266 112" stroke={A} strokeWidth="1.5" strokeDasharray="3 4" />
      <path d="M260 106 l7 6 l-8 4" stroke={A} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="288" y="74" width="80" height="150" rx="8" fill={BG} strokeWidth="1.5" opacity="0.5" />
      <rect x="280" y="84" width="80" height="150" rx="8" fill={BG} strokeWidth="1.5" opacity="0.75" />
      <path d="M272 104 h28 l8 -10 h44 a8 8 0 0 1 8 8 v138 a8 8 0 0 1 -8 8 h-72 a8 8 0 0 1 -8 -8 Z"
        fill={BG} strokeWidth="1.5" strokeLinejoin="round" />
      {[132, 152, 172, 192].map((y, i) => (
        <line key={y} x1="286" y1={y} x2={[340, 328, 344, 320][i]} y2={y} strokeWidth="1.5" opacity="0.45" />
      ))}
      <path d="M300 214 l8 8 l16 -18" strokeWidth="2" opacity="0.6" strokeLinejoin="round" />
    </>
  );
}

// Idővonal 1940-től napjainkig: a hype-görbe két „téllel” (szaggatott mélypontok, hópehely),
// a három nagy ötlet jelölőivel, a végén narancs pont: itt tartunk.
function Idovonal() {
  const marks = [
    { x: 70, y: "1940" },
    { x: 138, y: "1956" },
    { x: 232, y: "1986" },
    { x: 300, y: "2017" },
    { x: 344, y: "2026" },
  ];
  const flake = (cx, cy) => (
    <g opacity="0.5" strokeWidth="1.2">
      <path d={`M${cx} ${cy - 7} v14 M${cx - 6} ${cy - 3.5} l12 7 M${cx - 6} ${cy + 3.5} l12 -7`} />
    </g>
  );
  return (
    <>
      <path d="M50 236 H360" strokeWidth="1.5" opacity="0.6" />
      {marks.map((m) => (
        <g key={m.y}>
          <line x1={m.x} y1="230" x2={m.x} y2="242" strokeWidth="1.5" opacity="0.6" />
          <text x={m.x} y="262" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" opacity="0.6"
            fontFamily="ui-monospace, monospace">{m.y}</text>
        </g>
      ))}
      <path d="M70 196 C 100 190 118 120 150 104 C 170 96 178 150 196 178" strokeWidth="2" />
      <path d="M196 178 C 204 190 212 190 220 176" strokeWidth="2" strokeDasharray="3 4" opacity="0.7" />
      <path d="M220 176 C 232 150 240 128 252 130 C 262 132 266 162 276 172" strokeWidth="2" />
      <path d="M276 172 C 282 180 288 180 294 168" strokeWidth="2" strokeDasharray="3 4" opacity="0.7" />
      <path d="M294 168 C 308 132 320 90 344 58" stroke={A} strokeWidth="2.5" />
      {flake(208, 204)}
      {flake(285, 196)}
      {[150, 252].map((x, i) => (
        <circle key={x} cx={x} cy={[104, 130][i]} r="4" fill={BG} strokeWidth="1.5" />
      ))}
      <circle cx="344" cy="58" r="11" fill={A} fillOpacity="0.16" stroke="none" />
      <circle cx="344" cy="58" r="5.5" fill={A} stroke="none" />
      <line x1="344" y1="70" x2="344" y2="230" stroke={A} strokeWidth="1.2" strokeDasharray="2 4" opacity="0.7" />
    </>
  );
}

const MOTIFS = {
  idovonal: Idovonal,
  naptar: Naptar,
  osszefogas: Osszefogas,
  csillag: Csillag,
  terkep: Terkep,
  letra: Letra,
  retegek: Retegek,
  hurok: Hurok,
  pajzs: Pajzs,
  utiterv: Utiterv,
  cselekves: Cselekves,
  jartassag: Jartassag,
  dontesiterkep: Dontesiterkep,
  piramis: Piramis,
};

function CoverArt({ motif, category, className }) {
  const Art = MOTIFS[motif];
  if (!Art) return category ? <CategoryArt slug={category} className={className} /> : null;
  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" stroke="currentColor"
      strokeLinecap="round" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <Art />
    </svg>
  );
}

export default CoverArt;
