import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Arrow from "./Arrow";
import Logo from "./Logo";
import { formatDate } from "../data/analyses";
import CardCSS from "../css/AnalysisCard.module.css";

const MotionLink = motion.create(Link);

// Az elemzés „képe”: rácsmintán a kiemelt szám (fénykép helyett).
function Visual({ analysis, big }) {
  return (
    <div className={`${CardCSS.visual} ${big ? CardCSS.visualBig : ""}`}>
      <div className={CardCSS.grid} />
      {analysis.highlight ? (
        <span className={CardCSS.number}>{analysis.highlight}</span>
      ) : (
        <span className={CardCSS.logo}><Logo size={big ? 120 : 64} /></span>
      )}
    </div>
  );
}

// Kártya a hírszoba-mintára: `featured` = széles kiemelt kártya, egyébként kis kártya.
// Csak transform-animáció (opacity-áttűnés Chrome-ban fehéren villanhat).
function AnalysisCard({ analysis, featured = false }) {
  const motionProps = {
    initial: { y: 40 },
    whileInView: { y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  };
  const draft = analysis.draft && <span className={CardCSS.draft}>Piszkozat</span>;

  if (featured) {
    return (
      <MotionLink
        to={`/elemzesek/${analysis.slug}`}
        className={`${CardCSS.card} ${CardCSS.featured}`}
        {...motionProps}
      >
        <Visual analysis={analysis} big />
        <div className={CardCSS.body}>
          <div>
            <div className={CardCSS.metaRow}>
              <span className="tag tagAccent">{analysis.category.name}</span>
              <span className="meta">{analysis.topic}</span>
              <span className="meta">{formatDate(analysis.date)}</span>
              {draft}
            </div>
            <h3 className={CardCSS.featuredTitle}>{analysis.title}</h3>
            {analysis.subtitle && <p className={CardCSS.text}>{analysis.subtitle}</p>}
          </div>
          <span className={CardCSS.more}>
            Elolvasom <Arrow size={12} />
          </span>
        </div>
      </MotionLink>
    );
  }

  return (
    <MotionLink to={`/elemzesek/${analysis.slug}`} className={`${CardCSS.card} ${CardCSS.small}`} {...motionProps}>
      <Visual analysis={analysis} />
      <div className={CardCSS.body}>
        <span className="meta">
          {formatDate(analysis.date)} · {analysis.readingMinutes} perc
        </span>
        <h4 className={CardCSS.smallTitle}>{analysis.title}</h4>
        <span className={CardCSS.topic}>
          {analysis.category.name} · {analysis.topic} <Arrow size={11} />
          {draft}
        </span>
      </div>
    </MotionLink>
  );
}

export default AnalysisCard;
