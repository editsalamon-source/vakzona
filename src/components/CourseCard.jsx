import React from "react";
import { Link } from "react-router-dom";
import { formatLength } from "../data/akademia";
import { readProgress } from "../utils/haladas";
import CoverArt from "./CoverArt";
import FreeBadge from "./FreeBadge";
import CSS from "../css/Academy.module.css";

// Kompakt tanfolyamkártya (Udemy-mintára): kis borító, cím, alcím, adatok, haladás. Az egész kártya link.
function CourseCard({ course }) {
  const done = readProgress(course);
  const total = course.lessons.length;
  return (
    <article className={CSS.card}>
      <Link to={`/akademia/${course.slug}`} className={CSS.cardLink}>
        <span className={CSS.thumb}>
          <span className={CSS.thumbGrid} />
          <CoverArt motif={course.cover} category={course.category?.slug} className={CSS.thumbArt} />
          {course.logo && <img src={course.logo} alt="" className={CSS.thumbLogo} />}
        </span>
        <span className={CSS.cardBody}>
          <span className={CSS.cardTitle}>{course.title}</span>
          {course.subtitle && <span className={CSS.cardText}>{course.subtitle}</span>}
          <span className={CSS.cardMeta}>
            {total} lecke{course.seconds > 0 && ` · ${formatLength(course.seconds)}`}
            {course.level && ` · ${course.level}`}
          </span>
          <span className={CSS.cardBadges}>
            {course.free && <FreeBadge text="Szabad" />}
            {course.category && <span className="tag tagAccent">{course.category.name}</span>}
            {course.draft && <span className={CSS.draft}>Piszkozat</span>}
          </span>
          {done > 0 && (
            <span className={CSS.cardProgress} aria-label={`Haladás: ${done} / ${total} lecke`}>
              <span className={CSS.bar}><span style={{ transform: `scaleX(${done / total})` }} /></span>
              <span className="meta">{done === total ? "Kész" : `${Math.round((done / total) * 100)}%`}</span>
            </span>
          )}
        </span>
      </Link>
    </article>
  );
}

export default CourseCard;
