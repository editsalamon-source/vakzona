import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { getTopics } from "../data/analyses";
import FooterCSS from "../css/Footer.module.css";

function Footer() {
  const topics = getTopics();

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
          {topics.length > 0 && (
            <div className={FooterCSS.col}>
              <span className={FooterCSS.label}>Témák</span>
              {topics.map((t) => (
                <Link key={t.slug} to={`/elemzesek?tema=${t.slug}`}>
                  {t.name}
                </Link>
              ))}
            </div>
          )}
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
