import { useEffect, useState } from "react";

/**
 * Floating "Scroll" cue at the bottom of the viewport. Shown while the visitor is
 * still at the top of a page that has more below; fades away once they scroll.
 * Clicking it glides down one screen.
 */
export default function ScrollHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => {
      const more = document.documentElement.scrollHeight - window.innerHeight > 120;
      setShow(more && window.scrollY < 80);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // Pages grow after load (images, lazy sections), so re-check when the height changes.
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll down for more"
      tabIndex={show ? 0 : -1}
      onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" })}
      className={`fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-1 rounded-full bg-slate/90 px-5 py-3 text-porcelain shadow-[0_12px_30px_-12px_rgba(38,55,70,0.6)] backdrop-blur transition-all duration-500 hover:bg-slate ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.3em]">Scroll</span>
      <svg className="scroll-hint-arrow h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
