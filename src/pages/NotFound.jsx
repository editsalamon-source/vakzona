import React from "react";
import { Link } from "react-router-dom";
import PageCSS from "../css/Page.module.css";

function NotFound() {
  return (
    <div className={`wrap read ${PageCSS.page}`}>
      <p className="tag">404</p>
      <h1>Ez az oldal a vakzónában van.</h1>
      <p className="lead">A keresett oldal nem létezik, vagy elköltözött.</p>
      <Link className="btn" to="/">Vissza a főoldalra</Link>
    </div>
  );
}

export default NotFound;
