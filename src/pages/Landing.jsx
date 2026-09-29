import React from "react";
import { Link } from "react-router-dom";
import analyses from "../data/analyses";
import AnalysisCard from "../components/AnalysisCard";
import CardCSS from "../css/AnalysisCard.module.css";
import LandingCSS from "../css/Landing.module.css";

const PILLARS = [
  {
    title: "Saját kutatás",
    text: "Az elemzések alapja a saját magunk által készített tanulmányok és számítások.",
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

function Landing() {
  const latest = analyses.slice(0, 3);

  return (
    <>
      <section className={LandingCSS.hero}>
        <div className="wrap">
          <div className={LandingCSS.eyebrow}>Elemzések · Tanulmányok</div>
          <h1>Ami kimarad a látómezőből.</h1>
          <p className={`lead ${LandingCSS.lead}`}>
            A Vakzóna elemzéseket közöl különböző témákban – saját megvalósíthatósági
            tanulmányokra, adatokra és átlátható módszertanra építve.
          </p>
          <div className={LandingCSS.actions}>
            <Link className="btn" to="/elemzesek">Elemzések böngészése</Link>
            <Link className="btn btnGhost" to="/rolunk">Hogyan dolgozunk?</Link>
          </div>
        </div>
      </section>

      <section className={LandingCSS.section}>
        <div className="wrap">
          <div className={LandingCSS.sectionHead}>
            <h2>Legfrissebb elemzések</h2>
            {latest.length > 0 && <Link to="/elemzesek">Összes elemzés →</Link>}
          </div>
          {latest.length > 0 ? (
            <div className={CardCSS.grid}>
              {latest.map((a) => (
                <AnalysisCard key={a.slug} analysis={a} />
              ))}
            </div>
          ) : (
            <p className={CardCSS.empty}>Az első elemzések hamarosan érkeznek.</p>
          )}
        </div>
      </section>

      <section className={`${LandingCSS.section} ${LandingCSS.bordered}`}>
        <div className="wrap">
          <h2 className={LandingCSS.flush}>Amire építünk</h2>
          <div className={LandingCSS.pillars}>
            {PILLARS.map(({ title, text }) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Landing;
