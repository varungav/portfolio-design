import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { studio } from "@/data/studio";

const SEEN_KEY = "intro-seen";
const MIN_MS = 1800; // shortest the intro stays up
const MAX_MS = 4000; // the loader never blocks the site longer than this

// Decided once per page load at module level, so React Strict Mode's double
// mount can't run the intro twice or skip it on the second pass.
let decided: boolean | null = null;
function shouldShowIntro() {
  if (decided === null) {
    try {
      // `npm run dev` plays it on every refresh; ?intro forces it anywhere.
      const forced = new URLSearchParams(window.location.search).has("intro");
      decided = import.meta.env.DEV || forced || !sessionStorage.getItem(SEEN_KEY);
      if (decided) sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      decided = true;
    }
  }
  return decided;
}

/** Resolves when fonts and the window load event are done (or after `ms`). */
function whenReady(ms: number) {
  const loaded = new Promise<void>((res) => {
    if (document.readyState === "complete") res();
    else window.addEventListener("load", () => res(), { once: true });
  });
  const fonts = document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve();
  const cap = new Promise<void>((res) => setTimeout(res, ms));
  return Promise.race([Promise.all([loaded, fonts]).then(() => undefined), cap]);
}

export default function InitialLoader() {
  const [visible, setVisible] = useState(shouldShowIntro);
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!visible || !root.current) return;
    const el = root.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const main = document.getElementById("main");
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    let cancelled = false;
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<SVGGeometryElement>(".draw-line");
      gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: reduce ? 0 : 1 });
      gsap.set(".brand-name", { opacity: 0, letterSpacing: reduce ? "0.28em" : "0.55em" });
      gsap.set(".meta", { opacity: 0 });
      if (main && !reduce) gsap.set(main, { opacity: 0, scale: 1.04, transformOrigin: "50% 30%" });

      const progress = { v: 0 };
      const set = (v: number) => {
        if (bar.current) bar.current.style.transform = `scaleX(${v})`;
        if (pct.current) pct.current.textContent = `${Math.round(v * 100)}%`;
      };

      const intro = gsap.timeline();
      if (reduce) {
        intro.to(".brand-name", { opacity: 1, duration: 0.4 }).to(".meta", { opacity: 1, duration: 0.3 }, 0);
        set(1);
      } else {
        intro
          .to(".brand-name", { opacity: 1, letterSpacing: "0.28em", duration: 1.2, ease: "power2.out" }, 0.1)
          .to(lines, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut", stagger: 0.12 }, 0.15)
          .to(".meta", { opacity: 1, duration: 0.6 }, 0.3)
          // Runs to 90% over the minimum time; the last 10% waits for real readiness.
          .to(progress, { v: 0.9, duration: MIN_MS / 1000, ease: "power1.inOut", onUpdate: () => set(progress.v) }, 0);
      }

      const minTime = new Promise<void>((res) => setTimeout(res, reduce ? 700 : MIN_MS));
      Promise.all([minTime, whenReady(MAX_MS)]).then(() => {
        if (cancelled) return;
        const out = gsap.timeline({
          onComplete: () => {
            if (main) gsap.set(main, { clearProps: "opacity,transform" });
            setVisible(false);
          },
        });
        if (!reduce) out.to(progress, { v: 1, duration: 0.3, ease: "power1.out", onUpdate: () => set(progress.v) });
        out
          .to(".loader-content", { opacity: 0, y: -12, duration: reduce ? 0.2 : 0.4, ease: "power1.in" }, reduce ? 0 : ">-0.05")
          .to(el, { yPercent: -100, duration: reduce ? 0.3 : 0.9, ease: "power3.inOut" }, ">-0.05");
        if (main) out.to(main, { opacity: 1, scale: 1, duration: reduce ? 0.3 : 1.1, ease: "power2.out" }, "<0.15");
      });
    }, el);

    return () => {
      cancelled = true;
      ctx.revert();
      html.style.overflow = prevOverflow;
      if (main) gsap.set(main, { clearProps: "opacity,transform" });
    };
  }, [visible]);

  if (!visible) return null;

  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1, vectorEffect: "non-scaling-stroke" } as const;
  return (
    <div
      ref={root}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[100] overflow-hidden bg-powder text-slate"
    >
      <div className="loader-content flex h-full flex-col items-center justify-center px-6">
        {/* Abstract interior: window, armchair, floor lamp, floor line. Fewer lines on mobile. */}
        <svg
          viewBox="0 0 400 200"
          aria-hidden
          className="mb-10 w-[min(78vw,30rem)] text-slate/60"
          preserveAspectRatio="xMidYMid meet"
        >
          <path className="draw-line" pathLength={1} d="M10 168 H390" {...stroke} />
          {/* armchair */}
          <path className="draw-line" pathLength={1} d="M140 168 V150 M240 168 V150 M132 150 V112 Q132 96 148 96 H232 Q248 96 248 112 V150 Z M148 150 V128 H232 V150" {...stroke} />
          {/* floor lamp */}
          <path className="draw-line" pathLength={1} d="M300 168 V70 M286 168 H314 M282 70 L300 40 L318 70 Z" {...stroke} />
          {/* window + mullion, desktop only */}
          <g className="hidden md:inline">
            <path className="draw-line" pathLength={1} d="M40 30 H110 V130 H40 Z M75 30 V130 M40 80 H110" {...stroke} />
            <path className="draw-line" pathLength={1} d="M340 120 H375 M340 132 H375" {...stroke} />
          </g>
        </svg>

        <p className="brand-name text-center font-display text-4xl font-medium uppercase md:text-6xl">
          {studio.name}
        </p>
        <p className="meta mt-6 text-[10px] font-medium uppercase tracking-[0.35em] text-stone md:text-[11px]">
          Designing your experience
        </p>
      </div>

      <div className="meta absolute inset-x-6 bottom-10 md:inset-x-16">
        <div className="mb-3 flex justify-end text-[10px] font-medium tracking-[0.3em] text-stone">
          <span ref={pct}>0%</span>
        </div>
        <div className="h-px w-full bg-slate/15">
          <div ref={bar} className="h-full origin-left bg-slate" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}
