import React from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import HeaderCSS from "../css/Header.module.css";

const NAV = [
  { to: "/", label: "Főoldal", end: true },
  { to: "/elemzesek", label: "Elemzések" },
  { to: "/rolunk", label: "Rólunk" },
  { to: "/kapcsolat", label: "Kapcsolat" },
];

function Header() {
  return (
    <header className={HeaderCSS.header}>
      <div className={`wrap ${HeaderCSS.inner}`}>
        <Link to="/" className={HeaderCSS.brand}>
          <Logo />
          Vakzóna
        </Link>
        <nav className={HeaderCSS.nav} aria-label="Fő navigáció">
          {NAV.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? HeaderCSS.active : undefined)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
