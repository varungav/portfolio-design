import { useEffect, useRef, useState } from "react";

// Natural sizes by image URL, so a drawing is laid out at its final size the moment it appears.
const sizeCache = new Map<string, { w: number; h: number }>();

const MIN = 1;
const MAX = 5;
// The drawing sits this many px above the stage centre, clear of the caption and zoom panel below it.
const LIFT = 100;
const clamp = (n: number) => Math.min(MAX, Math.max(MIN, n));

const btn =
  "flex h-9 w-9 cursor-pointer items-center justify-center border border-porcelain/40 text-lg leading-none text-porcelain transition-colors hover:bg-porcelain hover:text-slate disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-porcelain";

/**
 * Zoomable drawing for the enlarged view. Must sit inside a positioned, full-screen parent:
 * its stage fills that parent, so a zoomed drawing uses the whole screen, not just its own box.
 * Click the drawing to zoom in/out at the cursor, scroll to zoom, drag to pan, or use the buttons.
 */
export default function ZoomableImage({
  src,
  alt,
  onBackdropClick,
  onZoomChange,
  enter,
  leaving,
}: {
  src: string;
  alt: string;
  /** Called when the empty area around an unzoomed drawing is clicked. */
  onBackdropClick: () => void;
  /** Reports whether the drawing is currently zoomed in, so the parent can tuck away other UI. */
  onZoomChange?: (zoomed: boolean) => void;
  /** Slide in from this direction (stepping to another drawing). */
  enter?: "next" | "prev";
  /** Render as the outgoing drawing: static, non-interactive, sliding away in this direction. */
  leaving?: "next" | "prev";
}) {
  const stage = useRef<HTMLDivElement>(null);
  // Source drawings can be small, so scale them up to fill the free space instead of showing at native size.
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(
    () => sizeCache.get(src) ?? null,
  );
  const [view, setView] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });
  useEffect(() => {
    const onResize = () =>
      setView({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const size = natural && {
    // Leave room for the frame padding, the close button and the caption/zoom panels.
    ...(() => {
      const fit = Math.min(
        (view.w * 0.9 - 32) / natural.w,
        Math.max(200, view.h - 360) / natural.h,
      );
      return {
        width: Math.round(natural.w * fit),
        height: Math.round(natural.h * fit),
      };
    })(),
  };
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{
    x: number;
    y: number;
    px: number;
    py: number;
    moved: boolean;
    onImage: boolean;
  } | null>(null);

  useEffect(() => {
    onZoomChange?.(scale > 1);
  }, [scale, onZoomChange]);

  // Keep the point under (cx, cy), measured from the stage centre, fixed on screen while scaling.
  const zoomTo = (next: number, cx = 0, cy = 0) => {
    const ns = clamp(next);
    if (ns === scale) return;
    if (ns === 1) {
      setScale(1);
      setPos({ x: 0, y: 0 });
      return;
    }
    const k = ns / scale - 1;
    setPos({ x: pos.x - (cx - pos.x) * k, y: pos.y - (cy - pos.y) * k });
    setScale(ns);
  };

  const fromCentre = (e: { clientX: number; clientY: number }) => {
    const r = stage.current!.getBoundingClientRect();
    return {
      cx: e.clientX - (r.left + r.width / 2),
      cy: e.clientY - (r.top + r.height / 2 - LIFT),
    };
  };

  if (leaving) {
    return (
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden slide-out-${leaving}`}
      >
        <div
          className="bg-white p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] md:p-3"
          style={{ transform: `translateY(${-LIFT}px)` }}
        >
          <img
            src={src}
            alt={alt}
            className="block"
            style={size ?? { maxHeight: "60vh", maxWidth: "88vw" }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={stage}
        className={`absolute inset-0 flex items-center justify-center overflow-hidden ${
          scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-out"
        }`}
        style={{ touchAction: "none" }}
        onWheel={(e) => {
          const { cx, cy } = fromCentre(e);
          zoomTo(scale * (e.deltaY < 0 ? 1.25 : 0.8), cx, cy);
        }}
        onPointerDown={(e) => {
          drag.current = {
            x: e.clientX,
            y: e.clientY,
            px: pos.x,
            py: pos.y,
            moved: false,
            onImage: !!(e.target as HTMLElement).closest("[data-drawing]"),
          };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || scale === 1) return;
          const dx = e.clientX - d.x;
          const dy = e.clientY - d.y;
          if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
          setPos({ x: d.px + dx, y: d.py + dy });
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          if (!d || d.moved) return;
          // Pointer capture retargets events to the stage, so remember what was pressed.
          if (d.onImage) {
            const { cx, cy } = fromCentre(e);
            zoomTo(scale > 1 ? 1 : 2.5, cx, cy);
          } else if (scale === 1) {
            onBackdropClick();
          } else {
            zoomTo(1);
          }
        }}
      >
        <div className={enter ? `slide-in-${enter}` : undefined}>
          <div
            data-drawing
            className={`bg-white p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] md:p-3 ${
              scale > 1 ? "" : "cursor-zoom-in"
            }`}
            style={{
              transform: `translate(${pos.x}px, ${pos.y - LIFT}px) scale(${scale})`,
              transition: drag.current
                ? "none"
                : "transform 250ms cubic-bezier(0.2, 0.7, 0.2, 1)",
            }}
          >
            <img
              src={src}
              alt={alt}
              draggable={false}
              onLoad={(e) => {
                const n = {
                  w: e.currentTarget.naturalWidth,
                  h: e.currentTarget.naturalHeight,
                };
                sizeCache.set(src, n);
                setNatural(n);
              }}
              className="block select-none"
              style={size ?? { maxHeight: "60vh", maxWidth: "88vw" }}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 bg-slate px-3 py-2.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)] ring-1 ring-porcelain/25 md:bottom-8">
        <button
          type="button"
          aria-label="Zoom out"
          className={btn}
          disabled={scale <= MIN}
          onClick={() => zoomTo(scale / 1.6)}
        >
          −
        </button>
        <span className="w-20 text-center text-lg font-semibold tabular-nums tracking-wide text-porcelain">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          aria-label="Zoom in"
          className={btn}
          disabled={scale >= MAX}
          onClick={() => zoomTo(scale * 1.6)}
        >
          +
        </button>
        <button
          type="button"
          onClick={() => zoomTo(1)}
          disabled={scale === 1}
          className="ml-2 h-9 cursor-pointer border border-porcelain/40 px-4 text-xs uppercase tracking-[0.2em] text-porcelain transition-colors hover:bg-porcelain hover:text-slate disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-porcelain"
        >
          Reset
        </button>
      </div>
    </>
  );
}
