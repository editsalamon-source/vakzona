import React, { useEffect, useRef } from "react";

const COUNT = 170;
// a vakfolt: ebben a szögtartományban (radián) a részecskék eltűnnek, mint a logó résében
const GAP_FROM = -1.15;
const GAP_TO = -0.35;

function inGap(angle) {
  const a = Math.atan2(Math.sin(angle), Math.cos(angle));
  return a > GAP_FROM && a < GAP_TO;
}

// Keringő részecskék vékony összekötő vonalakkal; egy szeletük mindig „vakzónában” van.
// Csak akkor fut, ha látszik (IntersectionObserver), és áll, ha a mozgás ki van kapcsolva.
function HeroCanvas({ className }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0, height = 0, dpr = 1, frame = 0, running = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const scale = () => Math.min(width, height) / 520;
    const particles = Array.from({ length: COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 150 + 70,
      size: Math.random() * 2 + 1.2,
      speed: Math.random() * 0.002 + 0.001,
      y: Math.random() - 0.5,
      accent: Math.random() > 0.82,
    }));

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      const s = scale();
      const points = particles.map((p) => {
        if (!reduced) p.angle += p.speed;
        const x = width / 2 + Math.cos(p.angle) * p.radius * s;
        const y =
          height / 2 +
          p.y * height * 0.42 * Math.sin(p.angle * 0.5) +
          Math.sin(time * 0.001 + p.radius) * 18 * s;
        return { x, y, p, depth: (Math.sin(p.angle) + 2) / 3, hidden: inGap(p.angle) };
      });

      ctx.lineWidth = 0.5;
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        if (a.hidden) continue;
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          if (b.hidden) continue;
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 70) {
            ctx.strokeStyle = `rgba(148, 163, 184, ${0.18 * (1 - dist / 70)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      points.forEach(({ x, y, p, depth, hidden }) => {
        if (hidden) return;
        ctx.globalAlpha = depth;
        ctx.fillStyle = p.accent ? "#ea580c" : "#cbd5e1";
        ctx.beginPath();
        ctx.arc(x, y, p.size * depth, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const loop = (time) => {
      draw(time);
      if (running) frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    draw(0);
    const observer = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? start() : stop(),
    );
    observer.observe(canvas);
    const onResize = () => {
      resize();
      draw(performance.now());
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

export default HeroCanvas;
