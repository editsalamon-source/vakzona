import React from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import Arrow from "./Arrow";
import analyses from "../data/analyses";
import KATEGORIAK from "../data/kategoriak";
import HeaderCSS from "../css/Header.module.css";

const active = (base) => ({ isActive }) => [base, isActive && HeaderCSS.active].filter(Boolean).join(" ");

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
          {/* a kategóriák csak széles képernyőn férnek ki a menübe (keskenyen az Elemzések oldalon vannak) */}
          <div className={HeaderCSS.categories}>
            {KATEGORIAK.map((k) => (
              <NavLink key={k.slug} to={`/${k.slug}`} className={active(HeaderCSS.category)}>
                {k.name}
              </NavLink>
            ))}
          </div>
          <NavLink to="/elemzesek" end className={active(HeaderCSS.analyses)}>
            Elemzések
          </NavLink>
          <NavLink to="/rolunk" className={active(HeaderCSS.about)}>
            Rólunk
          </NavLink>
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
