import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollReset from "./components/ScrollReset";
import useSeo from "./utils/useSeo";

const Landing = lazy(() => import("./pages/Landing"));
const Analyses = lazy(() => import("./pages/Analyses"));
const Analysis = lazy(() => import("./pages/Analysis"));
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
    <a className="skip" href="#tartalom">Ugrás a tartalomra</a>
    <Header />
    <main id="tartalom">
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/elemzesek" element={<Analyses />} />
          <Route path="/elemzesek/:slug" element={<Analysis />} />
          <Route path="/rolunk" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
    <Footer />
  </Router>
);

export default App;
