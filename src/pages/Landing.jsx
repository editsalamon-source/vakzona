import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import analyses, { getCategories } from "../data/analyses";
import AnalysisCard from "../components/AnalysisCard";
import CategoryTiles from "../components/CategoryTiles";
import HeroCanvas from "../components/HeroCanvas";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import { INTRO_DELAY } from "../utils/intro";
import CardCSS from "../css/AnalysisCard.module.css";
import LandingCSS from "../css/Landing.module.css";

const PILLARS = [
  {
    title: "Hivatalos források",
    text: "Csak ellenőrizhető, hivatalos forrásból dolgozunk – hazai, uniós és nemzetközi körben –, és minden forrást az eredeti helyére linkelünk.",
  },
  {
    title: "MI-eszközök, emberi kontrollal",
    text: "A források feldolgozásában és a szöveg előkészítésében mesterséges intelligenciát használunk. A forrásokat mi választjuk ki, és minden számot az eredeti forrással vetünk össze.",
  },
  {
    title: "Átlátható módszertan",
    text: "Minden elemzésnél leírjuk, milyen adatokból és feltételezésekből indultunk ki.",
  },
  {
    title: "Közérthető összefoglaló",
    text: "A lényeg néhány pontban, a részletek azoknak, akik mélyebbre ásnának.",
  },
];

// a nyitóképernyő után induló, soronként felcsúszó címsor (csak transform)
const line = (i) => ({
  initial: { y: "110%" },
  animate: { y: 0 },
  transition: { duration: 1, delay: INTRO_DELAY + 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
});

function Landing() {
  const [latest, ...earlier] = analyses;
  const categories = getCategories();

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className={LandingCSS.hero}>
        <div className={LandingCSS.heroText}>
          <div className={LandingCSS.heroInner}>
            <h1 className={LandingCSS.title}>
              <span className={LandingCSS.mask}>
                <motion.span {...line(0)}>Ami kimarad</motion.span>
              </span>
              <span className={LandingCSS.mask}>
                <motion.span {...line(1)}>a látómezőből.</motion.span>
              </span>
            </h1>
            <Reveal delay={INTRO_DELAY + 0.35}>
              <p className={`lead ${LandingCSS.lead}`}>
                A Vakzóna független elemzéseket közöl gazdasági, társadalmi, kulturális,
                tudományos és MI-témákban – hivatalos forrásokra, adatokra és átlátható módszertanra
                építve. A munkában mesterséges intelligenciát is használunk, de minden állítást
                az eredeti forrással ellenőrzünk.
              </p>
              <div className={LandingCSS.actions}>
                <Link className="btn" to="/elemzesek">
                  Elemzések <Arrow size={12} />
                </Link>
                <Link className="btn btnGhost" to="/rolunk">Hogyan dolgozunk?</Link>
              </div>
            </Reveal>
          </div>
        </div>

        <div className={LandingCSS.heroVisual}>
          <div className={LandingCSS.gridPattern} />
          <HeroCanvas className={LandingCSS.canvas} />
          {latest?.highlight && (
            <motion.div
              className={LandingCSS.floatCard}
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: INTRO_DELAY + 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={`/elemzesek/${latest.slug}`}>
                <div className={LandingCSS.floatTop}>
                  <span className={LandingCSS.floatNumber}>{latest.highlight}</span>
                  <span className="eyebrow">{latest.category.name}</span>
                </div>
                <p>{latest.highlightText}</p>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* ---------- Kategóriák ---------- */}
      <section className={`${LandingCSS.section} ${LandingCSS.tilesSection}`}>
        <div className="wrap">
          <Reveal className={LandingCSS.sectionHead}>
            <div>
              <span className="tag">Kategóriák</span>
              <h2>Öt terület, egy módszer</h2>
            </div>
            <Link to="/elemzesek" className={LandingCSS.underlineLink}>
              Összes elemzés <Arrow size={12} />
            </Link>
          </Reveal>
        </div>
        <CategoryTiles categories={categories} />
      </section>

      {/* ---------- Kiemelt elemzés (sötét sáv) ---------- */}
      {latest && (
        <section className={LandingCSS.dark}>
          <div className={LandingCSS.darkLine} />
          <div className={LandingCSS.darkGrid} />
          <div className={`wrap ${LandingCSS.darkInner}`}>
            <Reveal>
              <span className="tag">Legfrissebb</span>
              <h2 className={LandingCSS.darkHeading}>Kiemelt elemzés</h2>
              <span className={LandingCSS.darkMeta}>{latest.category.name} · {latest.topic}</span>
              <h3 className={LandingCSS.darkTitle}>{latest.title}</h3>
              {latest.subtitle && <p className={LandingCSS.darkLead}>{latest.subtitle}</p>}
              <div className={LandingCSS.darkActions}>
                <Link to={`/elemzesek/${latest.slug}`} className={LandingCSS.whiteBtn}>
                  <span className={LandingCSS.whiteBtnIcon}><Arrow size={11} /></span>
                  Elolvasom
                </Link>
                <Link to="/elemzesek" className={LandingCSS.outlineBtn}>Összes elemzés</Link>
              </div>
              {latest.stats.length > 0 && (
                <div className={LandingCSS.stats}>
                  {latest.stats.map((s) => (
                    <div key={s.label}>
                      <div className={LandingCSS.statValue}>{s.value}</div>
                      <p className={LandingCSS.statLabel}>{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------- Korábbi elemzések ---------- */}
      {earlier.length > 0 && (
        <section className={LandingCSS.section}>
          <div className="wrap">
            <Reveal className={LandingCSS.sectionHead}>
              <div>
                <span className="tag">Elemzések</span>
                <h2>Korábbi elemzések</h2>
              </div>
              <Link to="/elemzesek" className={LandingCSS.underlineLink}>
                Összes elemzés <Arrow size={12} />
              </Link>
            </Reveal>
            <div className={CardCSS.list}>
              {earlier.slice(0, 3).map((a, i) => (
                <AnalysisCard key={a.slug} analysis={a} featured={i === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Amire építünk ---------- */}
      <section className={`${LandingCSS.section} ${LandingCSS.bordered}`}>
        <div className="wrap">
          <Reveal className={LandingCSS.centerHead}>
            <h2>Amire építünk</h2>
            <p className="lead">
              Minden elemzés ugyanarra a négy alapelvre épül, hogy a számok mögötti gondolatmenet
              is követhető legyen.
            </p>
          </Reveal>
          <div className={LandingCSS.pillars}>
            {PILLARS.map(({ title, text }, i) => (
              <Reveal key={title} delay={i * 0.08} className={LandingCSS.pillar}>
                <span className="eyebrow">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Landing;
