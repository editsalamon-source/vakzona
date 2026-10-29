import React from "react";
import { Link } from "react-router-dom";
import { AKADEMIA } from "../data/akademia";
import Arrow from "../components/Arrow";
import Reveal from "../components/Reveal";
import VisualField from "../components/VisualField";
import PageCSS from "../css/Page.module.css";

// Az oldal saját részeire mutató hivatkozás mindig az első említésnél van, belső linkként (Link).
function About() {
  return (
    <div className={`wrap ${PageCSS.page} ${PageCSS.split}`}>
      <Reveal className={PageCSS.prose}>
        <span className="tag">Rólunk</span>
        <h1>A vakfolt, amit nem látunk.</h1>
        <p className="lead">
          A szemünkben van egy pont, ahonnan nem érkezik kép, mégsem vesszük észre, mert az agy
          kitölti a hiányt. A gondolkodásunkban is vannak ilyen vakfoltok: dolgok, amelyek ott
          vannak előttünk, csak nem látjuk őket. A Vakzóna ezekre irányítja a figyelmet:
          független <Link to="/elemzesek">elemzésekben</Link> és
          a <Link to="/akademia">{AKADEMIA.name}</Link> videós tanfolyamain.
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
          Öt területről írunk: <Link to="/mi">mesterséges intelligenciáról</Link>,{" "}
          <Link to="/tudomany">tudományról</Link>, <Link to="/kultura">kultúráról</Link>,{" "}
          <Link to="/tarsadalom">társadalomról</Link> és <Link to="/gazdasag">gazdaságról</Link>. A
          témák különböznek, a kiindulópont ugyanaz: egy kérdés, amelyre érdemes alaposabb választ
          keresni, mint amit egy hír vagy egy vita adni tud.
        </p>

        <h2>Hogyan írunk?</h2>
        <p>
          Minden elemzés közérthető bevezetővel kezdődik, hogy szakmai előismeret nélkül is
          követhető legyen. Ezután jönnek az adatok és az összehasonlítások, ellenőrizhető
          forrásokból, az eredeti helyükre mutató linkkel. Ahol egy kérdésre nincs biztos válasz,
          azt is megmondjuk.
        </p>
        <p>
          A munkához mesterséges intelligencián alapuló eszközöket is használunk, a forrásokat
          azonban mi választjuk ki, és minden számot, állítást az eredetivel vetünk össze.
        </p>
        <p>
          Nem állunk egyik politikai oldal mellé sem. Nem azért írunk, hogy megmondjuk, mit kell
          gondolni, hanem hogy legyen miről gondolkodni.
        </p>

        <h2>Mit kínál az Akadémia?</h2>
        <p>
          Az Akadémia tanfolyamai átgondolt, gondosan kidolgozott anyagok, amelyek a gyakorlati
          tapasztalatból merítenek.
        </p>
        <p>
          A videók és a szöveg mesterséges intelligencia segítségével születtek. Ez tudatos
          döntés: ezek a témák gyorsan változnak, így az anyag hamar elkészülhet, és a
          változásokkal együtt könnyen frissíthető. Ha a gépi hang vagy egy-egy kiejtési hiba
          valakit zavar, elnézését kérjük.
        </p>

        <h2>Hogyan bánunk a forrásokkal?</h2>
        <p>
          Tiszteletben tartjuk a felhasznált művek szerzőinek jogait. A forrásokat nem közöljük
          újra, hanem összefoglaljuk és az eredeti helyükre hivatkozunk, szó szerint csak rövid,
          megjelölt idézetet veszünk át, a forrás megnevezésével. Ábráinkat magunk készítjük,
          szabadon felhasználható adatokból, a licenc által előírt feltüntetéssel.
        </p>

        <div className={`${PageCSS.actions} ${PageCSS.actionRow}`}>
          <Link className="btn" to="/elemzesek">
            Elemzések <Arrow size={12} />
          </Link>
          <Link className="btn" to="/akademia">
            {AKADEMIA.menu} <Arrow size={12} />
          </Link>
        </div>
      </Reveal>

      {/* jobb oldali illusztráció: a görgetés alatt helyben marad (széles képernyőn) */}
      <aside className={PageCSS.aside}>
        <VisualField />
      </aside>
    </div>
  );
}

export default About;
