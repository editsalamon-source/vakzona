import React from "react";
import courses, { AKADEMIA, formatLength, getAcademyCategories } from "../data/akademia";
import CourseTile from "../components/CourseTile";
import ListHead from "../components/ListHead";
import CourseNotice from "../components/CourseNotice";
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
  const lessons = inCategory.reduce((n, c) => n + c.lessons.length, 0);
  const seconds = inCategory.reduce((n, c) => n + c.seconds, 0);

  return (
    <div className={`wrap ${PageCSS.page} ${PageCSS.listPage}`}>
      <ListHead
        label="Témakörök"
        links={[
          { to: "/akademia", label: "Összes", count: courses.length, current: !category },
          ...categories.map((k) => ({ to: `/akademia/${k.slug}`, label: k.name, count: k.count, current: category?.slug === k.slug })),
        ]}
        eyebrow={category ? `${AKADEMIA.name} · témakör` : AKADEMIA.menu}
        title={category ? category.name : AKADEMIA.name}
        lead={lead}
        art={category?.slug}
        stat={
          inCategory.length
            ? { value: inCategory.length, label: "tanfolyam", note: `${lessons} lecke · ${formatLength(seconds)}` }
            : { value: "–", label: "hamarosan" }
        }
      />
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

      <CourseNotice />
    </div>
  );
}

export default Academy;
