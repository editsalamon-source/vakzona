import React, { useRef } from "react";
import { Link } from "react-router-dom";
import Arrow from "./Arrow";
import CategoryArt from "./CategoryArt";
import TilesCSS from "../css/CategoryTiles.module.css";

// Az obsidian.aura.build „Shop by Category” blokkjának mintájára: egymás melletti oszlopok,
// hoverre a kurzorhoz közelebbi szélről (fent/lent) becsúszik egy sötét réteg futó felirattal.
// Csak transform-animáció (opacity-áttűnés Chrome-ban fehéren villanhat).

const closestEdge = (e, el) => {
  const r = el.getBoundingClientRect();
  return e.clientY - r.top < r.height / 2 ? "-101%" : "101%";
};

function Tile({ category, index }) {
  const overlay = useRef(null);

  const enter = (e) => {
    const o = overlay.current;
    o.style.transition = "none";
    o.style.transform = `translateY(${closestEdge(e, e.currentTarget)})`;
    o.getBoundingClientRect(); // reflow, hogy az új kiinduló helyzetből induljon
    o.style.transition = "";
    o.style.transform = "translateY(0)";
  };
  const leave = (e) => {
    overlay.current.style.transform = `translateY(${closestEdge(e, e.currentTarget)})`;
  };

  const part = (
    <span className={TilesCSS.part}>
      <span>{category.name}</span>
      <span className={TilesCSS.pill}><CategoryArt slug={category.slug} /></span>
    </span>
  );

  return (
    <Link to={`/${category.slug}`} className={TilesCSS.tile} onMouseEnter={enter} onMouseLeave={leave}>
      <div className={TilesCSS.grid} />
      <CategoryArt slug={category.slug} className={TilesCSS.art} />
      <div className={TilesCSS.fade} />

      <div className={TilesCSS.content}>
        <span className="eyebrow">0{index + 1}</span>
        <h3>{category.name}</h3>
        <p>{category.description}</p>
        <div className={TilesCSS.foot}>
          <span>{category.count > 0 ? `${category.count} elemzés` : "Hamarosan"}</span>
          <span className={TilesCSS.footArrow}><Arrow size={14} /></span>
        </div>
      </div>

      <div className={TilesCSS.overlay} ref={overlay} aria-hidden="true">
        <div className={TilesCSS.marquee}>
          {Array.from({ length: 8 }, (_, i) => <React.Fragment key={i}>{part}</React.Fragment>)}
        </div>
      </div>
    </Link>
  );
}

function CategoryTiles({ categories }) {
  return (
    <div className={TilesCSS.row}>
      {categories.map((k, i) => <Tile key={k.slug} category={k} index={i} />)}
    </div>
  );
}

export default CategoryTiles;
