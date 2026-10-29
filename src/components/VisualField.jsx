import React from "react";
import CSS from "../css/VisualField.module.css";

// A Rólunk oldal illusztrációja: látómező-vizsgálat (perimetria) ábrája a vakfolttal.
// Vékony vonalas ábra az oldal stílusában, egyetlen narancs elemmel (a vakfolt); a pásztázó
// sugár lassan körbefordul (csak transform).
const C = 200; // középpont (fixációs pont)
const R = 180; // a látómező széle (30°)
const SPOT = { x: 290, y: 214, rx: 24, ry: 32 }; // a vakfolt: kb. 15°-kal kifelé, kissé lejjebb

const inSpot = (x, y, pad = 0) =>
  ((x - SPOT.x) / (SPOT.rx + pad)) ** 2 + ((y - SPOT.y) / (SPOT.ry + pad)) ** 2 <= 1;

// mérési pontok 20 px-es rácsban; a középhez közel nagyobbak (ott a legélesebb a látás)
const DOTS = [];
for (let x = C - R; x <= C + R; x += 20) {
  for (let y = C - R; y <= C + R; y += 20) {
    const d = Math.hypot(x - C, y - C);
    if (d > R - 4 || d < 8 || inSpot(x, y, 6)) continue;
    DOTS.push({ x, y, r: 2.6 - (d / R) * 1.4 });
  }
}

function VisualField() {
  return (
    <figure className={CSS.figure}>
      <div className={CSS.panel}>
        <span className={CSS.label}>Látómező</span>
        <svg className={CSS.svg} viewBox="0 0 400 400" fill="none" stroke="currentColor" aria-hidden="true">
          {/* fokgyűrűk és tengelyek */}
          {[60, 120, 180].map((r) => (
            <circle key={r} cx={C} cy={C} r={r} strokeWidth="1" opacity={r === R ? 0.9 : 0.45} />
          ))}
          <line x1={C - R - 8} y1={C} x2={C + R + 8} y2={C} strokeWidth="1" opacity="0.45" />
          <line x1={C} y1={C - R - 8} x2={C} y2={C + R + 8} strokeWidth="1" opacity="0.45" />
          {[10, 20, 30].map((deg, i) => (
            <text key={deg} x={C - 60 * (i + 1) + 4} y={C - 6} className={CSS.deg}>
              {deg}°
            </text>
          ))}

          {/* pásztázó sugár */}
          <g className={CSS.sweep}>
            <path d={`M${C} ${C} L${C + R} ${C} A${R} ${R} 0 0 0 ${C + R * Math.cos(-0.5)} ${C + R * Math.sin(-0.5)} Z`}
              fill="currentColor" fillOpacity="0.05" stroke="none" />
            <line x1={C} y1={C} x2={C + R} y2={C} strokeWidth="1.5" />
          </g>

          {/* mérési pontok */}
          {DOTS.map(({ x, y, r }) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="currentColor" stroke="none" opacity="0.55" />
          ))}

          {/* vakfolt */}
          <ellipse cx={SPOT.x} cy={SPOT.y} rx={SPOT.rx} ry={SPOT.ry} fill="var(--accent)" fillOpacity="0.1"
            stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx={SPOT.x} cy={SPOT.y} r="4" fill="var(--accent)" stroke="none" />
          <polyline points={`${SPOT.x + 16} ${SPOT.y + 28},${SPOT.x + 40} ${SPOT.y + 64},${SPOT.x + 70} ${SPOT.y + 64}`}
            stroke="var(--accent)" strokeWidth="1" />
          <text x={SPOT.x + 40} y={SPOT.y + 58} className={CSS.spotLabel}>Vakfolt</text>

          {/* fixációs pont */}
          <circle cx={C} cy={C} r="9" strokeWidth="1.5" fill="var(--bg-soft)" />
          <circle cx={C} cy={C} r="3" fill="var(--ink)" stroke="none" />
        </svg>
      </div>
      <figcaption className={CSS.caption}>
        A látómezőben mindenkinek van egy pontja, ahonnan nem érkezik kép: itt lép ki a szemből a
        látóideg. Az agy kitölti a hiányt, ezért nem vesszük észre.
      </figcaption>
    </figure>
  );
}

export default VisualField;
