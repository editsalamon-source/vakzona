import React from "react";

// „Szabadon hozzáférhető” jelzés a belépés nélkül nyíló tanfolyamokon (csempe, tanfolyamoldal), nyitott lakattal.
function FreeBadge({ text = "Szabadon hozzáférhető" }) {
  return (
    <span className="badgeFree">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
        <path d="M8 10.5V7.5a4 4 0 0 1 7.6-1.7" />
      </svg>
      {text}
    </span>
  );
}

export default FreeBadge;
