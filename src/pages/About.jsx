import React from "react";
import Reveal from "../components/Reveal";
import PageCSS from "../css/Page.module.css";

function About() {
  return (
    <div className={`wrap ${PageCSS.page}`}>
      <Reveal className={PageCSS.prose}>
        <span className="tag">Rólunk</span>
        <h1>A vakfolt, amit nem látunk.</h1>
        <p className="lead">
          A vakfolt az a terület, ami a szemünk előtt van, mégsem látjuk. A Vakzóna ezekre a
          területekre fókuszál.
        </p>

        <h2>Kik vagyunk?</h2>
        <p>[Rövid bemutatkozás: kik állnak az oldal mögött, milyen háttérrel és szakterülettel.]</p>

        <h2>Hogyan készülnek az elemzések?</h2>
        <p>
          Elemzéseink kizárólag ellenőrizhető, hivatalos forrásokra épülnek: jogszabályokra,
          statisztikákra, hazai, uniós és nemzetközi intézmények kiadványaira. Minden írásnál
          feltüntetjük:
        </p>
        <ul>
          <li>a felhasznált forrásokat, az eredeti helyükre mutató linkkel,</li>
          <li>a számítások mögötti feltételezéseket,</li>
          <li>és az eredmények korlátait.</li>
        </ul>

        <h2>Mesterséges intelligencia</h2>
        <p>
          A munkában mesterséges intelligencián alapuló eszközöket használunk: a források
          feldolgozásához, kivonatolásához és a szöveg előkészítéséhez. A forrásokat mi választjuk
          ki, és minden számot, állítást az eredeti forrással vetünk össze, mielőtt egy elemzés
          megjelenik.
        </p>

        <h2>Függetlenség</h2>
        <p>[Finanszírozás, esetleges együttműködések és összeférhetetlenségek bemutatása.]</p>
      </Reveal>
    </div>
  );
}

export default About;
