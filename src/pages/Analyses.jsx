import React from "react";
import analyses, { getCategories } from "../data/analyses";
import AnalysisCard from "../components/AnalysisCard";
import Pillars from "../components/Pillars";
import ListHead from "../components/ListHead";
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
    <div className={`wrap ${PageCSS.page} ${PageCSS.listPage}`}>
      <ListHead
        label="Kategóriák"
        links={[
          { to: "/elemzesek", label: "Összes", count: analyses.length, current: !category },
          ...categories.map((k) => ({ to: `/${k.slug}`, label: k.name, count: k.count, current: category?.slug === k.slug })),
        ]}
        eyebrow={category ? "Elemzések · kategória" : "Elemzések"}
        title={category ? category.name : "Minden elemzés"}
        lead={
          category
            ? category.description
            : "Független, hivatalos forrásokra és nyilvános adatokra épülő elemzések, a legfrissebbel kezdve."
        }
        art={category?.slug}
        stat={inCategory.length ? { value: inCategory.length, label: "elemzés" } : { value: "–", label: "hamarosan" }}
      />
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
