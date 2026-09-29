import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface Options {
  y?: number;
  duration?: number;
  delay?: number;
  start?: string;
}

export function useScrollReveal<T extends HTMLElement>({
  y = 40,
  duration = 0.9,
  delay = 0,
  start = "top 80%",
}: Options = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none reverse",
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [y, duration, delay, start]);

  return ref;
}

export function useStaggerReveal<T extends HTMLElement>(
  selector: string,
  options: Options = {},
) {
  const ref = useRef<T | null>(null);
  const { y = 30, duration = 0.7, start = "top 80%" } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll(selector);
      gsap.fromTo(
        items,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none reverse",
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [selector, y, duration, start]);

  return ref;
}

export { ScrollTrigger };
