import React from "react";
import { motion } from "framer-motion";

// Görgetésre becsúszó blokk – csak transform, opacity-áttűnés nélkül (Chrome fehér villanás).
function Reveal({ as = "div", delay = 0, children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      initial={{ y: 40 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
