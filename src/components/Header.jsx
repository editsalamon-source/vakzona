import React from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import Arrow from "./Arrow";
import analyses from "../data/analyses";
import HeaderCSS from "../css/Header.module.css";

const NAV = [
  { to: "/elemzesek", label: "Elemzések" },
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
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? HeaderCSS.active : undefined)}
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
