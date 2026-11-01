import React from "react";
import { useSearchParams } from "react-router-dom";
import { cimkekDarabbal, getCimke } from "../data/cimkek";
import PageCSS from "../css/Page.module.css";

// A kiválasztott témacímke az URL-ben (?cimke=jog), így a szűrt nézet linkelhető és megosztható.
export function useTagFilter(items) {
  const [params] = useSearchParams();
  const selected = getCimke(params.get("cimke") || "");
  const shown = selected ? items.filter((i) => i.tags?.some((t) => t.slug === selected.slug)) : items;
  return { selected, shown };
}

// Témacímke-szűrő: csak a listában ténylegesen előforduló címkék, darabszámmal. Ha egy sincs, nem jelenik meg.
function TagFilter({ items, selected }) {
  const [params, setParams] = useSearchParams();
  const tags = cimkekDarabbal(items);
  if (!tags.length) return null;

  const pick = (slug) => {
    const next = new URLSearchParams(params);
    if (slug) next.set("cimke", slug);
    else next.delete("cimke");
    setParams(next, { replace: true, preventScrollReset: true });
  };

  return (
    <nav className={`${PageCSS.filters} ${PageCSS.tagFilters}`} aria-label="Témák">
      <button type="button" aria-pressed={!selected} onClick={() => pick(null)}>
        Minden téma
      </button>
      {tags.map((t) => (
        <button key={t.slug} type="button" aria-pressed={selected?.slug === t.slug} title={t.description}
          onClick={() => pick(selected?.slug === t.slug ? null : t.slug)}>
          {t.name}
          <span className={PageCSS.count}>{t.count}</span>
        </button>
      ))}
    </nav>
  );
}

export default TagFilter;
