import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import CursorCSS from "../css/Cursor.module.css";

const HOVER_TARGETS = "a, button, [role='button'], input, label, select, textarea";

// Egyedi kurzor a Vakzóna logóból: a narancs pont azonnal követi az egeret,
// a nyitott kör (a vakfolt) késleltetve úszik utána, és kattintható elem fölött megnő.
// Csak egérrel (pointer: fine) jelenik meg; érintőképernyőn a rendszerkurzor marad.
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(fine.matches);
    update();
    fine.addEventListener("change", update);
    return () => fine.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    document.documentElement.classList.add(CursorCSS.hideNative);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;
    let frame = 0;
    let visible = false;

    const show = (on) => {
      if (visible === on) return;
      visible = on;
      dotRef.current?.classList.toggle(CursorCSS.visible, on);
      ringRef.current?.classList.toggle(CursorCSS.visible, on);
    };

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      show(true);
      const hovering = e.target instanceof Element && e.target.closest(HOVER_TARGETS);
      ringRef.current?.classList.toggle(CursorCSS.hover, Boolean(hovering));
    };
    const onLeave = () => show(false);
    const onDown = () => ringRef.current?.classList.add(CursorCSS.pressed);
    const onUp = () => ringRef.current?.classList.remove(CursorCSS.pressed);

    const tick = () => {
      const ease = reduced ? 1 : 0.15;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove(CursorCSS.hideNative);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [enabled]);

  // oldalváltáskor az eltűnt link alatti „hover” állapot ne ragadjon be
  useEffect(() => {
    ringRef.current?.classList.remove(CursorCSS.hover);
  }, [pathname]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className={CursorCSS.ring} aria-hidden="true">
        <svg viewBox="0 0 32 32">
          <circle
            cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="1.3"
            strokeDasharray="62 20" strokeLinecap="round"
          />
        </svg>
      </div>
      <div ref={dotRef} className={CursorCSS.dot} aria-hidden="true" />
    </>
  );
}

export default Cursor;
