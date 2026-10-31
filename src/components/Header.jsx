import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import Arrow from "./Arrow";
import CategoryArt from "./CategoryArt";
import analyses, { getCategories } from "../data/analyses";
import courses, { AKADEMIA, formatLength } from "../data/akademia";
import { readProgress } from "../utils/haladas";
import { FIOK, useAccount } from "../utils/fiok";
import HeaderCSS from "../css/Header.module.css";

const active = (base) => ({ isActive }) => [base, isActive && HeaderCSS.active].filter(Boolean).join(" ");

// Elemzések: a kategóriák (leírással és darabszámmal), az összes elemzés és a legfrissebb.
function AnalysesPanel() {
  const latest = analyses[0];
  return (
    <div className={`${HeaderCSS.panel} ${HeaderCSS.panelWide}`}>
      <div className={HeaderCSS.panelGrid}>
        {getCategories().map((k) => (
          <Link key={k.slug} to={`/${k.slug}`} className={HeaderCSS.item}>
            <span className={HeaderCSS.itemTitle}>{k.name}</span>
            <span className={HeaderCSS.itemText}>{k.description}</span>
            <span className={HeaderCSS.itemMeta}>{k.count ? `${k.count} elemzés` : "hamarosan"}</span>
          </Link>
        ))}
        <Link to="/elemzesek" className={`${HeaderCSS.item} ${HeaderCSS.itemAll}`}>
          <span className={HeaderCSS.itemTitle}>Összes elemzés <Arrow size={11} /></span>
          <span className={HeaderCSS.itemMeta}>{analyses.length} elemzés</span>
        </Link>
      </div>
      {latest && (
        <Link to={`/elemzesek/${latest.slug}`} className={HeaderCSS.feature}>
          <CategoryArt slug={latest.category.slug} className={HeaderCSS.featureArt} />
          <span className={HeaderCSS.itemMeta}>Legfrissebb</span>
          <span className={HeaderCSS.itemTitle}>{latest.title}</span>
          <span className={HeaderCSS.itemText}>{latest.category.name}{latest.topic && ` · ${latest.topic}`}</span>
        </Link>
      )}
    </div>
  );
}

// Akadémia: a tanfolyamok; ha a látogató már elkezdte, a haladása (localStorage) is.
function AcademyPanel() {
  useLocation(); // navigáláskor újraolvassa a haladást
  return (
    <div className={HeaderCSS.panel}>
      {courses.map((c) => {
        const done = readProgress(c);
        const total = c.lessons.length;
        return (
          <Link key={c.slug} to={`/akademia/${c.slug}`} className={HeaderCSS.item}>
            <span className={HeaderCSS.itemTitle}>{c.title}</span>
            {c.subtitle && <span className={HeaderCSS.itemText}>{c.subtitle}</span>}
            <span className={HeaderCSS.itemMeta}>
              {total} lecke{c.seconds > 0 && ` · ${formatLength(c.seconds)}`}
            </span>
            {done > 0 && (
              <span className={HeaderCSS.resume}>
                {done === total ? "Kész – oklevél" : `Folytatom: ${done} / ${total} lecke kész`} <Arrow size={11} />
              </span>
            )}
          </Link>
        );
      })}
      <Link to="/akademia" className={`${HeaderCSS.item} ${HeaderCSS.itemAll}`}>
        <span className={HeaderCSS.itemTitle}>{AKADEMIA.name} <Arrow size={11} /></span>
        <span className={HeaderCSS.itemMeta}>{courses.length} tanfolyam</span>
      </Link>
    </div>
  );
}

// Fiók ikon (csak bekapcsolt fióknál); bejelentkezve narancs pötty jelzi
function AccountLink() {
  const { user } = useAccount();
  const label = user ? `Fiók: ${user.email}` : "Fiók: belépés vagy regisztráció";
  return (
    <NavLink to="/fiok" className={active(HeaderCSS.account)} aria-label={label} title={label}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8.5" r="3.75" />
        <path d="M4.75 20c.9-3.6 3.8-5.75 7.25-5.75s6.35 2.15 7.25 5.75" />
      </svg>
      {user && <span className={HeaderCSS.accountDot} />}
    </NavLink>
  );
}

// Lebegő, üveghatású pirula-menü a lap tetején. Széles képernyőn (egérrel) az Elemzések és az
// Akadémia fölé víve legördülő panel nyílik; keskenyen és érintőképernyőn sima link marad.
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
          <div className={`${HeaderCSS.drop} ${HeaderCSS.dropWide}`}>
            <NavLink to="/elemzesek" className={active(HeaderCSS.analyses)}>
              Elemzések
            </NavLink>
            <AnalysesPanel />
          </div>
          <div className={HeaderCSS.drop}>
            <NavLink to="/akademia" className={active(HeaderCSS.academy)}>
              {AKADEMIA.menu}
            </NavLink>
            <AcademyPanel />
          </div>
          <NavLink to="/rolunk" className={active(HeaderCSS.about)}>
            Rólunk
          </NavLink>
          {FIOK && <AccountLink />}
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
