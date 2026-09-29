import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function About() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-28">
      <div ref={ref} className="max-w-2xl">
        <p className="font-mono text-sm text-accent">About</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          I turn interfaces into experiences.
        </h2>
        <p className="mt-6 text-zinc-400">
          Replace this with a short bio — your background, what you focus on
          (e.g. building performant React/TypeScript apps with Tailwind, and
          layering in Next.js and motion where it adds value), and what kind
          of work you&apos;re looking for next.
        </p>
      </div>
    </section>
  );
}
