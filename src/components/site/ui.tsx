import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "@/lib/router";

/** Fades content in once on scroll; skipped for reduced-motion via CSS. */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

/** Image slot. Shows the supplied photo, or a labelled placeholder until one exists. */
export function Photo({
  src,
  label,
  ratio = "4/5",
  className = "",
  fit = "cover",
}: {
  src?: string;
  label: string;
  ratio?: string;
  className?: string;
  /** Use "contain" for cutout/transparent-background product shots. */
  fit?: "cover" | "contain";
}) {
  return (
    <div className={`overflow-hidden bg-white p-2 ${className}`}>
      <div style={{ aspectRatio: ratio }} className="relative w-full overflow-hidden bg-sky/40">
        {src ? (
          <img
            src={src}
            alt={label}
            loading="lazy"
            decoding="async"
            className={`h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] ${fit === "contain" ? "object-contain p-6" : "object-cover"}`}
          />
        ) : (
          <div
            role="img"
            aria-label={`${label} (photography placeholder)`}
            className="flex h-full items-end p-4 text-[11px] uppercase tracking-[0.2em] text-stone"
          >
            Photography · {label}
          </div>
        )}
      </div>
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-stone">{children}</p>;
}

export function Button({ to, children, tone = "dark" }: { to: string; children: ReactNode; tone?: "dark" | "light" }) {
  const styles =
    tone === "dark"
      ? "bg-slate text-porcelain hover:bg-slate/85"
      : "border border-slate/30 text-slate hover:bg-sky/50";
  return (
    <Link
      to={to}
      className={`inline-block px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${styles}`}
    >
      {children}
    </Link>
  );
}

export function Section({
  children,
  tone = "powder",
  className = "",
  tight = false,
}: {
  children: ReactNode;
  tone?: "powder" | "mist" | "porcelain" | "slate";
  className?: string;
  /** Less vertical padding — use directly below a compact PageHead. */
  tight?: boolean;
}) {
  const bg = { powder: "bg-powder", mist: "bg-sky/30", porcelain: "bg-porcelain", slate: "bg-slate text-porcelain" }[tone];
  const py = tight ? "py-10 md:py-16" : "py-24 md:py-36";
  return (
    <section className={`${bg} px-6 ${py} ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
