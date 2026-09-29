import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDate } from "../data/analyses";
import CardCSS from "../css/AnalysisCard.module.css";

const MotionLink = motion.create(Link);

// Csak transform-animáció (opacity-áttűnés Chrome-ban fehéren villanhat).
function AnalysisCard({ analysis }) {
  return (
    <MotionLink
      to={`/elemzesek/${analysis.slug}`}
      className={CardCSS.card}
      initial={{ y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <span>
        <span className="tag">{analysis.topic}</span>
        {analysis.draft && <span className={CardCSS.draft}>Piszkozat</span>}
      </span>
      <h3>{analysis.title}</h3>
      {analysis.subtitle && <p>{analysis.subtitle}</p>}
      <div className={`meta ${CardCSS.meta}`}>
        {formatDate(analysis.date)} · {analysis.readingMinutes} perc olvasás
      </div>
    </MotionLink>
  );
}

export default AnalysisCard;
