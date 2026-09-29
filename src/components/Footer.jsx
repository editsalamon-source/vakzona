import React from "react";
import { Link } from "react-router-dom";
import FooterCSS from "../css/Footer.module.css";

function Footer() {
  return (
    <footer className={FooterCSS.footer}>
      <div className={`wrap ${FooterCSS.inner}`}>
        <span>© {new Date().getFullYear()} Vakzóna · vakzona.com</span>
        <span>
          <Link to="/elemzesek">Elemzések</Link> · <Link to="/rolunk">Rólunk</Link> ·{" "}
          <Link to="/kapcsolat">Kapcsolat</Link>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
