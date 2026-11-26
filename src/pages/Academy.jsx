import React, { useState } from "react";
import courses, { AKADEMIA, formatLength, getAcademyCategories } from "../data/akademia";
import CourseTile from "../components/CourseTile";
import CourseCard from "../components/CourseCard";
import ListHead from "../components/ListHead";
import CourseNotice from "../components/CourseNotice";
import TagFilter, { useTagFilter } from "../components/TagFilter";
import CSS from "../css/Academy.module.css";
import PageCSS from "../css/Page.module.css";

// Az összes tanfolyam (/akademia), vagy egy témakör saját oldala (/akademia/mi, /akademia/tudomany),
// felül témakörgombokkal, alatta témacímke-szűrővel.
const VIEW_KEY = "vz-akademia-nezet";
const readView = () => {
  try { return localStorage.getItem(VIEW_KEY) === "reszletes" ? "reszletes" : "kartyak"; } catch { return "kartyak"; }
};

const GridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </svg>
);
const LargeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="10" rx="1.5" /><path d="M3.5 17.5h17M3.5 20.5h11" strokeLinecap="round" />
  </svg>
);

// Nézetváltó: kompakt kártyák (Udemy-mintára) vagy a részletes, nagy csempék. A választás a böngészőben marad.
function ViewSwitch({ view, onChange }) {
  return (
    <div className={CSS.viewSwitch} role="group" aria-label="Nézet">
      <button type="button" aria-pressed={view === "kartyak"} onClick={() => onChange("kartyak")} title="Kártyák">
        <GridIcon /><span>Kártyák</span>
      </button>
      <button type="button" aria-pressed={view === "reszletes"} onClick={() => onChange("reszletes")} title="Részletes">
        <LargeIcon /><span>Részletes</span>
      </button>
    </div>
  );
}

function Academy({ category = null }) {
  const [view, setViewState] = useState(readView);
  const setView = (v) => {
    setViewState(v);
    try { localStorage.setItem(VIEW_KEY, v); } catch { /* nincs tárhely */ }
  };
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
        <>
          <div className={CSS.viewBar}>
            <span className="meta">{shown.length} tanfolyam</span>
            <ViewSwitch view={view} onChange={setView} />
          </div>
          {view === "kartyak" ? (
            <div className={CSS.cards}>
              {shown.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          ) : (
            <div className={CSS.tiles}>
              {shown.map((c) => (
                <CourseTile key={c.slug} course={c} />
              ))}
            </div>
          )}
        </>
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
