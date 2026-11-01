import React from "react";
import { Link } from "react-router-dom";
import CategoryArt from "./CategoryArt";
import Logo from "./Logo";
import CSS from "../css/ListHead.module.css";

// A lista-oldalak (Elemzések, kategóriák, Akadémia) közös feje. Felül a szakasz szűrősora (Összes ·
// kategóriák): mindig ugyanott áll, közvetlenül a menü alatt, így oldalváltáskor nem ugrik. Alatta egy
// fix magasságú sáv: cím, legfeljebb háromsoros bevezető, jobbra a kategória mozgó ábrája (vagy a logó)
// és egy nagy szám (hány elemzés, tanfolyam). Belépő animáció nincs, hogy váltáskor semmi ne mozduljon.
//
// links: [{ to, label, count, current }]
function ListHead({ label, links, eyebrow, title, lead, art = null, stat = null }) {
  return (
    <>
      <nav className={CSS.sections} aria-label={label}>
        <div className={CSS.track}>
          {links.map((l) => (
            <Link key={l.to} to={l.to} aria-current={l.current ? "page" : undefined}>
              {l.label}
              {l.count > 0 && <span className={CSS.count}>{l.count}</span>}
            </Link>
          ))}
        </div>
      </nav>

      <header className={CSS.band}>
        <span className={CSS.grid} aria-hidden="true" />
        <span className={CSS.glow} aria-hidden="true" />
        <div className={CSS.text}>
          <span className={CSS.eyebrow}>{eyebrow}</span>
          <h1 className={CSS.title}>{title}</h1>
          {lead && <p className={CSS.lead}>{lead}</p>}
        </div>
        <div className={CSS.visual} aria-hidden="true">
          {art ? <CategoryArt slug={art} className={CSS.art} animated /> : <span className={CSS.logo}><Logo size={170} /></span>}
          {stat && (
            <span className={CSS.stat}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              {stat.note && <em>{stat.note}</em>}
            </span>
          )}
        </div>
      </header>
    </>
  );
}

export default ListHead;
