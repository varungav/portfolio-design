import { useEffect, useRef, useState } from "react";
import { brandStats, clientBrandRows, clientBrands, type ClientBrand } from "@/data/studio";

const looks: Record<ClientBrand["look"], string> = {
  wide: "font-display text-lg uppercase tracking-[0.3em] md:text-2xl",
  small: "font-display text-xs uppercase tracking-[0.35em] md:text-base",
  bold: "font-sans text-xl font-semibold md:text-3xl",
  serif: "font-display text-2xl md:text-4xl",
  italic: "font-display text-2xl italic md:text-4xl",
};

/** Counts from 1 to `to` once the element scrolls into view. */
function useCountUp(to: number, ms: number, run: boolean) {
  const [n, setN] = useState(1);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 2);
      setN(Math.max(1, Math.round(1 + (to - 1) * eased)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, ms, run]);
  return n;
}

export default function BrandWall() {
  const box = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), {
      threshold: 0.4,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const count = useCountUp(brandStats.count, 2600, seen);


  return (
    <section aria-label="Brands we have worked with" className="wall relative overflow-hidden bg-powder py-6 md:py-8">
      <p className="sr-only">
        {brandStats.count}+ brands, including {clientBrands.map((b) => b.name).join(", ")}.
      </p>
      <div aria-hidden className="flex flex-col gap-10 md:gap-14">
        {clientBrandRows.map((row, r) => {
          // Repeat to overfill the screen, then render twice for a seamless -50% loop.
          const half = Array.from({ length: Math.ceil(8 / row.length) }, () => row).flat();
          return (
          <div key={r} className="wall-mask overflow-hidden">
            <div
              className={`wall-row ${r % 2 ? "rev" : ""}`}
              style={{ "--dur": `${55 + r * 7}s` } as React.CSSProperties}
            >
              {[...half, ...half].map((b, i) => (
                <span
                  key={i}
                  className={`wall-item ${looks[b.look]}`}
                  style={{ animationDelay: `${((i * 1.7 + r * 0.9) % 7).toFixed(1)}s` }}
                >
                  {b.name}
                </span>
              ))}
            </div>
          </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <div ref={box} className="w-full max-w-xl border border-slate bg-powder px-8 py-12 text-center shadow-[0_0_0_12px_rgba(234,242,247,0.85)]">
          <p className="font-display text-5xl text-slate md:text-7xl">
            <span className="tabular-nums">{count}</span>+ brands
          </p>
          <p className="mx-auto mt-6 max-w-md text-xs uppercase leading-relaxed tracking-[0.2em] text-stone">
            {brandStats.sectors.join(" · ")}
          </p>
        </div>
      </div>
    </section>
  );
}
