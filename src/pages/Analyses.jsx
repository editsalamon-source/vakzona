import React from "react";
import { Link } from "react-router-dom";
import analyses, { getCategories } from "../data/analyses";
import AnalysisCard from "../components/AnalysisCard";
import Reveal from "../components/Reveal";
import CardCSS from "../css/AnalysisCard.module.css";
import PageCSS from "../css/Page.module.css";

// Az összes elemzés (/elemzesek), vagy egy kategória saját oldala (/gazdasag stb.).
function Analyses({ category = null }) {
  const categories = getCategories();
  const shown = category ? analyses.filter((a) => a.category.slug === category.slug) : analyses;

  return (
    <div className={`wrap ${PageCSS.page}`}>
      <Reveal className={PageCSS.centerHead}>
        <span className="tag">{category ? "Kategória" : "Elemzések"}</span>
        <h1>{category ? category.name : "Minden elemzés"}</h1>
        <p className="lead">
          {category
            ? category.description
            : "Független, hivatalos forrásokra és nyilvános adatokra épülő elemzések, a legfrissebbel kezdve."}
        </p>
      </Reveal>

      <nav className={PageCSS.filters} aria-label="Kategóriák">
        <Link to="/elemzesek" aria-current={category ? undefined : "page"}>
          Összes
        </Link>
        {categories.map((k) => (
          <Link key={k.slug} to={`/${k.slug}`} aria-current={category?.slug === k.slug ? "page" : undefined}>
            {k.name}
            {k.count > 0 && <span className={PageCSS.count}>{k.count}</span>}
          </Link>
        ))}
      </nav>

      {shown.length > 0 ? (
        <div className={CardCSS.list}>
          {shown.map((a, i) => (
            <AnalysisCard key={a.slug} analysis={a} featured={i === 0} />
          ))}
        </div>
      ) : (
        <p className={CardCSS.empty}>
          {category
            ? "Ebben a kategóriában hamarosan érkeznek az első elemzések."
            : "Az első elemzések hamarosan érkeznek."}
        </p>
      )}
    </div>
  );
}

export default Analyses;
