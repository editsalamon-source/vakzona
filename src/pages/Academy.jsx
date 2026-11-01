import React from "react";
import { Link } from "react-router-dom";
import courses, { AKADEMIA, getAcademyCategories } from "../data/akademia";
import CourseTile from "../components/CourseTile";
import Reveal from "../components/Reveal";
import TagFilter, { useTagFilter } from "../components/TagFilter";
import CSS from "../css/Academy.module.css";
import PageCSS from "../css/Page.module.css";

// Az összes tanfolyam (/akademia), vagy egy témakör saját oldala (/akademia/mi, /akademia/tudomany),
// felül témakörgombokkal, alatta témacímke-szűrővel.
function Academy({ category = null }) {
  const categories = getAcademyCategories();
  const inCategory = category ? courses.filter((c) => c.category?.slug === category.slug) : courses;
  const { selected, shown } = useTagFilter(inCategory);
  const lead = category ? categories.find((k) => k.slug === category.slug)?.lead : AKADEMIA.description;

  return (
    <div className={`wrap ${PageCSS.page}`}>
      <Reveal className={PageCSS.centerHead}>
        <span className="tag">{AKADEMIA.menu}</span>
        <h1>{category ? category.name : AKADEMIA.name}</h1>
        <p className="lead">{lead}</p>
      </Reveal>

      <nav className={PageCSS.filters} aria-label="Témakörök">
        <Link to="/akademia" aria-current={category ? undefined : "page"}>
          Összes
        </Link>
        {categories.map((k) => (
          <Link key={k.slug} to={`/akademia/${k.slug}`} aria-current={category?.slug === k.slug ? "page" : undefined}>
            {k.name}
            {k.count > 0 && <span className={PageCSS.count}>{k.count}</span>}
          </Link>
        ))}
      </nav>
      <TagFilter items={inCategory} selected={selected} />

      {shown.length > 0 ? (
        <div className={CSS.tiles}>
          {shown.map((c) => (
            <CourseTile key={c.slug} course={c} />
          ))}
        </div>
      ) : (
        <p className={CSS.empty}>
          {selected
            ? "Ehhez a témához ebben a körben még nincs tanfolyam."
            : category
              ? "Ebben a témakörben hamarosan indul az első tanfolyam."
              : "Az első tanfolyam hamarosan indul."}
        </p>
      )}
    </div>
  );
}

export default Academy;
