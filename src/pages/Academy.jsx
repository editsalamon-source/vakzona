import React from "react";
import { Link } from "react-router-dom";
import courses, { AKADEMIA, formatLength } from "../data/akademia";
import { readProgress } from "../utils/haladas";
import Arrow from "../components/Arrow";
import Reveal from "../components/Reveal";
import VideoPlayer from "../components/VideoPlayer";
import CSS from "../css/Academy.module.css";
import PageCSS from "../css/Page.module.css";

// A tanfolyam csempéje: bemutatóvideó (kattintásra indul), leírás, tananyag-adatok, haladás.
function CourseTile({ course }) {
  const done = readProgress(course);
  const total = course.lessons.length;
  return (
    <Reveal as="article" className={CSS.tile}>
      <VideoPlayer url={course.intro} subtitles={course.introSubtitles} title="Bemutató" poster category={course.category} />
      <div className={CSS.tileBody}>
        <div className={CSS.metaRow}>
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
        {done > 0 && (
          <div className={CSS.progress} aria-label={`Haladás: ${done} / ${total} lecke`}>
            <span className={CSS.bar}><span style={{ transform: `scaleX(${done / total})` }} /></span>
            <span className="meta">{done} / {total} lecke kész</span>
          </div>
        )}
        <Link to={`/akademia/${course.slug}`} className={`btn ${CSS.tileBtn}`}>
          {done > 0 ? "Folytatom" : "Részletek és belépés"} <Arrow size={12} />
        </Link>
      </div>
    </Reveal>
  );
}

function Academy() {
  return (
    <div className={`wrap ${PageCSS.page}`}>
      <Reveal className={PageCSS.centerHead}>
        <span className="tag">{AKADEMIA.menu}</span>
        <h1>{AKADEMIA.name}</h1>
        <p className="lead">{AKADEMIA.description}</p>
      </Reveal>

      {courses.length > 0 ? (
        <div className={CSS.tiles}>
          {courses.map((c) => (
            <CourseTile key={c.slug} course={c} />
          ))}
        </div>
      ) : (
        <p className={CSS.empty}>Az első tanfolyam hamarosan indul.</p>
      )}
    </div>
  );
}

export default Academy;
