import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import KATEGORIAK from "../data/kategoriak";
import courses, { AKADEMIA } from "../data/akademia";
import { FIOK } from "../utils/fiok";
import FooterCSS from "../css/Footer.module.css";

function Footer() {
  return (
    <footer className={FooterCSS.footer}>
      <div className="wrap">
        <div className={FooterCSS.grid}>
          <div>
            <Link to="/" className={FooterCSS.brand}>
              <Logo size={26} />
              Vakzóna.
            </Link>
            <p className={FooterCSS.tagline}>
              Elemzések arról, ami kimarad a látómezőből.
            </p>
          </div>
          <div className={FooterCSS.col}>
            <span className={FooterCSS.label}>Elemzések</span>
            <Link to="/elemzesek">Összes elemzés</Link>
            {KATEGORIAK.map((k) => (
              <Link key={k.slug} to={`/${k.slug}`}>
                {k.name}
              </Link>
            ))}
          </div>
          <div className={FooterCSS.col}>
            <span className={FooterCSS.label}>{AKADEMIA.menu}</span>
            <Link to="/akademia">Minden tanfolyam</Link>
            {courses.map((c) => (
              <Link key={c.slug} to={`/akademia/${c.slug}`}>
                {c.title}
              </Link>
            ))}
          </div>
          <div className={FooterCSS.col}>
            <span className={FooterCSS.label}>Vakzóna</span>
            <Link to="/">Főoldal</Link>
            <Link to="/rolunk">Rólunk</Link>
            {FIOK && <Link to="/fiok">Fiók</Link>}
            {FIOK && <Link to="/adatkezeles">Adatkezelés</Link>}
          </div>
        </div>
        <div className={FooterCSS.bottom}>
          <span>© {new Date().getFullYear()} Vakzóna</span>
          <span>vakzona.com</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
