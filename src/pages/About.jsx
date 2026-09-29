import React from "react";
import PageCSS from "../css/Page.module.css";

function About() {
  return (
    <div className={`wrap read ${PageCSS.page}`}>
      <h1>Rólunk</h1>
      <p className="lead">
        A vakfolt az a terület, ami a szemünk előtt van, mégsem látjuk. A Vakzóna ezekre a
        területekre fókuszál.
      </p>

      <h2>Kik vagyunk?</h2>
      <p>[Rövid bemutatkozás: kik állnak az oldal mögött, milyen háttérrel és szakterülettel.]</p>

      <h2>Hogyan készülnek az elemzések?</h2>
      <p>
        Elemzéseink alapja jellemzően egy általunk készített megvalósíthatósági tanulmány vagy
        saját adatgyűjtés. Minden írásnál feltüntetjük:
      </p>
      <ul>
        <li>a felhasznált adatforrásokat,</li>
        <li>a számítások mögötti feltételezéseket,</li>
        <li>és az eredmények korlátait.</li>
      </ul>

      <h2>Függetlenség</h2>
      <p>[Finanszírozás, esetleges együttműködések és összeférhetetlenségek bemutatása.]</p>
    </div>
  );
}

export default About;
