import React from "react";
import courses, { AKADEMIA } from "../data/akademia";
import CourseTile from "../components/CourseTile";
import Reveal from "../components/Reveal";
import CSS from "../css/Academy.module.css";
import PageCSS from "../css/Page.module.css";

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
