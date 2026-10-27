import { useCallback, useEffect, useState } from "react";

// Tanfolyamonkénti haladás a látogató böngészőjében (localStorage): megnézett leckék, utolsó lecke,
// a befejezés napja és az oklevélre írt név. Privát ablakban nincs tárolás: ilyenkor csak az oldal
// megnyitásáig él.
const KEY = (slug) => `vz_akademia_${slug}`;

function read(slug) {
  try {
    return { done: [], ...JSON.parse(localStorage.getItem(KEY(slug)) || "{}") };
  } catch (e) {
    return { done: [] };
  }
}

function write(slug, value) {
  try {
    localStorage.setItem(KEY(slug), JSON.stringify(value));
  } catch (e) {
    /* nincs tárolás – a haladás az oldal bezárásáig marad meg */
  }
}

const today = () => new Date().toISOString().slice(0, 10);

export function useProgress(course) {
  const [state, setState] = useState(() => read(course.slug));
  useEffect(() => setState(read(course.slug)), [course.slug]);

  const update = useCallback(
    (fn) =>
      setState((prev) => {
        const next = fn(prev);
        const all = course.lessons.every((l) => next.done.includes(l.id));
        // a befejezés napja az első alkalom, amikor minden lecke kész lett
        if (all && !next.finished) next.finished = today();
        if (!all) delete next.finished;
        write(course.slug, next);
        return next;
      }),
    [course]
  );

  const setDone = useCallback(
    (id, on = true) =>
      update((p) => ({
        ...p,
        done: on ? [...new Set([...p.done, id])] : p.done.filter((d) => d !== id),
      })),
    [update]
  );

  const doneCount = course.lessons.filter((l) => state.done.includes(l.id)).length;

  return {
    ...state,
    doneCount,
    complete: course.lessons.length > 0 && doneCount === course.lessons.length,
    isDone: (id) => state.done.includes(id),
    setDone,
    setLast: (id) => update((p) => ({ ...p, last: id })),
    setName: (name) => update((p) => ({ ...p, name })),
  };
}

// csak olvasás (a tanfolyamkártyák haladássávjához)
export function readProgress(course) {
  const { done } = read(course.slug);
  return course.lessons.filter((l) => done.includes(l.id)).length;
}
