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

        <h2>Miről írunk?</h2>
        <p>
          Nem a híreket meséljük újra. Kérdéseket teszünk fel, és utánajárunk: adatokat keresünk,
          országokat és megoldásokat vetünk össze, és megnézzük, mi áll egy-egy gyakran hallott
          állítás mögött.
        </p>
        <p>Három kérdés vezet minket:</p>
        <ul>
          <li>Mi történik máshol Európában, amiről itthon alig esik szó?</li>
          <li>Mit veszünk természetesnek, ami talán egyáltalán nem az?</li>
          <li>Mi az, ami ott van előttünk, csak éppen nem vesszük észre?</li>
        </ul>
        <p>
          Írunk gazdaságról, társadalomról, kultúráról, tudományról és mesterséges
          intelligenciáról. A témák különböznek, a
          kiindulópont ugyanaz: egy kérdés, amelyre érdemes alaposabb választ keresni, mint amit
          egy hír vagy egy vita adni tud.
        </p>

        <h2>Hogyan írunk?</h2>
        <p>
          Minden elemzés egy közérthető bevezetővel kezdődik, hogy szakmai előismeret nélkül is
          követhető legyen. Ezután jönnek az adatok és az összehasonlítások, ellenőrizhető
          forrásokból, az eredeti helyükre mutató linkkel. Ahol egy kérdésre nincs biztos válasz,
          azt is megmondjuk.
        </p>
        <p>
          Nem állunk egyik politikai oldal mellé sem. Nem azért írunk, hogy megmondjuk, mit kell
          gondolni, hanem hogy legyen miről gondolkodni.
        </p>

        <h2>Mesterséges intelligencia és szerzői jog</h2>
        <p>
          A munkához mesterséges intelligencián alapuló eszközöket is használunk, a forrásokat
          azonban mi választjuk ki, és minden számot, állítást az eredetivel vetünk össze.
        </p>
        <p>
          Tiszteletben tartjuk a felhasznált művek szerzőinek jogait. A forrásokat nem közöljük
          újra, hanem összefoglaljuk és az eredeti helyükre hivatkozunk; szó szerint csak rövid,
          megjelölt idézetet veszünk át, a forrás megnevezésével. Ábráinkat magunk készítjük,
          szabadon felhasználható adatokból, a licenc által előírt feltüntetéssel.
        </p>
      </Reveal>
    </div>
  );
}

export default About;
