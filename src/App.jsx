import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import ScrollReset from "./components/ScrollReset";
import useSeo from "./utils/useSeo";
import KATEGORIAK from "./data/kategoriak";

const Landing = lazy(() => import("./pages/Landing"));
const Analyses = lazy(() => import("./pages/Analyses"));
const Analysis = lazy(() => import("./pages/Analysis"));
const Academy = lazy(() => import("./pages/Academy"));
const Course = lazy(() => import("./pages/Course"));
const Certificate = lazy(() => import("./pages/Certificate"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

function SeoManager() {
  useSeo();
  return null;
}

const App = () => (
  <Router>
    <SeoManager />
    <ScrollReset />
    <Loader />
    <Cursor />
    <a className="skip" href="#tartalom">Ugrás a tartalomra</a>
    <Header />
    <main id="tartalom">
      <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/elemzesek" element={<Analyses />} />
          <Route path="/elemzesek/:slug" element={<Analysis />} />
          {KATEGORIAK.map((k) => (
            <Route key={k.slug} path={`/${k.slug}`} element={<Analyses category={k} />} />
          ))}
          <Route path="/akademia" element={<Academy />} />
          <Route path="/akademia/:slug" element={<Course />} />
          <Route path="/akademia/:slug/oklevel" element={<Certificate />} />
          <Route path="/rolunk" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
    <Footer />
  </Router>
);

export default App;
