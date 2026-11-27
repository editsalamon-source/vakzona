import React, { useEffect, useState } from "react";
import M from "../css/CategoryArt.module.css";

// Kategóriánként egy vonalas ábra az oldal stílusában: vékony currentColor-vonalak,
// egyetlen narancs „vakfolt” elem (.accent). A színt a szülő `color`-ja adja,
// így sötét háttéren (pl. a csempék futó feliratában) fehéren is használható.
// `animated` (a főoldali kategóriacsempéken): lassú, folyamatos mozgás, csak transform és
// stroke-dashoffset (a `--i` CSS-változó a lépcsőzetes késleltetés). A Tudomány elektronpályái
// forognak, a Társadalom narancs csoportja időnként máshová kerül.

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
          key={i} className={M.bar} style={{ "--i": i }} x={36 + i * 44} y={250 - h} width="28" height={h} rx="3"
          fill={i === 5 ? A : "currentColor"} fillOpacity={i === 5 ? 1 : 0.06}
          stroke={i === 5 ? A : "currentColor"} strokeWidth="1.5"
        />
      ))}
      <polyline
        className={M.flow}
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
// Mozgó változatban a narancs csoport időnként máshová kerül (mindig más emberek).
const COLS = 8;
const ROWS = 4;
const START = ["3-1", "4-1", "4-2"];

// véletlen csoport: egy ember és két szomszédja, a rácson belül, a mostanitól eltérő kezdőponttal
function nextGroup(prev) {
  let c, r;
  do {
    c = Math.floor(Math.random() * (COLS - 1));
    r = Math.floor(Math.random() * (ROWS - 1));
  } while (prev.includes(`${c}-${r}`));
  return [`${c}-${r}`, `${c + 1}-${r}`, Math.random() < 0.5 ? `${c}-${r + 1}` : `${c + 1}-${r + 1}`];
}

function Tarsadalom({ animated }) {
  const [group, setGroup] = useState(START);
  useEffect(() => {
    if (!animated || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = setInterval(() => setGroup(nextGroup), 2600);
    return () => clearInterval(id);
  }, [animated]);

  const accent = new Set(group);
  const people = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = 48 + c * 44;
      const y = 62 + r * 54;
      const on = accent.has(`${c}-${r}`);
      const fade = 0.35 + 0.65 * (1 - Math.abs(c - 3.5) / 4.5) * (0.6 + 0.4 * ((r + c) % 3) / 2);
      people.push(
        <g key={`${c}-${r}`} className={M.person} opacity={on ? 1 : fade} stroke={on ? A : "currentColor"}>
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
      <circle className={M.pulse} cx="200" cy="82" r="9" fill={A} stroke="none" />
      <rect x="54" y="104" width="292" height="16" rx="2" fill="none" strokeWidth="1.5" />
      {cols.map((i) => {
        const x = 76 + i * 48;
        return (
          <g key={i} className={M.glint} style={{ "--i": i }}>
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

// Tudomány: atom három elektronpályával; a mag narancs, körülötte halvány mérési pontrács.
// Mozgó változatban az ábra áll, csak az elektronok keringenek a saját pályájukon.
const ORBITS = [
  { deg: 0, from: 1, dur: 11, accent: false },
  { deg: 60, from: -1, dur: 14, accent: false },
  { deg: 120, from: 1, dur: 17, accent: true },
];

function Tudomany({ animated }) {
  const cx = 200;
  const cy = 148;
  const move = animated && !(typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  return (
    <>
      {[36, 58, 342, 364].flatMap((x) =>
        [60, 150, 240].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" fill="currentColor" stroke="none" opacity="0.5" />)
      )}
      {ORBITS.map(({ deg }) => (
        <ellipse key={deg} cx={cx} cy={cy} rx="128" ry="44" fill="none" strokeWidth="1.5"
          transform={`rotate(${deg} ${cx} ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r="64" fill="currentColor" fillOpacity="0.04" strokeWidth="1" strokeDasharray="3 5" opacity="0.6" />
      <circle cx={cx} cy={cy} r="14" fill={A} stroke="none" />
      {/* elektronok: a pálya csúcsáról indulnak, onnan keringenek (pályánként más sebességgel) */}
      {ORBITS.map(({ deg, from, dur, accent }) => {
        const x0 = cx + from * 128;
        const fill = accent ? A : "var(--art-bg, #fff)";
        return (
          <g key={deg} transform={`rotate(${deg} ${cx} ${cy})`}>
            {move ? (
              <circle r="6" fill={fill} stroke={accent ? "none" : "currentColor"} strokeWidth="1.5">
                <animateMotion dur={`${dur}s`} repeatCount="indefinite"
                  path={`M${x0} ${cy} a128 44 0 1 1 ${-from * 256} 0 a128 44 0 1 1 ${from * 256} 0`} />
              </circle>
            ) : (
              <circle cx={x0} cy={cy} r="6" fill={fill} stroke={accent ? "none" : "currentColor"} strokeWidth="1.5" />
            )}
          </g>
        );
      })}
    </>
  );
}

// MI: neurális háló négy réteggel; az egyik rejtett csomópont és a belőle induló élek narancsok.
function Mi() {
  const layers = [3, 5, 5, 2].map((n, l) =>
    Array.from({ length: n }, (_, i) => [64 + l * 90, 150 + (i - (n - 1) / 2) * 50])
  );
  const hot = "1-3";
  const edges = [];
  for (let l = 0; l < layers.length - 1; l++) {
    layers[l].forEach(([x1, y1], i) =>
      layers[l + 1].forEach(([x2, y2], j) => {
        const on = `${l}-${i}` === hot || `${l + 1}-${j}` === hot;
        edges.push(
          <line key={`${l}-${i}-${j}`} className={on ? M.signal : undefined} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={on ? A : "currentColor"} strokeWidth={on ? 1.5 : 1} opacity={on ? 1 : 0.35} />
        );
      })
    );
  }
  return (
    <>
      {edges}
      {layers.flatMap((nodes, l) =>
        nodes.map(([x, y], i) => {
          const on = `${l}-${i}` === hot;
          return (
            <circle key={`${l}-${i}`} className={on ? M.pulse : M.node} style={{ "--i": l * 2 + i }} cx={x} cy={y} r={on ? 11 : 9}
              fill={on ? A : "var(--art-bg, #fff)"} stroke={on ? A : "currentColor"} strokeWidth="1.5" />
          );
        })
      )}
    </>
  );
}

// Szabályzat (csak az Akadémia témaköre): két lap, az elsőn paragrafusjel és sorok, narancs pecsét pipával.
function Szabalyzat() {
  const lines = [0, 1, 2, 3, 4, 5];
  return (
    <>
      <rect x="132" y="38" width="176" height="222" rx="10" fill="currentColor" fillOpacity="0.03" strokeWidth="1.5" opacity="0.45" />
      <rect x="104" y="54" width="176" height="222" rx="10" fill="var(--art-bg, #fff)" strokeWidth="1.5" />
      <text x="124" y="104" fontSize="40" fontWeight="600" fill="currentColor" stroke="none" fontFamily="Inter, sans-serif">§</text>
      <line x1="160" y1="90" x2="256" y2="90" strokeWidth="1.5" />
      {lines.map((i) => (
        <line key={i} className={M.glint} style={{ "--i": i }} x1="124" y1={130 + i * 20} x2={i % 3 === 2 ? 210 : 258} y2={130 + i * 20}
          strokeWidth="1.5" opacity="0.5" />
      ))}
      <g className={M.pulse}>
        <circle cx="282" cy="240" r="34" fill={A} fillOpacity="0.14" stroke={A} strokeWidth="2" />
        <circle cx="282" cy="240" r="26" stroke={A} strokeWidth="1" strokeDasharray="3 4" />
        <path d="M268 241l10 10 19-21" stroke={A} strokeWidth="3" strokeLinejoin="round" />
      </g>
    </>
  );
}

// Üzlet (csak az Akadémia témaköre): folyamatábra (lépések, döntési rombusz), fölötte nagyító narancs lencsével.
function Uzlet() {
  const boxes = [60, 150];
  return (
    <>
      {boxes.map((x, i) => (
        <rect key={x} className={M.glint} style={{ "--i": i }} x={x} y="128" width="62" height="40" rx="8" fill="var(--art-bg, #fff)" strokeWidth="1.5" />
      ))}
      <line x1="122" y1="148" x2="150" y2="148" strokeWidth="1.5" />
      <line x1="212" y1="148" x2="240" y2="148" strokeWidth="1.5" />
      <path d="M268 120 L296 148 L268 176 L240 148 Z" fill="var(--art-bg, #fff)" strokeWidth="1.5" />
      <path d="M268 120 V84 H330" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.6" />
      <path d="M268 176 V212 H330" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.6" />
      <rect x="330" y="68" width="40" height="32" rx="7" fill="var(--art-bg, #fff)" strokeWidth="1.5" opacity="0.6" />
      <rect x="330" y="196" width="40" height="32" rx="7" fill="var(--art-bg, #fff)" strokeWidth="1.5" opacity="0.6" />
      <g className={M.pulse}>
        <circle cx="181" cy="148" r="46" fill={A} fillOpacity="0.1" stroke={A} strokeWidth="2.5" />
        <line x1="214" y1="181" x2="246" y2="213" stroke={A} strokeWidth="6" />
      </g>
    </>
  );
}

const ART = { gazdasag: Gazdasag, tarsadalom: Tarsadalom, kultura: Kultura, tudomany: Tudomany, mi: Mi, szabalyzat: Szabalyzat, uzlet: Uzlet };

function CategoryArt({ slug, className, animated = false }) {
  const Art = ART[slug];
  if (!Art) return null;
  return (
    <svg
      className={[className, animated && M.animated].filter(Boolean).join(" ") || undefined} viewBox="0 0 400 300" fill="none" stroke="currentColor"
      strokeLinecap="round" aria-hidden="true" preserveAspectRatio="xMidYMid meet"
    >
      <Art animated={animated} />
    </svg>
  );
}

export default CategoryArt;
