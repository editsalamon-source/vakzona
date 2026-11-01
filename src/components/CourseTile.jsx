import React from "react";
import { Link } from "react-router-dom";
import { formatLength } from "../data/akademia";
import { readProgress } from "../utils/haladas";
import Arrow from "./Arrow";
import Reveal from "./Reveal";
import VideoPlayer from "./VideoPlayer";
import FreeBadge from "./FreeBadge";
import CSS from "../css/Academy.module.css";

// A tanfolyam csempéje: bemutatóvideó (kattintásra indul), leírás, tananyag-adatok, haladás.
function CourseTile({ course }) {
  const done = readProgress(course);
  const total = course.lessons.length;
  return (
    <Reveal as="article" className={CSS.tile}>
      <VideoPlayer url={course.intro} subtitles={course.introSubtitles} title="Bemutató" poster category={course.category}
        cover={course.cover} badge={{ src: course.logo, text: course.logoText }} />
      <div className={CSS.tileBody}>
        <div className={CSS.metaRow}>
          {course.free && <FreeBadge />}
          {course.category && <span className="tag tagAccent">{course.category.name}</span>}
          {course.level && <span className="meta">{course.level}</span>}
          <span className="meta">
            {total} lecke{course.seconds > 0 && ` · ${formatLength(course.seconds)}`}
          </span>
          {course.draft && <span className={CSS.draft}>Piszkozat</span>}
        </div>
        <h2 className={CSS.tileTitle}>
          <Link to={`/akademia/${course.slug}`}>{course.title}</Link>
        </h2>
        {course.subtitle && <p className={CSS.tileText}>{course.subtitle}</p>}
        {course.tags.length > 0 && (
          <div className={CSS.tags} aria-label="Témák">
            {course.tags.map((t) => (
              <Link key={t.slug} to={`/akademia${course.category ? `/${course.category.slug}` : ""}?cimke=${t.slug}`} title={t.description}>
                {t.name}
              </Link>
            ))}
          </div>
        )}
        {done > 0 && (
          <div className={CSS.progress} aria-label={`Haladás: ${done} / ${total} lecke`}>
            <span className={CSS.bar}><span style={{ transform: `scaleX(${done / total})` }} /></span>
            <span className="meta">{done} / {total} lecke kész</span>
          </div>
        )}
        <Link to={`/akademia/${course.slug}`} className={`btn ${CSS.tileBtn}`}>
          {done > 0 ? "Folytatom" : course.free ? "Megnézem" : "Részletek és belépés"} <Arrow size={12} />
        </Link>
      </div>
    </Reveal>
  );
}

export default CourseTile;
