import React from "react";
import { Link } from "react-router-dom";
import Arrow from "../components/Arrow";
import PageCSS from "../css/Page.module.css";

function NotFound() {
  return (
    <div className={`wrap ${PageCSS.page}`}>
      <div className={PageCSS.prose}>
        <span className="tag tagAccent">404</span>
        <h1>Ez az oldal a vakzónában van.</h1>
        <p className="lead">A keresett oldal nem létezik, vagy elköltözött.</p>
        <div className={PageCSS.actions}>
          <Link className="btn" to="/">
            Vissza a főoldalra <Arrow size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
