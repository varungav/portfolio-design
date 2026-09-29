import { Suspense, lazy, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const HeroCanvas = lazy(() => import("@/components/canvas/HeroCanvas"));

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          ".hero-eyebrow",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
        )
        .fromTo(
          ".hero-title",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.8 },
          "-=0.3",
        )
        .fromTo(
          ".hero-subtitle",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          "-=0.4",
        )
        .fromTo(
          ".hero-cta",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          "-=0.4",
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 sm:grid-cols-2">
        <div>
          <p className="hero-eyebrow font-mono text-sm text-accent">
            Full-stack Developer
          </p>
          <h1 className="hero-title mt-4 text-5xl font-semibold tracking-tight text-zinc-50 sm:text-6xl">
            Building premium,
            <br /> interactive web experiences.
          </h1>
          <p className="hero-subtitle mt-6 max-w-md text-lg text-zinc-400">
            I design and build responsive interfaces with React and
            TypeScript — layered with scroll-driven motion and 3D detail
            where it earns its place.
          </p>
          <div className="hero-cta mt-8 flex gap-4">
            <a
              href="#projects"
              className="rounded-full bg-zinc-50 px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
            >
              View Work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-zinc-100 transition-colors hover:border-accent hover:text-accent"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
