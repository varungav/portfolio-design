import { useEffect, useState } from "react";

/**
 * Round "back to top" button that appears once the visitor has scrolled well down the page.
 * On the home page it sits higher, clear of the hero's "View projects" button.
 */
export default function BackToTop({ raised = false }: { raised?: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => setShow(window.scrollY > window.innerHeight * 0.6);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`group fixed right-4 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-slate/40 bg-powder/90 text-slate backdrop-blur transition-all duration-500 hover:bg-slate hover:text-porcelain md:right-8 ${
        raised ? "bottom-28 md:bottom-32" : "bottom-8"
      } ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
    >
      <svg
        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3 10l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
