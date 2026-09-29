import React from "react";
import { useSearchParams } from "react-router-dom";
import analyses, { getTopics } from "../data/analyses";
import AnalysisCard from "../components/AnalysisCard";
import Reveal from "../components/Reveal";
import CardCSS from "../css/AnalysisCard.module.css";
import PageCSS from "../css/Page.module.css";

function Analyses() {
  const topics = getTopics();
  // a kiválasztott téma az URL-ben marad (?tema=…), így linkelhető
  const [params, setParams] = useSearchParams();
  const current = params.get("tema") || "";
  const shown = current ? analyses.filter((a) => a.topicSlug === current) : analyses;

  const choose = (slug) => setParams(slug ? { tema: slug } : {}, { replace: true });

  return (
    <div className={`wrap ${PageCSS.page}`}>
      <Reveal className={PageCSS.centerHead}>
        <span className="tag">Elemzések</span>
        <h1>Minden elemzés</h1>
        <p className="lead">
          Saját megvalósíthatósági tanulmányokra és nyilvános adatokra épülő elemzések, a
          legfrissebbel kezdve.
        </p>
      </Reveal>

      {topics.length > 1 && (
        <div className={PageCSS.filters} role="group" aria-label="Téma szűrő">
          <button type="button" aria-pressed={!current} onClick={() => choose("")}>
            Összes
          </button>
          {topics.map((t) => (
            <button
              key={t.slug}
              type="button"
              aria-pressed={current === t.slug}
              onClick={() => choose(t.slug)}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {shown.length > 0 ? (
        <div className={CardCSS.list}>
          {shown.map((a, i) => (
            <AnalysisCard key={a.slug} analysis={a} featured={i === 0} />
          ))}
        </div>
      ) : (
        <p className={CardCSS.empty}>Az első elemzések hamarosan érkeznek.</p>
      )}
    </div>
  );
}

export default Analyses;
