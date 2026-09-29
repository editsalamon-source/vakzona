import React from "react";
import { useSearchParams } from "react-router-dom";
import analyses, { getTopics } from "../data/analyses";
import AnalysisCard from "../components/AnalysisCard";
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
      <h1>Elemzések</h1>

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
        <div className={CardCSS.grid}>
          {shown.map((a) => (
            <AnalysisCard key={a.slug} analysis={a} />
          ))}
        </div>
      ) : (
        <p className={CardCSS.empty}>Az első elemzések hamarosan érkeznek.</p>
      )}
    </div>
  );
}

export default Analyses;
