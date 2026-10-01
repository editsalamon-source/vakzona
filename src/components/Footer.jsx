import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import KATEGORIAK from "../data/kategoriak";
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
            <span className={FooterCSS.label}>Oldalak</span>
            <Link to="/">Főoldal</Link>
            <Link to="/elemzesek">Elemzések</Link>
            <Link to="/rolunk">Rólunk</Link>
          </div>
          <div className={FooterCSS.col}>
            <span className={FooterCSS.label}>Kategóriák</span>
            {KATEGORIAK.map((k) => (
              <Link key={k.slug} to={`/${k.slug}`}>
                {k.name}
              </Link>
            ))}
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
