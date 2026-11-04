import React from "react";
import CSS from "../css/CourseNotice.module.css";

// Tudnivalók a tanfolyamokról: nem akkreditált képzés, nem szakmai tanácsadás, MI-támogatással készült.
// Az Akadémia oldalán, a tanfolyam belépő oldalán és a tanfolyamon belül „A tanfolyamról” alatt.
const NOTICES = [
  {
    title: "Nem akkreditált képzés",
    text: "A tanfolyamok nem akkreditált képzések, hivatalos képesítést nem adnak. Az oklevél a leckék megtekintését igazolja, nem állami vagy szakmai elismerésű bizonyítvány. Amit átadnak, az a munkában közvetlenül használható, fontos tudás.",
  },
  {
    title: "Nem szakmai tanácsadás",
    text: "A tananyagot nem jogász, ügyvéd vagy hivatalos szakértő állította össze. A jogi, adatvédelmi és szabályozási részek tájékoztató jellegűek, egy konkrét ügyben nem helyettesítik a szakember tanácsát.",
  },
  {
    title: "MI-támogatással készült",
    text: "A videók mesterséges intelligencia segítségével készültek, és ez néha hallatszik a kiejtésen: egy-egy szó, rövidítés vagy idegen kifejezés hangsúlya szokatlan lehet.",
  },
];

function CourseNotice({ compact = false, title = "Tudnivalók a tanfolyamokról" }) {
  return (
    <section className={`${CSS.notice} ${compact ? CSS.compact : ""}`} aria-labelledby="tanfolyamTudnivalok">
      <h2 id="tanfolyamTudnivalok" className={CSS.title}>
        <span className={CSS.icon} aria-hidden="true">i</span>
        {title}
      </h2>
      <ul className={CSS.list}>
        {NOTICES.map((n) => (
          <li key={n.title}>
            <strong>{n.title}</strong>
            <p>{n.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CourseNotice;
