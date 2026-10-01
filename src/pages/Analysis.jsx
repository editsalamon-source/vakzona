import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getAnalysis, formatDate } from "../data/analyses";
import Arrow from "../components/Arrow";
import NotFound from "./NotFound";
import ArticleCSS from "../css/Analysis.module.css";

const rise = (delay = 0) => ({
  initial: { y: 40 },
  animate: { y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
});

function Analysis() {
  const { slug } = useParams();
  const analysis = useMemo(() => getAnalysis(slug), [slug]);

  if (!analysis) return <NotFound />;

  // a kezdő idézetblokk (összefoglaló) külön dobozba kerül a tartalomjegyzék elé
  const lead = analysis.html.match(/^\s*<blockquote>[\s\S]*?<\/blockquote>\s*/);
  const summaryHtml = lead ? lead[0] : "";
  const bodyHtml = analysis.html.slice(summaryHtml.length);
  const hasToc = analysis.toc.length > 2;

  return (
    <article>
      <header className={ArticleCSS.head}>
        <div className={ArticleCSS.headGrid} />
        <div className={`wrap ${ArticleCSS.headInner}`}>
          <motion.div {...rise()}>
            <div className={ArticleCSS.meta}>
              {analysis.category.slug ? (
                <Link to={`/${analysis.category.slug}`} className="tag tagAccent">
                  {analysis.category.name}
                </Link>
              ) : (
                <span className="tag tagAccent">{analysis.category.name}</span>
              )}
              <span className="meta">{analysis.topic}</span>
              <span className="meta">{formatDate(analysis.date)}</span>
              <span className="meta">{analysis.readingMinutes} perc olvasás</span>
            </div>
            <h1 className={ArticleCSS.title}>{analysis.title}</h1>
            {analysis.subtitle && <p className={`lead ${ArticleCSS.lead}`}>{analysis.subtitle}</p>}
          </motion.div>
          {analysis.stats.length > 0 && (
            <motion.div className={ArticleCSS.stats} {...rise(0.15)}>
              {analysis.stats.map((s) => (
                <div key={s.label}>
                  <div className={ArticleCSS.statValue}>{s.value}</div>
                  <p className={ArticleCSS.statLabel}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </header>

      <div className={`wrap ${ArticleCSS.layout} ${hasToc ? "" : ArticleCSS.noToc}`}>
        {hasToc && (
          <aside className={ArticleCSS.aside}>
            <nav className={ArticleCSS.toc} aria-label="Tartalomjegyzék">
              <span className={ArticleCSS.tocLabel}>Tartalom</span>
              <ol>
                {analysis.toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        )}

        <div className={ArticleCSS.main}>
          {summaryHtml && (
            <div
              className={`${ArticleCSS.body} ${ArticleCSS.summary}`}
              dangerouslySetInnerHTML={{ __html: summaryHtml }}
            />
          )}
          {/* a tartalom a saját, repóban lévő Markdown fájlokból jön */}
          <div className={ArticleCSS.body} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        </div>
      </div>

      <section className={ArticleCSS.next}>
        <div className={`wrap ${ArticleCSS.nextInner}`}>
          <h2>További elemzések</h2>
          <div className={ArticleCSS.nextActions}>
            {analysis.category.slug && (
              <Link to={`/${analysis.category.slug}`} className="btn btnGhost">
                {analysis.category.name}
              </Link>
            )}
            <Link to="/elemzesek" className="btn">
              Összes elemzés <Arrow size={12} />
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

export default Analysis;
