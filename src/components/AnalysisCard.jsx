import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Arrow from "./Arrow";
import Logo from "./Logo";
import CategoryArt from "./CategoryArt";
import { formatDate } from "../data/analyses";
import CardCSS from "../css/AnalysisCard.module.css";

const MotionLink = motion.create(Link);

// Az elemzés „borítója” (fénykép helyett): rácsminta, narancs fényudvar, a kategória ábrája
// és a kiemelt szám. Ha nincs kiemelt szám, a logó látszik.
function Cover({ analysis, big }) {
  return (
    <div className={`${CardCSS.cover} ${big ? CardCSS.coverBig : ""}`}>
      <div className={CardCSS.grid} />
      <div className={CardCSS.glow} />
      <CategoryArt slug={analysis.category.slug} className={CardCSS.art} />
      <div className={CardCSS.coverTop}>
        <span className={CardCSS.chip}>{analysis.category.name}</span>
        <span className={CardCSS.chip}>{analysis.readingMinutes} perc</span>
      </div>
      <div className={CardCSS.coverMain}>
        {analysis.highlight ? (
          <span className={CardCSS.number}>{analysis.highlight}</span>
        ) : (
          <span className={CardCSS.logo}><Logo size={big ? 120 : 64} /></span>
        )}
        {big && analysis.highlightText && <p className={CardCSS.highlightText}>{analysis.highlightText}</p>}
      </div>
    </div>
  );
}

function Stats({ stats, max }) {
  if (!stats.length) return null;
  return (
    <div className={CardCSS.stats}>
      {stats.slice(0, max).map((s) => (
        <div key={s.label} className={CardCSS.stat}>
          <span className={CardCSS.statValue}>{s.value}</span>
          <span className={CardCSS.statLabel}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// `featured` = széles kiemelt kártya, egyébként kis kártya.
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
        <Cover analysis={analysis} big />
        <div className={CardCSS.body}>
          <div>
            <div className={CardCSS.metaRow}>
              <span className="tag tagAccent">{analysis.topic}</span>
              <span className="meta">{formatDate(analysis.date)}</span>
              {draft}
            </div>
            <h3 className={CardCSS.featuredTitle}>{analysis.title}</h3>
            {analysis.subtitle && <p className={CardCSS.text}>{analysis.subtitle}</p>}
          </div>
          <div>
            <Stats stats={analysis.stats} max={3} />
            <span className={CardCSS.more}>
              Elolvasom <span className={CardCSS.moreIcon}><Arrow size={12} /></span>
            </span>
          </div>
        </div>
      </MotionLink>
    );
  }

  return (
    <MotionLink to={`/elemzesek/${analysis.slug}`} className={`${CardCSS.card} ${CardCSS.small}`} {...motionProps}>
      <Cover analysis={analysis} />
      <div className={CardCSS.body}>
        <span className="meta">
          {formatDate(analysis.date)} · {analysis.topic}
          {draft}
        </span>
        <h4 className={CardCSS.smallTitle}>{analysis.title}</h4>
        {analysis.subtitle && <p className={`${CardCSS.text} ${CardCSS.clamp}`}>{analysis.subtitle}</p>}
        <Stats stats={analysis.stats} max={2} />
        <span className={CardCSS.more}>
          Elolvasom <span className={CardCSS.moreIcon}><Arrow size={12} /></span>
        </span>
      </div>
    </MotionLink>
  );
}

export default AnalysisCard;
