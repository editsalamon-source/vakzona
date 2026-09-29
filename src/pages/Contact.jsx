import React from "react";
import PageCSS from "../css/Page.module.css";

const EMAIL = "info@vakzona.com";

function Contact() {
  return (
    <div className={`wrap read ${PageCSS.page}`}>
      <h1>Kapcsolat</h1>
      <p>
        Kérdésed, észrevételed van egy elemzéssel kapcsolatban, vagy témát javasolnál? Írj
        nekünk!
      </p>
      <div className={PageCSS.box}>
        <p>
          <strong>E-mail:</strong> <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
        <p className="meta">Általában néhány munkanapon belül válaszolunk.</p>
      </div>
    </div>
  );
}

export default Contact;
