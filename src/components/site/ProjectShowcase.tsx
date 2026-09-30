import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Photo } from "@/components/site/ui";
import ZoomableImage from "@/components/site/ZoomableImage";
import { projectProcess, type Project } from "@/data/studio";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const ModelCanvas = lazy(
  () => import("@/components/canvas/ModelPreviewCanvas"),
);

const EASE = "cubic-bezier(0.22,1,0.36,1)";

/**
 * Centered project card that slides left on click, opening a panel for a
 * 3D model. The model itself is a placeholder (FloatingModel) until a real
 * GLB is supplied — see src/components/canvas/FloatingModel.tsx.
 *
 * Open state can be controlled by a parent (e.g. a grid that needs to expand
 * this item's cell) via `open`/`onToggle`; omit both to manage it internally.
 */
export function ProjectShowcase({
  project,
  open: openProp,
  onToggle,
}: {
  project: Project;
  open?: boolean;
  onToggle?: () => void;
}) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const toggle = onToggle ?? (() => setOpenState((v) => !v));

  const scope = project.scope ?? projectProcess.scope;
  const tools = project.tools ?? projectProcess.tools;
  const delivered = project.delivered ?? projectProcess.delivered;

  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const text = textRef.current;
    const image = imageRef.current;
    if (!root || !text || !image) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });
      tl.fromTo(
        text,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
      ).fromTo(
        image,
        { autoAlpha: 0, scale: 1.06 },
        { autoAlpha: 1, scale: 1, duration: 1, ease: "power3.out" },
        "-=0.5",
      );
    }, root);
    return () => ctx.revert();
  }, []);

  // Opening reorders/re-lays out the page, leaving the entrance trigger's
  // positions stale and the content stuck hidden — show it and re-measure.
  useEffect(() => {
    if (!open) return;
    gsap.set([textRef.current, imageRef.current], {
      autoAlpha: 1,
      y: 0,
      scale: 1,
    });
    ScrollTrigger.refresh();
  }, [open]);

  // Index of the drawing shown enlarged over the page, or null.
  const [zoom, setZoom] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const gallery = project.gallery ?? [];
  // The 3D view runs full width; the drawings below share a row evenly (3 across, else 2, else 1).
  const small = gallery.length - 1;
  const smallSpan =
    small % 3 === 0
      ? "col-span-2"
      : small % 2 === 0
        ? "col-span-3"
        : "col-span-6";
  // Stepping to another drawing slides the old one out and the new one in, in the direction of travel.
  const [enter, setEnter] = useState<"next" | "prev" | undefined>();
  const [leaving, setLeaving] = useState<{
    src: string;
    dir: "next" | "prev";
  } | null>(null);
  const go = (d: 1 | -1) => {
    if (zoom === null) return;
    const dir = d > 0 ? "next" : "prev";
    setLeaving({ src: gallery[zoom].src, dir });
    setEnter(dir);
    setZoom((zoom + d + gallery.length) % gallery.length);
    window.setTimeout(() => setLeaving(null), 450);
  };
  // Fade the viewer out before removing it, rather than cutting it.
  const [closing, setClosing] = useState(false);
  const closeZoom = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      setZoom(null);
      setClosing(false);
    }, 320);
  };
  const closeZoomRef = useRef(closeZoom);
  closeZoomRef.current = closeZoom;
  const goRef = useRef(go);
  goRef.current = go;
  useEffect(() => {
    if (zoom === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeZoomRef.current();
      if (e.key === "ArrowRight") goRef.current(1);
      if (e.key === "ArrowLeft") goRef.current(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [zoom, gallery.length]);
  useEffect(() => {
    if (!open) setZoom(null);
  }, [open]);

  const closeButton = (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Close ${project.title}`}
      className="group flex cursor-pointer items-center gap-3 border border-slate/40 bg-powder px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-slate transition-colors duration-300 hover:bg-slate hover:text-porcelain"
    >
      Close
      <svg
        aria-hidden
        className="h-3 w-3 transition-transform duration-300 group-hover:rotate-90"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
      </svg>
    </button>
  );

  return (
    <div ref={rootRef}>
      {open && (
        // Sticky, so it follows the visitor down the drawings and stops at the end of this project.
        <div className="page-enter pointer-events-none sticky top-24 z-30 mb-6 flex justify-end">
          <div className="pointer-events-auto shadow-[0_12px_30px_-14px_rgba(38,55,70,0.55)]">
            {closeButton}
          </div>
        </div>
      )}
      <div className="flex items-start overflow-hidden">
        <button
          type="button"
          onClick={toggle}
          className="block shrink-0 grow-0 cursor-pointer text-left"
          style={{
            flexBasis: open ? "42%" : "100%",
            transition: `flex-basis 800ms ${EASE}`,
          }}
        >
          <div className={open ? "" : "mx-auto max-w-md text-center"}>
            <div ref={textRef}>
              <h3 className="font-display text-3xl md:text-4xl">
                {project.title}
              </h3>
              {project.tagline && (
                <p className="mt-3 text-stone">{project.tagline}</p>
              )}
            </div>
            <div ref={imageRef} className="mt-6">
              <Photo
                src={project.image}
                label={project.title}
                ratio="4/5"
                fit={project.imageFit ?? "cover"}
                className={open ? "" : "mx-auto"}
              />
              {project.caption && (
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-stone">
                  {project.caption}
                </p>
              )}
            </div>
            {open && (
              <dl className="mt-8 grid grid-cols-1 gap-6 border-t border-sky/60 pt-6 sm:grid-cols-3">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-stone">
                    Scope
                  </dt>
                  <dd className="mt-1.5 text-sm text-slate">{scope}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-stone">
                    Tools
                  </dt>
                  <dd className="mt-1.5 text-sm text-slate">{tools}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-stone">
                    Delivered
                  </dt>
                  <dd className="mt-1.5 text-sm text-slate">{delivered}</dd>
                </div>
              </dl>
            )}
            {!open && (
              <p className="mt-6 text-xs uppercase tracking-[0.2em] text-stone">
                Click to know more →
              </p>
            )}
          </div>
        </button>

        <div
          className="shrink-0 grow-0 overflow-hidden"
          style={{
            flexBasis: open ? "58%" : "0%",
            opacity: open ? 1 : 0,
            transition: `flex-basis 800ms ${EASE}, opacity 600ms ${EASE} ${open ? "200ms" : "0ms"}`,
          }}
        >
          {project.gallery ? (
            <div className="grid grid-cols-6 gap-x-5 gap-y-6 pl-6">
              {project.gallery.map((g, i) => (
                <figure
                  key={i}
                  style={
                    open ? { animationDelay: `${0.3 + i * 0.12}s` } : undefined
                  }
                  className={`${open ? "page-enter" : ""} ${i === 0 ? "col-span-6" : smallSpan}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setEnter(undefined);
                      setZoom(i);
                    }}
                    aria-label={`Enlarge ${g.label}`}
                    className="block w-full cursor-zoom-in bg-white p-2"
                  >
                    <img
                      src={g.src}
                      alt={`${project.title} — ${g.label}`}
                      loading="lazy"
                      className="block h-auto w-full"
                    />
                  </button>
                  <figcaption className="mt-3">
                    <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate">
                      {g.label}
                    </span>
                    <span className="mt-1 block text-sm text-stone">
                      {g.caption}
                    </span>
                  </figcaption>
                </figure>
              ))}
              {project.galleryNote && (
                <p className="col-span-6 font-display text-lg italic text-stone">
                  {project.galleryNote}
                </p>
              )}
            </div>
          ) : (
            <div className="relative aspect-square w-full bg-sky/30">
              {open && (
                <Suspense fallback={null}>
                  <ModelCanvas />
                </Suspense>
              )}
              <span className="absolute bottom-4 left-4 text-[11px] uppercase tracking-[0.2em] text-stone">
                3D model — to be added
              </span>
            </div>
          )}
        </div>
      </div>
      {zoom !== null &&
        gallery[zoom] &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} — ${gallery[zoom].label}`}
            className={`fixed inset-0 z-[70] bg-slate/90 backdrop-blur-sm ${closing ? "lightbox-out" : "page-enter"}`}
          >
            <button
              type="button"
              onClick={closeZoom}
              aria-label="Close enlarged image"
              className="group absolute right-4 top-4 z-20 flex cursor-pointer items-center gap-3 border border-porcelain/40 px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-porcelain transition-colors duration-300 hover:bg-porcelain hover:text-slate md:right-8 md:top-8"
            >
              Close
              <svg
                aria-hidden
                className="h-3 w-3 transition-transform duration-300 group-hover:rotate-90"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
              </svg>
            </button>
            {leaving && (
              <ZoomableImage
                key={`out-${leaving.src}`}
                src={leaving.src}
                alt=""
                leaving={leaving.dir}
                onBackdropClick={() => {}}
              />
            )}
            <ZoomableImage
              key={gallery[zoom].src}
              enter={enter}
              src={gallery[zoom].src}
              alt={`${project.title} — ${gallery[zoom].label}`}
              onBackdropClick={closeZoom}
              onZoomChange={setZoomed}
            />
            <div
              className={`pointer-events-none absolute inset-x-0 bottom-24 z-10 flex flex-col items-center px-4 transition-opacity duration-300 md:bottom-28 ${
                zoomed ? "opacity-0" : "opacity-100"
              }`}
            >
              <p
                key={gallery[zoom].src}
                className="page-enter text-center text-porcelain"
              >
                <span className="text-[11px] font-medium uppercase tracking-[0.28em]">
                  {gallery[zoom].label}
                </span>
                <span className="mt-1 block text-sm text-sky">
                  {gallery[zoom].caption}
                </span>
              </p>
              {gallery.length > 1 && (
                <div
                  className={`mt-4 flex gap-3 ${zoomed ? "pointer-events-none" : "pointer-events-auto"}`}
                >
                  {[-1, 1].map((d) => (
                    <button
                      key={d}
                      type="button"
                      aria-label={d < 0 ? "Previous drawing" : "Next drawing"}
                      onClick={() => go(d as 1 | -1)}
                      className="cursor-pointer border border-porcelain/40 px-5 py-2 text-xs uppercase tracking-[0.2em] text-porcelain transition-colors hover:bg-porcelain hover:text-slate"
                    >
                      {d < 0 ? "← Prev" : "Next →"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
