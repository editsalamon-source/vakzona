import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { getAnalysis, formatDate } from "../data/analyses";
import NotFound from "./NotFound";
import ArticleCSS from "../css/Analysis.module.css";

function Analysis() {
  const { slug } = useParams();
  const analysis = useMemo(() => getAnalysis(slug), [slug]);

  if (!analysis) return <NotFound />;

  return (
    <article>
      <header className={ArticleCSS.head}>
        <div className="wrap read">
          <div className={`meta ${ArticleCSS.meta}`}>
            <Link to={`/elemzesek?tema=${analysis.topicSlug}`} className="tag">
              {analysis.topic}
            </Link>
            <span>{formatDate(analysis.date)}</span>
            <span>{analysis.readingMinutes} perc olvasás</span>
          </div>
          <h1>{analysis.title}</h1>
          {analysis.subtitle && <p className={`lead ${ArticleCSS.lead}`}>{analysis.subtitle}</p>}
        </div>
      </header>

      <div className={`wrap read ${ArticleCSS.article}`}>
        {analysis.toc.length > 2 && (
          <nav className={ArticleCSS.toc} aria-label="Tartalomjegyzék">
            <strong>Tartalom</strong>
            <ol>
              {analysis.toc.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`}>{h.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* a tartalom a saját, repóban lévő Markdown fájlokból jön */}
        <div className={ArticleCSS.body} dangerouslySetInnerHTML={{ __html: analysis.html }} />

        <p className={ArticleCSS.back}>
          <Link to="/elemzesek">← Vissza az elemzésekhez</Link>
        </p>
      </div>
    </article>
  );
}

export default Analysis;
