import React from "react";

// Nyitott kör = a látómező, a rés benne a vakfolt.
function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle
        cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="3"
        strokeDasharray="62 20" transform="rotate(-60 16 16)"
      />
      <circle cx="16" cy="16" r="4.5" fill="var(--accent)" />
    </svg>
  );
}

export default Logo;
