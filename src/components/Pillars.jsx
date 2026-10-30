import React from "react";
import Reveal from "./Reveal";
import CSS from "../css/Pillars.module.css";

// „Amire építünk”: az elemzések négy alapelve (az Elemzések oldal alján).
const PILLARS = [
  {
    title: "Hivatalos források",
    text: "Csak ellenőrizhető, hivatalos forrásból dolgozunk – hazai, uniós és nemzetközi körben –, és minden forrást az eredeti helyére linkelünk.",
  },
  {
    title: "MI-eszközök, emberi kontrollal",
    text: "A források feldolgozásában és a szöveg előkészítésében mesterséges intelligenciát használunk. A forrásokat mi választjuk ki, és minden számot az eredeti forrással vetünk össze.",
  },
  {
    title: "Átlátható módszertan",
    text: "Minden elemzésnél leírjuk, milyen adatokból és feltételezésekből indultunk ki.",
  },
  {
    title: "Közérthető összefoglaló",
    text: "A lényeg néhány pontban, a részletek azoknak, akik mélyebbre ásnának.",
  },
];

function Pillars() {
  return (
    <section className={CSS.section}>
      <Reveal className={CSS.head}>
        <h2>Amire építünk</h2>
        <p className="lead">
          Minden elemzés ugyanarra a négy alapelvre épül, hogy a számok mögötti gondolatmenet
          is követhető legyen.
        </p>
      </Reveal>
      <div className={CSS.pillars}>
        {PILLARS.map(({ title, text }, i) => (
          <Reveal key={title} delay={i * 0.08} className={CSS.pillar}>
            <span className="eyebrow">0{i + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default Pillars;
