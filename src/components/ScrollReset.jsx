import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// Minden oldalváltáskor – a Vissza/Előre gombbal is – az oldal tetején kezdünk.
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function ScrollReset() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default ScrollReset;
