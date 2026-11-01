import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import analyses from "../data/analyses";
import courses, { AKADEMIA } from "../data/akademia";
import Arrow from "../components/Arrow";
import Reveal from "../components/Reveal";
import VisualField from "../components/VisualField";
import PageCSS from "../css/Page.module.css";
import CSS from "../css/About.module.css";

// soronként felcsúszó címsor (csak transform)
const line = (i) => ({
  initial: { y: "110%" },
  animate: { y: 0 },
  transition: { duration: 1, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
});

const QUESTIONS = [
  "Mi történik máshol Európában, amiről itthon alig esik szó?",
  "Mit veszünk természetesnek, ami talán egyáltalán nem az?",
  "Mi az, ami ott van előttünk, csak éppen nem vesszük észre?",
];

// Az oldal saját részeire mutató hivatkozás mindig az első említésnél van, belső linkként (Link).
function About() {
  const lessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);

  return (
    <>
      <section className={`wrap ${CSS.hero}`}>
        <div className={CSS.heroText}>
          <span className="tag">Rólam</span>
          <h1>
            {["Kérdezek,", "utánajárok,", "elmagyarázom."].map((t, i) => (
              <span key={t} className={CSS.line}>
                <motion.span {...line(i)} className={i === 2 ? CSS.accent : undefined}>
                  {t}
                </motion.span>
              </span>
            ))}
          </h1>
          <p className="lead">
            A szemünkben van egy pont, ahonnan nem érkezik kép, mégsem vesszük észre, mert az agy
            kitölti a hiányt. A gondolkodásunkban is vannak ilyen vakfoltok. A Vakzónán ezekre
            irányítom a figyelmet: független <Link to="/elemzesek">elemzésekben</Link> és
            a <Link to="/akademia">{AKADEMIA.name}</Link> videós tanfolyamain.
          </p>
        </div>

        <figure className={CSS.portrait} aria-hidden="true">
          <img className={CSS.photo} src="/rolam/portre.webp" alt="" width="640" height="853" />
          <span className={CSS.spotRing} />
          <span className={CSS.spot} />
          <span className={CSS.spotLabel}>vakfolt</span>
          <Link className={`${CSS.float} ${CSS.floatA}`} to="/elemzesek" tabIndex={-1}>
            <strong>{analyses.length}</strong>
            <span>elemzés<br />öt területen</span>
          </Link>
          <Link className={`${CSS.float} ${CSS.floatB}`} to="/akademia" tabIndex={-1}>
            <strong>{lessons}</strong>
            <span>videólecke<br />{courses.length} tanfolyamban</span>
          </Link>
        </figure>
      </section>

      <div className="wrap">
        <Reveal className={CSS.intro}>
          <div className={CSS.introHead}>
            <span className="tag tagAccent">Bemutatkozás</span>
            <h2>Salamon Edit</h2>
            <p>a Vakzóna szerzője</p>
          </div>
          <div className={CSS.introBody}>
            <p>
              Szeretek a kérdések mögé nézni. A Vakzóna elemzéseit és az Akadémia tanfolyamait én
              írom és állítom össze.
            </p>
            <p>
              Több mint huszonöt éve dolgozom az informatikában, voltam IT-üzleti tanácsadó és
              projektmenedzser, ma vezető IT-tanácsadó és üzleti elemző vagyok. A munkám középpontjában
              a mesterséges intelligencia üzleti alkalmazása áll: azon dolgozom, hogy egy
              szervezet igényeiből valóban használható MI-megoldás legyen.
            </p>
            <p>
              Ezért írok a legtöbbet az MI-ről: hogyan érdemes bevezetni egy
              szervezetben, mit kezd vele a munkaerőpiac, és mire kell figyelni, ha adatot bízunk
              rá. De ugyanilyen kíváncsisággal írok egy csillag életéről vagy Petőfi sírjáról is.
            </p>
            <ul className={CSS.facts}>
              <li>Elemzések</li>
              <li>MI-stratégia</li>
              <li>MI-ágensek</li>
              <li>Videós tanfolyamok</li>
            </ul>
          </div>
        </Reveal>
      </div>

      <section className={CSS.dark}>
        <div className={`wrap ${CSS.darkInner}`}>
          <span className="tag">Három kérdés vezet</span>
          <ol className={CSS.questions}>
            {QUESTIONS.map((q, i) => (
              <Reveal as="li" key={q} delay={i * 0.08}>
                <small>0{i + 1}</small>
                {q}
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <div className={`wrap ${CSS.body} ${PageCSS.split}`}>
        <Reveal className={PageCSS.prose}>
          <h2 style={{ marginTop: 0 }}>Miről írok?</h2>
          <p>
            Nem a híreket mesélem újra. Kérdéseket teszek fel, és utánajárok: adatokat keresek,
            országokat és megoldásokat vetek össze, és megnézem, mi áll egy-egy gyakran hallott
            állítás mögött.
          </p>
          <p>
            Öt területről írok: <Link to="/mi">mesterséges intelligenciáról</Link>,{" "}
            <Link to="/tudomany">tudományról</Link>, <Link to="/kultura">kultúráról</Link>,{" "}
            <Link to="/tarsadalom">társadalomról</Link> és <Link to="/gazdasag">gazdaságról</Link>.
            A témák különböznek, a kiindulópont ugyanaz: egy kérdés, amelyre érdemes alaposabb
            választ keresni, mint amit egy hír vagy egy vita adni tud.
          </p>

          <h2>Hogyan írok?</h2>
          <p>
            Minden elemzés közérthető bevezetővel kezdődik, hogy szakmai előismeret nélkül is
            követhető legyen. Ezután jönnek az adatok és az összehasonlítások, ellenőrizhető
            forrásokból, az eredeti helyükre mutató linkkel. Ahol egy kérdésre nincs biztos válasz,
            azt is megmondom.
          </p>
          <p>
            A munkához mesterséges intelligencián alapuló eszközöket is használok, a forrásokat
            azonban én választom ki, és minden számot, állítást az eredetivel vetek össze.
          </p>
          <p>
            Nem állok egyik politikai oldal mellé sem. Nem azért írok, hogy megmondjam, mit kell
            gondolni, hanem hogy legyen miről gondolkodni.
          </p>

          <h2>Mit kínál az Akadémia?</h2>
          <p>
            Az Akadémia tanfolyamai átgondolt, gondosan kidolgozott anyagok, amelyek a gyakorlati
            tapasztalatomból merítenek.
          </p>
          <p>
            A videók és a szöveg mesterséges intelligencia segítségével születtek. Ez tudatos
            döntés: ezek a témák gyorsan változnak, így az anyag hamar elkészülhet, és a
            változásokkal együtt könnyen frissíthető. Ha a gépi hang vagy egy-egy kiejtési hiba
            valakit zavar, elnézését kérem.
          </p>

          <h2>Hogyan bánok a forrásokkal?</h2>
          <p>
            Tiszteletben tartom a felhasznált művek szerzőinek jogait. A forrásokat nem közlöm
            újra, hanem összefoglalom és az eredeti helyükre hivatkozom, szó szerint csak rövid,
            megjelölt idézetet veszek át, a forrás megnevezésével. Az ábrákat magam készítem,
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
        <aside className={PageCSS.aside} style={{ marginTop: 0 }}>
          <VisualField />
        </aside>
      </div>
    </>
  );
}

export default About;
