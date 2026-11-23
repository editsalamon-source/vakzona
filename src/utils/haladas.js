import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount, loadProgress, saveProgress } from "./fiok";

// Tanfolyamonkénti haladás a látogató böngészőjében (localStorage): megnézett leckék, utolsó lecke,
// a befejezés napja, az oklevélre írt név és az a név, amelyre az oklevelet kiállítottuk (issuedName). Privát ablakban nincs tárolás: ilyenkor csak az oldal
// megnyitásáig él. Bejelentkezett felhasználónál a megnézett leckék a fiókba is mentődnek (supabase/schema.sql:
// haladas): belépéskor a két listát egyesítjük (ami bárhol kész, az kész), utána minden változás felmegy.
// Így a haladás gépek között is megmarad, és az adminoldal látja. Az oklevél neve csak a böngészőben marad.
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

  // szinkron a fiókkal: synced = a tanfolyam, amelynél a fiókbeli listát már egyesítettük; saved = ami fent van
  const { user } = useAccount();
  const uid = user?.id;
  const sync = useRef({ synced: null, saved: null });
  useEffect(() => {
    sync.current = { synced: null, saved: null };
    if (!uid) return;
    let live = true;
    loadProgress(course.slug)
      .then((remote) => {
        if (!live) return;
        const local = read(course.slug);
        const merged = [...new Set([...local.done, ...(remote || [])])];
        sync.current = { synced: course.slug, saved: remote ? JSON.stringify([...remote].sort()) : null };
        if (merged.length !== local.done.length) {
          const next = { ...local, done: merged };
          const all = course.lessons.length > 0 && course.lessons.every((l) => merged.includes(l.id));
          if (all && !next.finished) next.finished = today();
          write(course.slug, next);
          setState(next);
        } else setState(local);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [uid, course]);

  useEffect(() => {
    if (!uid || sync.current.synced !== course.slug) return;
    const key = JSON.stringify([...state.done].sort());
    if (key === sync.current.saved) return;
    const t = setTimeout(() => {
      saveProgress(course.slug, state.done)
        .then(() => {
          sync.current.saved = key;
        })
        .catch(() => {});
    }, 800);
    return () => clearTimeout(t);
  }, [uid, course.slug, state.done]);

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
    // az oklevél egyszer, egy névre állítható ki: az első kiállítás után a név nem változik
    issue: (name) => update((p) => ({ ...p, name: p.issuedName || name, issuedName: p.issuedName || name })),
  };
}

// csak olvasás (a tanfolyamkártyák haladássávjához)
export function readProgress(course) {
  const { done } = read(course.slug);
  return course.lessons.filter((l) => done.includes(l.id)).length;
}
