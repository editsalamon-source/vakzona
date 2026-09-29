import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { SHOW_LOADER, markLoaderSeen } from "../utils/intro";
import LoaderCSS from "../css/Loader.module.css";

// Nyitóképernyő a logóval és egy töltőcsíkkal – látogatásonként csak egyszer,
// és kimarad, ha a látogató kikapcsolta a mozgó effekteket.
function Loader() {
  const [show, setShow] = useState(SHOW_LOADER);

  useEffect(() => {
    if (!show) return undefined;
    markLoaderSeen();
    const timer = setTimeout(() => setShow(false), 1800);
    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return (
    <motion.div
      className={LoaderCSS.loader}
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ delay: 1.05, duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      aria-hidden="true"
    >
      <div className={LoaderCSS.brand}>
        <Logo size={30} />
        Vakzóna
      </div>
      <div className={LoaderCSS.track}>
        <motion.div
          className={LoaderCSS.bar}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        />
      </div>
    </motion.div>
  );
}

export default Loader;
