import React from "react";
import { Link } from "react-router-dom";
import analyses, { getCategories } from "../data/analyses";
import AnalysisCard from "../components/AnalysisCard";
import Pillars from "../components/Pillars";
import Reveal from "../components/Reveal";
import TagFilter, { useTagFilter } from "../components/TagFilter";
import CardCSS from "../css/AnalysisCard.module.css";
import PageCSS from "../css/Page.module.css";

// Az összes elemzés (/elemzesek), vagy egy kategória saját oldala (/gazdasag stb.).
function Analyses({ category = null }) {
  const categories = getCategories();
  const inCategory = category ? analyses.filter((a) => a.category.slug === category.slug) : analyses;
  // témacímke-szűrő (?cimke=…): csak ahol a tartalmaknak van címkéje, pl. az MI-oldalon
  const { selected, shown } = useTagFilter(inCategory);

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
      <TagFilter items={inCategory} selected={selected} />

      {shown.length > 0 ? (
        <div className={CardCSS.list}>
          {shown.map((a, i) => (
            <AnalysisCard key={a.slug} analysis={a} featured={i === 0 && !selected} />
          ))}
        </div>
      ) : (
        <p className={CardCSS.empty}>
          {selected
            ? "Ehhez a témához ebben a kategóriában még nincs elemzés."
            : category
            ? "Ebben a kategóriában hamarosan érkeznek az első elemzések."
            : "Az első elemzések hamarosan érkeznek."}
        </p>
      )}

      {!category && <Pillars />}
    </div>
  );
}

export default Analyses;
