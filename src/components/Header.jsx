import React from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import Arrow from "./Arrow";
import analyses from "../data/analyses";
import KATEGORIAK from "../data/kategoriak";
import HeaderCSS from "../css/Header.module.css";

// a kategóriák csak széles képernyőn férnek ki a menübe (keskenyen az Elemzések oldalon vannak)
const NAV = [
  { to: "/elemzesek", label: "Elemzések", end: true },
  ...KATEGORIAK.map((k) => ({ to: `/${k.slug}`, label: k.name, category: true })),
  { to: "/rolunk", label: "Rólunk" },
];

// Lebegő, üveghatású pirula-menü a lap tetején.
function Header() {
  const latest = analyses[0];

  return (
    <header className={HeaderCSS.header}>
      <div className={HeaderCSS.pill}>
        <Link to="/" className={HeaderCSS.brand} aria-label="Vakzóna – főoldal">
          <Logo size={22} />
          <span>Vakzóna</span>
        </Link>
        <nav className={HeaderCSS.nav} aria-label="Fő navigáció">
          {NAV.map(({ to, label, end, category }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [category && HeaderCSS.category, isActive && HeaderCSS.active].filter(Boolean).join(" ") || undefined
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        {latest && (
          <Link to={`/elemzesek/${latest.slug}`} className={HeaderCSS.cta}>
            <span>Legújabb</span>
            <Arrow size={12} />
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
