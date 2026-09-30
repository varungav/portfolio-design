import { useEffect, useRef } from "react";
import { profile } from "@/data/studio";

export default function Profile() {
  const root = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (el.classList.add("in"), io.disconnect()), {
      threshold: 0.25,
    });
    io.observe(el);

    // Gentle parallax on the portrait while the section is on screen.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight; // -1..1
        if (photo.current) photo.current.style.transform = `translateY(${(p * -28).toFixed(1)}px)`;
      });
    };
    if (!reduce) window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={root} aria-label={`About ${profile.name}`} className="px-6 py-24 md:py-40"
      // Fades in from the brand wall's powder so there is no hard edge between the two.
      style={{
        background:
          "linear-gradient(to bottom, var(--powder), color-mix(in srgb, var(--sky) 30%, var(--powder)) 14rem)",
      }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-[1.2fr_0.8fr] md:gap-24">
        <div>
          <p className="rise text-[11px] font-medium uppercase tracking-[0.28em] text-stone">{profile.role}</p>
          <div className="draw my-8 h-px w-24 bg-slate" />
          <h2 className="sr-only">{profile.name}</h2>
          {profile.paragraphs.map((t, i) => (
            <p
              key={i}
              style={{ "--d": `${0.35 + i * 0.25}s` } as React.CSSProperties}
              className={`rise max-w-xl text-slate ${i ? "mt-8 text-base leading-8 text-slate/80 md:text-lg" : "font-display text-3xl leading-[1.4] md:text-4xl"}`}
            >
              {t}
            </p>
          ))}
        </div>

        <figure className="mx-auto w-full max-w-sm md:max-w-none">
          <div ref={photo} className="will-change-transform">
            <div className="wipe bg-white p-3 md:p-4">
              <div className="overflow-hidden">
                <img
                  src="/images/praveen.png"
                  alt={`Portrait of ${profile.name}`}
                  loading="lazy"
                  className="zoom block h-auto w-full"
                />
              </div>
            </div>
          </div>
          <figcaption style={{ "--d": "0.8s" } as React.CSSProperties} className="rise mt-8 text-center">
            <p className="font-display text-3xl text-slate md:text-4xl">{profile.name}</p>
            <p className="mt-1 text-sm text-stone">({profile.status})</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
