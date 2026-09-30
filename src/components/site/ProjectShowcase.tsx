import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Photo } from "@/components/site/ui";
import { projectProcess, type Project } from "@/data/studio";
import { gsap } from "@/lib/gsap";

const ModelCanvas = lazy(() => import("@/components/canvas/ModelPreviewCanvas"));

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
        scrollTrigger: { trigger: root, start: "top 85%", toggleActions: "play none none reverse" },
      });
      tl.fromTo(text, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }).fromTo(
        image,
        { autoAlpha: 0, scale: 1.06 },
        { autoAlpha: 1, scale: 1, duration: 1, ease: "power3.out" },
        "-=0.5",
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex items-center overflow-hidden">
      <button
        type="button"
        onClick={toggle}
        className="block shrink-0 grow-0 cursor-pointer text-left"
        style={{ flexBasis: open ? "42%" : "100%", transition: `flex-basis 800ms ${EASE}` }}
      >
        <div className={open ? "" : "mx-auto max-w-md text-center"}>
          <div ref={textRef}>
            <h3 className="font-display text-3xl md:text-4xl">{project.title}</h3>
            {project.tagline && <p className="mt-3 text-stone">{project.tagline}</p>}
          </div>
          <div ref={imageRef} className="mt-6">
            <Photo
              src={project.image}
              label={project.title}
              ratio="4/5"
              fit={project.imageFit ?? "cover"}
              className={open ? "" : "mx-auto max-w-xs"}
            />
            {project.caption && <p className="mt-3 text-xs uppercase tracking-[0.2em] text-stone">{project.caption}</p>}
          </div>
          {open && (
            <dl className="mt-8 grid grid-cols-1 gap-6 border-t border-sky/60 pt-6 sm:grid-cols-3">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-stone">Scope</dt>
                <dd className="mt-1.5 text-sm text-slate">{scope}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-stone">Tools</dt>
                <dd className="mt-1.5 text-sm text-slate">{tools}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-stone">Delivered</dt>
                <dd className="mt-1.5 text-sm text-slate">{delivered}</dd>
              </div>
            </dl>
          )}
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-stone">
            {open ? "× Close" : "Click to know more →"}
          </p>
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
      </div>
    </div>
  );
}
