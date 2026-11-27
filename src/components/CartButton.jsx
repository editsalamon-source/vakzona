import React from "react";
import { useNavigate } from "react-router-dom";
import { ar, forint } from "../data/fizetes";
import { useCart, addToCart, megveheto } from "../utils/kosar";
import CSS from "../css/Cart.module.css";

// Kerek kosár ikon a tanfolyamcsempéken (CourseTile, CourseCard): kattintásra kosárba teszi a tanfolyamot,
// ha már benne van, pipát mutat, és a kosárhoz visz. Csak megvásárolható tanfolyamnál és bekapcsolt kosárnál látszik.
function CartButton({ course, className = "" }) {
  const items = useCart();
  const navigate = useNavigate();
  if (!megveheto(course.slug)) return null;
  const inCart = items.includes(course.slug);
  const label = inCart
    ? `${course.title}: a kosárban van, tovább a kosárhoz`
    : `${course.title} kosárba (${forint(ar(course.slug))})`;
  return (
    <button
      type="button"
      className={`${CSS.iconBtn} ${inCart ? CSS.iconBtnOn : ""} ${className}`}
      aria-label={label}
      title={inCart ? "A kosárban van" : `Kosárba · ${forint(ar(course.slug))}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (inCart) navigate("/kosar");
        else addToCart(course.slug);
      }}
    >
      {inCart ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3.5 4.5h2.2l2.1 10.25a1.5 1.5 0 0 0 1.47 1.2h7.6a1.5 1.5 0 0 0 1.46-1.15L19.9 8H6.6" />
          <circle cx="9.75" cy="19.5" r="1.25" />
          <circle cx="16.75" cy="19.5" r="1.25" />
          <path d="M13 9.5v4M11 11.5h4" />
        </svg>
      )}
    </button>
  );
}

export default CartButton;
