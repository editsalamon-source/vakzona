import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Marked } from "marked";
import { getCourse, AKADEMIA, formatLength } from "../data/akademia";
import { useCourseContent } from "../utils/tanfolyam";
import { useProgress } from "../utils/haladas";
import Arrow from "../components/Arrow";
import VideoPlayer from "../components/VideoPlayer";
import NotFound from "./NotFound";
import CSS from "../css/Course.module.css";
import FormCSS from "../css/ProtectedPdf.module.css";
import ArticleCSS from "../css/Analysis.module.css";

function LockIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function CheckIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function DownloadIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M12 11v6M9 14l3 3 3-3" />
    </svg>
  );
}

const lessonCount = (course) =>
  `${course.lessons.length} lecke${course.seconds > 0 ? ` · ${formatLength(course.seconds)}` : ""}`;

function Meta({ course, count = true }) {
  return (
    <div className={CSS.meta}>
      <Link to="/akademia" className="tag">{AKADEMIA.menu}</Link>
      {course.category && <span className="tag tagAccent">{course.category.name}</span>}
      {course.level && <span className="meta">{course.level}</span>}
      {count && <span className="meta">{lessonCount(course)}</span>}
    </div>
  );
}

// ---------- Belépés előtt: cím, rövid bevezető, bemutató és jelszó (a részletes leírás és a tananyag belépés után) ----------

function PasswordForm({ access }) {
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(0);
  const busy = access.status === "busy";
  useEffect(() => {
    if (access.status === "wrong") setShake((n) => n + 1);
  }, [access.status]);

  return (
    <form
      key={shake}
      className={`${CSS.login} ${shake ? FormCSS.shake : ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        access.unlock(password);
      }}
    >
      <span className={CSS.loginHead}>
        <span className={CSS.loginIcon}><LockIcon size={18} /></span>
        A tanfolyam jelszóval nyílik
      </span>
      <label className={FormCSS.label} htmlFor="tanfolyamJelszo">Jelszó</label>
      <div className={CSS.loginRow}>
        <input
          id="tanfolyamJelszo"
          type="password"
          autoComplete="current-password"
          className={`${FormCSS.input} ${CSS.loginInput}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={busy}
        />
        <button type="submit" className="btn" disabled={busy || !password.trim()}>
          {busy ? "Belépés…" : "Belépés"} <Arrow size={12} />
        </button>
      </div>
      {access.status === "wrong" && <p className={FormCSS.error}>Hibás jelszó.</p>}
      {access.status === "error" && (
        <p className={FormCSS.error}>{access.message || "Hiba történt, kérjük, próbálja újra."}</p>
      )}
    </form>
  );
}

function Curriculum({ course, progress = null, current = null, onPick = null }) {
  return (
    <div className={CSS.modules}>
      {course.modules.map((m, mi) => (
        <section key={mi} className={CSS.module}>
          {m.title && (
            <h3 className={CSS.moduleTitle}>
              <span>{m.title}</span>
              {progress && (
                <span className={CSS.moduleCount}>
                  {m.lessons.filter((l) => progress.isDone(l.id)).length}/{m.lessons.length}
                </span>
              )}
            </h3>
          )}
          <ol className={CSS.lessons}>
            {m.lessons.map((l) => {
              const done = progress?.isDone(l.id);
              return (
                <li key={l.id} className={`${CSS.lesson} ${current === l.id ? CSS.current : ""} ${done ? CSS.done : ""}`}>
                  {progress ? (
                    <button
                      type="button"
                      className={CSS.check}
                      aria-pressed={done}
                      aria-label={done ? `${l.title}: megnézve (visszavonás)` : `${l.title}: megjelölés megnézettként`}
                      onClick={() => progress.setDone(l.id, !done)}
                    >
                      {done && <CheckIcon />}
                    </button>
                  ) : (
                    <span className={CSS.lockMark}><LockIcon size={13} /></span>
                  )}
                  {onPick ? (
                    <button type="button" className={CSS.lessonBtn} onClick={() => onPick(l.id)}
                      aria-current={current === l.id ? "true" : undefined}>
                      <span>{l.title}</span>
                      {l.length && <span className={CSS.length}>{l.length}</span>}
                    </button>
                  ) : (
                    <span className={CSS.lessonBtn}>
                      <span>{l.title}</span>
                      {l.length && <span className={CSS.length}>{l.length}</span>}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}

// Felül a cím teljes szélességben; alatta bal oldalt a bemutató és a bevezető, jobb oldalt
// (széles képernyőn ragadósan) a tanfolyam adatai és a belépés.
function CourseLanding({ course, access }) {
  const facts = [
    { value: course.lessons.length, label: "videólecke" },
    course.seconds > 0 && { value: formatLength(course.seconds), label: "videó összesen" },
    course.modules.length > 1 && { value: course.modules.length, label: "rész" },
  ].filter(Boolean);

  return (
    <div className={`wrap ${CSS.page}`}>
      <header className={CSS.heroHead}>
        <Meta course={course} count={false} />
        <h1 className={CSS.title}>{course.title}</h1>
        {course.subtitle && <p className="lead">{course.subtitle}</p>}
      </header>
      <div className={CSS.hero}>
        <div className={CSS.heroMain}>
          <VideoPlayer url={course.intro} subtitles={course.introSubtitles} title="Bemutató" poster category={course.category} />
          {course.introHtml && <div className={CSS.intro} dangerouslySetInnerHTML={{ __html: course.introHtml }} />}
        </div>
        <aside className={CSS.heroSide}>
          <dl className={CSS.facts}>
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          {access.status === "checking" ? <div className={CSS.loginPlaceholder} /> : <PasswordForm access={access} />}
        </aside>
      </div>
    </div>
  );
}

// ---------- Belépés után: videónéző, leckelista, anyagok, oklevél ----------

const marked = new Marked();

function Downloads({ items, access }) {
  const [state, setState] = useState({});
  if (!items?.length) return null;

  async function get(file) {
    setState((s) => ({ ...s, [file]: "busy" }));
    try {
      await access.download(file);
      setState((s) => ({ ...s, [file]: "" }));
    } catch (e) {
      setState((s) => ({ ...s, [file]: "error" }));
    }
  }

  return (
    <div className={CSS.downloads}>
      <h3 className={CSS.blockTitle}>Letölthető anyagok</h3>
      <ul>
        {items.map((item) => {
          const external = /^https?:\/\//.test(item.fajl);
          const inner = (
            <>
              <span className={CSS.dlIcon}><DownloadIcon /></span>
              <span className={CSS.dlText}>
                <strong>{item.felirat || item.fajl}</strong>
                <span className="meta">
                  {state[item.fajl] === "busy" ? "Letöltés…" : state[item.fajl] === "error" ? "Nem sikerült, próbálja újra." : external ? "Külső hivatkozás" : item.fajl}
                </span>
              </span>
            </>
          );
          return (
            <li key={item.fajl}>
              {external ? (
                <a className={CSS.dl} href={item.fajl} target="_blank" rel="noopener">{inner}</a>
              ) : (
                <button type="button" className={CSS.dl} onClick={() => get(item.fajl)} disabled={state[item.fajl] === "busy"}>
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Classroom({ course, access }) {
  const progress = useProgress(course);
  const [params, setParams] = useSearchParams();
  const picked = useRef(false);
  const ids = course.lessons.map((l) => l.id);
  const firstOpen = course.lessons.find((l) => !progress.isDone(l.id))?.id;
  const requested = params.get("lecke");
  const currentId = ids.includes(requested) ? requested : ids.includes(progress.last) ? progress.last : firstOpen || ids[0];
  const index = ids.indexOf(currentId);
  const lesson = course.lessons[index];
  const data = access.content.leckek?.[currentId] || {};
  const html = useMemo(() => (data.leiras ? marked.parse(data.leiras) : ""), [data.leiras]);
  const done = progress.isDone(currentId);
  const [subtitles, setSubtitles] = useState(null);

  // a lecke titkosított feliratának visszafejtése (ha van)
  useEffect(() => {
    let url = null;
    let live = true;
    setSubtitles(null);
    if (data.felirat) {
      access
        .subtitle(data.felirat)
        .then((u) => (live ? setSubtitles((url = u)) : URL.revokeObjectURL(u)))
        .catch(() => {});
    }
    return () => {
      live = false;
      if (url) URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.felirat]);

  useEffect(() => {
    if (currentId && progress.last !== currentId) progress.setLast(currentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  function pick(id) {
    picked.current = true;
    setParams({ lecke: id }, { replace: true });
    if (window.matchMedia("(max-width: 960px)").matches) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!lesson) return <CourseLanding course={course} access={access} />;
  const prev = course.lessons[index - 1];
  const next = course.lessons[index + 1];
  const module = course.modules.find((m) => m.lessons.includes(lesson));

  return (
    <div className={`wrap ${CSS.page} ${CSS.classroom}`}>
      <div className={CSS.bar}>
        <div>
          <Meta course={course} />
          <h1 className={CSS.classTitle}>{course.title}</h1>
        </div>
        <button type="button" className="btn btnGhost" onClick={access.lock}>Kilépés</button>
      </div>

      <div className={CSS.room}>
        <div className={CSS.stage}>
          <VideoPlayer
            key={currentId}
            url={data.video}
            title={lesson.title}
            autoplay={picked.current}
            subtitles={subtitles}
            onEnded={() => progress.setDone(currentId)}
          />
          <div className={CSS.lessonHead}>
            <div>
              {module?.title && <span className="eyebrow">{module.title}</span>}
              <h2 className={CSS.lessonTitle}>{lesson.title}</h2>
              <span className="meta">
                {index + 1}. lecke / {ids.length}{lesson.length && ` · ${lesson.length}`}
              </span>
            </div>
            <button
              type="button"
              className={`${CSS.doneBtn} ${done ? CSS.doneOn : ""}`}
              aria-pressed={done}
              onClick={() => progress.setDone(currentId, !done)}
            >
              <span className={CSS.doneBox}>{done && <CheckIcon />}</span>
              {done ? "Megnézve" : "Megnéztem"}
            </button>
          </div>
          {html && <div className={`${ArticleCSS.body} ${CSS.lessonBody}`} dangerouslySetInnerHTML={{ __html: html }} />}
          <Downloads items={data.anyagok} access={access} />
          <nav className={CSS.stepper} aria-label="Leckék közötti lépés">
            {prev ? (
              <button type="button" className="btn btnGhost" onClick={() => pick(prev.id)}>Előző lecke</button>
            ) : <span />}
            {next && (
              <button type="button" className="btn" onClick={() => pick(next.id)}>
                Következő: {next.title} <Arrow size={12} />
              </button>
            )}
          </nav>
          <section className={`${ArticleCSS.body} ${CSS.about}`}>
            <h2 className={CSS.sectionTitle}>A tanfolyamról</h2>
            <div dangerouslySetInnerHTML={{ __html: course.introHtml + course.html }} />
          </section>
        </div>

        <aside className={`${CSS.card} ${CSS.side}`}>
          <div className={CSS.sideHead}>
            <h2 className={CSS.cardTitle}>Tananyag</h2>
            <span className="meta">{progress.doneCount} / {ids.length} kész</span>
          </div>
          <span className={CSS.progressBar}>
            <span style={{ transform: `scaleX(${progress.doneCount / ids.length})` }} />
          </span>
          <Curriculum course={course} progress={progress} current={currentId} onPick={pick} />
          <div className={`${CSS.cert} ${progress.complete ? CSS.certOn : ""}`}>
            <span className="eyebrow">Oklevél</span>
            {progress.complete ? (
              <>
                <p>Minden leckét megnézett. Az oklevél a nevével kiállítható.</p>
                <Link to={`/akademia/${course.slug}/oklevel`} className="btn">
                  Oklevél <Arrow size={12} />
                </Link>
              </>
            ) : (
              <p>Az összes lecke megtekintése után kiállítható. Még {ids.length - progress.doneCount} lecke van hátra.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Course() {
  const { slug } = useParams();
  const course = useMemo(() => getCourse(slug), [slug]);
  if (!course) return <NotFound />;
  return <CourseAccess key={course.slug} course={course} />;
}

function CourseAccess({ course }) {
  const access = useCourseContent(course);
  return access.status === "open" ? <Classroom course={course} access={access} /> : <CourseLanding course={course} access={access} />;
}

export default Course;
