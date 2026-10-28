import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import analyses, { getCategories } from "../data/analyses";
import courses, { AKADEMIA, formatLength } from "../data/akademia";
import AnalysisCard from "../components/AnalysisCard";
import CourseTile from "../components/CourseTile";
import CategoryTiles from "../components/CategoryTiles";
import CategoryArt from "../components/CategoryArt";
import HeroCanvas from "../components/HeroCanvas";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import { INTRO_DELAY } from "../utils/intro";
import CardCSS from "../css/AnalysisCard.module.css";
import AcademyCSS from "../css/Academy.module.css";
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
  const lessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
  const seconds = courses.reduce((sum, c) => sum + c.seconds, 0);
  const pdfs = analyses.filter((a) => a.pdf).length;

  // a két pillér: elemzések és Akadémia (a számok a tartalomból jönnek)
  const paths = [
    {
      to: "/elemzesek",
      tag: "Elemzések",
      number: analyses.length,
      unit: "elemzés",
      text: "Független elemzések öt területen, hivatalos forrásokra építve, közérthető összefoglalóval.",
      meta: [`${categories.length} kategória`, pdfs > 0 && `${pdfs} letölthető teljes PDF`],
    },
    {
      to: "/akademia",
      tag: AKADEMIA.menu,
      number: courses.length,
      unit: "tanfolyam",
      // a tanfolyamok címe; ha csak egy van, az alcíme is
      courses: courses.slice(0, 3),
      meta: [`${lessons} videólecke`, seconds > 0 && formatLength(seconds)],
    },
  ];

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
                építve –, az Akadémián pedig videós tanfolyamokat kínál. A munkában mesterséges
                intelligenciát is használunk, de minden állítást az eredeti forrással ellenőrzünk.
              </p>
              <div className={LandingCSS.actions}>
                <Link className="btn" to="/elemzesek">
                  Elemzések <Arrow size={12} />
                </Link>
                <Link className="btn btnGhost" to="/akademia">{AKADEMIA.menu}</Link>
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

      {/* ---------- Két út: Elemzések és Akadémia ---------- */}
      <section className={LandingCSS.paths}>
        <div className={`wrap ${LandingCSS.pathGrid}`}>
          {paths.map((p, i) => (
            <Reveal key={p.to} delay={i * 0.08}>
              <Link to={p.to} className={LandingCSS.path}>
                <span className="tag">{p.tag}</span>
                <span className={LandingCSS.pathNumber}>
                  {p.number}
                  <span>{p.unit}</span>
                </span>
                {p.text && <p>{p.text}</p>}
                {p.courses && (
                  <span className={LandingCSS.pathCourses}>
                    {p.courses.map((c) => (
                      <span key={c.slug}>
                        <strong>{c.title}</strong>
                        {p.courses.length === 1 && c.subtitle && <span>{c.subtitle}</span>}
                      </span>
                    ))}
                  </span>
                )}
                <span className={LandingCSS.pathFoot}>
                  <span className="meta">{p.meta.filter(Boolean).join(" · ")}</span>
                  <span className={LandingCSS.pathArrow}><Arrow size={12} /></span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
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
            {/* a kiemelt elemzés kategóriájának ábrája (széles képernyőn) */}
            <Reveal delay={0.15} className={LandingCSS.darkArt}>
              <CategoryArt slug={latest.category.slug} />
            </Reveal>
          </div>
        </section>
      )}

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

      {/* ---------- Akadémia ---------- */}
      {courses.length > 0 && (
        <section className={`${LandingCSS.section} ${LandingCSS.bordered}`}>
          <div className="wrap">
            <Reveal className={LandingCSS.sectionHead}>
              <div>
                <span className="tag">{AKADEMIA.menu}</span>
                <h2>{AKADEMIA.name}</h2>
              </div>
              <Link to="/akademia" className={LandingCSS.underlineLink}>
                Minden tanfolyam <Arrow size={12} />
              </Link>
            </Reveal>
            <div className={AcademyCSS.tiles}>
              {courses.slice(0, 2).map((c) => (
                <CourseTile key={c.slug} course={c} />
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
