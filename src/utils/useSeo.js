import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import seo, { SITE_URL, SITE_NAME } from "../data/seo";
import analyses from "../data/analyses";

function setMeta(selector, attribute, value, createWith) {
  let element = document.head.querySelector(selector);
  if (!element && createWith) {
    element = document.createElement(createWith.tag);
    Object.entries(createWith.attrs).forEach(([key, val]) =>
      element.setAttribute(key, val),
    );
    document.head.appendChild(element);
  }
  if (element) element.setAttribute(attribute, value);
}

function entryFor(pathname) {
  if (seo[pathname]) return seo[pathname];
  const slug = pathname.match(/^\/elemzesek\/([^/]+)$/)?.[1];
  const analysis = slug && analyses.find((a) => a.slug === slug);
  if (analysis) {
    return {
      title: `${analysis.title} – ${SITE_NAME}`,
      description: analysis.subtitle || seo["/elemzesek"].description,
    };
  }
  return null;
}

// Oldalankénti cím, leírás, canonical és megosztási meta beállítása.
function useSeo() {
  const { pathname: rawPath } = useLocation();
  const pathname = rawPath.length > 1 ? rawPath.replace(/\/+$/, "") : rawPath;

  useEffect(() => {
    const known = entryFor(pathname);
    const entry = known || seo.notFound;
    const url = known ? `${SITE_URL}${pathname === "/" ? "" : pathname}` : SITE_URL;

    document.title = entry.title;
    setMeta('meta[name="description"]', "content", entry.description, {
      tag: "meta",
      attrs: { name: "description" },
    });
    setMeta('meta[property="og:title"]', "content", entry.title);
    setMeta('meta[property="og:description"]', "content", entry.description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[name="twitter:title"]', "content", entry.title);
    setMeta('meta[name="twitter:description"]', "content", entry.description);
    setMeta('link[rel="canonical"]', "href", url, {
      tag: "link",
      attrs: { rel: "canonical" },
    });
    // nem létező oldalt ne indexeljenek a keresők
    setMeta('meta[name="robots"]', "content", known ? "index, follow, max-image-preview:large" : "noindex");
  }, [pathname]);
}

export default useSeo;
