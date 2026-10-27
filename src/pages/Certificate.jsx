import React, { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourse, AKADEMIA, formatLength } from "../data/akademia";
import { formatDate } from "../data/analyses";
import { useProgress } from "../utils/haladas";
import Arrow from "../components/Arrow";
import Logo from "../components/Logo";
import NotFound from "./NotFound";
import CSS from "../css/Certificate.module.css";
import PageCSS from "../css/Page.module.css";

// névelő a kiejtés szerint: magánhangzóval kezdődő szó (és az „AI”) elé „az”
const article = (word) => (/^[aáeéiíoóöőuúüű]/i.test(word) ? "az" : "a");

const SHEET_W = 1123; // A4 fekvő 96 dpi-n (297 × 210 mm)

// Az oklevél lapja: bal oldalt sötét Vakzóna-sáv a két logóval, jobbra a név és a tanfolyam adatai.
const Sheet = forwardRef(function Sheet({ course, name, date }, ref) {
  return (
    <div ref={ref} className={CSS.sheet}>
      <div className={CSS.band}>
        <span className={CSS.bandGrid} />
        <span className={CSS.bandGlow} />
        <span className={CSS.bandRing}><Logo size={300} /></span>
        <div className={CSS.brand}>
          <Logo size={34} />
          <span>
            <strong>Vakzóna</strong>
            <em>Akadémia</em>
          </span>
        </div>
        {course.logo && (
          <div className={CSS.courseLogo}>
            <img src={course.logo} alt="" />
            {course.logoText && <span>{course.logoText}</span>}
          </div>
        )}
      </div>

      <div className={CSS.content}>
        <span className={CSS.eyebrow}>Oklevél</span>
        <p className={CSS.intro}>Igazoljuk, hogy</p>
        <p className={`${CSS.name} ${name ? "" : CSS.namePlaceholder}`}>{name || "Az Ön neve"}</p>
        <p className={CSS.intro}>
          elvégezte {article(course.title)}
        </p>
        <p className={CSS.course}>{course.title}</p>
        <p className={CSS.intro}>tanfolyamot.</p>

        <div className={CSS.facts}>
          <div>
            <span>Tananyag</span>
            <strong>
              {course.lessons.length} videólecke{course.seconds > 0 && ` · ${formatLength(course.seconds)}`}
            </strong>
          </div>
          <div>
            <span>Kelt</span>
            <strong>{date ? formatDate(date) : "–"}</strong>
          </div>
          <div>
            <span>Kiállító</span>
            <strong>{AKADEMIA.name}</strong>
          </div>
        </div>

        <div className={CSS.foot}>
          <span>vakzona.com/akademia/{course.slug}</span>
          <span>Az oklevél a tanfolyam összes leckéjének megtekintését igazolja.</span>
        </div>
      </div>
    </div>
  );
});

// A lapból kép, abból egyoldalas A4-es PDF készül a böngészőben (nyomtatási ablak nélkül).
// A két könyvtár csak itt, a letöltéskor töltődik be.
async function downloadPdf(sheet, course, name) {
  const [{ toJpeg }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
  const image = await toJpeg(sheet, {
    quality: 0.95,
    pixelRatio: 3,
    backgroundColor: "#ffffff",
    style: { borderRadius: "0", boxShadow: "none" },
  });
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
  pdf.addImage(image, "JPEG", 0, 0, 297, 210);
  pdf.setProperties({ title: `Oklevél – ${course.title}`, author: AKADEMIA.name, subject: name });
  pdf.save(`Oklevél – ${course.title} – ${name}.pdf`);
}

// a lap előnézete a rendelkezésre álló szélességre kicsinyítve (nyomtatásban teljes méret)
function Preview({ children }) {
  const box = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = box.current;
    const fit = () => setScale(Math.min(1, el.clientWidth / SHEET_W));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className={CSS.preview} style={{ "--scale": scale }}>
      <div className={CSS.scaler}>{children}</div>
    </div>
  );
}

function Certificate() {
  const { slug } = useParams();
  const course = useMemo(() => getCourse(slug), [slug]);
  if (!course) return <NotFound />;
  return <CertificateFor course={course} />;
}

function CertificateFor({ course }) {
  const progress = useProgress(course);
  const [name, setName] = useState(progress.name || "");
  const [busy, setBusy] = useState(false);
  const sheet = useRef(null);
  useEffect(() => setName(progress.name || ""), [progress.name]);

  if (!progress.complete) {
    return (
      <div className={`wrap ${PageCSS.page}`}>
        <div className={PageCSS.prose}>
          <span className="tag tagAccent">Oklevél</span>
          <h1>Még néhány lecke van hátra.</h1>
          <p className="lead">
            Az oklevél {article(course.title)} {course.title} tanfolyam összes leckéjének megtekintése után állítható ki
            ({progress.doneCount} / {course.lessons.length} kész).
          </p>
          <div className={PageCSS.actions}>
            <Link className="btn" to={`/akademia/${course.slug}`}>
              Vissza a tanfolyamhoz <Arrow size={12} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const trimmed = name.trim();

  async function download() {
    setBusy(true);
    try {
      await downloadPdf(sheet.current, course, trimmed);
    } catch (e) {
      // ha a böngésző nem tudja előállítani, marad a nyomtatás („Mentés PDF-ként”)
      window.print();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`wrap ${CSS.page}`}>
      <div className={CSS.layout}>
        <form
          className={CSS.form}
          onSubmit={(e) => {
            e.preventDefault();
            if (!trimmed) return;
            progress.setName(trimmed);
            download();
          }}
        >
          <Link to={`/akademia/${course.slug}`} className="tag">← {course.title}</Link>
          <h1 className={CSS.title}>Gratulálunk!</h1>
          <p className={CSS.text}>
            Minden leckét megnézett. Adja meg a nevet, amelyre az oklevelet kiállítjuk, és töltse le PDF-ként.
          </p>
          <label className={CSS.label} htmlFor="oklevelNev">Név az oklevélen</label>
          <input
            id="oklevelNev"
            className={CSS.input}
            value={name}
            maxLength={80}
            autoComplete="name"
            placeholder="pl. Kovács Anna"
            onChange={(e) => setName(e.target.value)}
            onBlur={() => trimmed && progress.setName(trimmed)}
          />
          <div className={CSS.buttons}>
            <button type="submit" className="btn" disabled={!trimmed || busy}>
              {busy ? "Készül…" : "Oklevél letöltése (PDF)"} <Arrow size={12} />
            </button>
            <button type="button" className="btn btnGhost" disabled={!trimmed} onClick={() => window.print()}>
              Nyomtatás
            </button>
          </div>
          <p className={CSS.hint}>A név csak ebben a böngészőben tárolódik, nem küldjük el sehova.</p>
        </form>

        <Preview>
          <Sheet ref={sheet} course={course} name={trimmed} date={progress.finished} />
        </Preview>
      </div>
    </div>
  );
}

export default Certificate;
