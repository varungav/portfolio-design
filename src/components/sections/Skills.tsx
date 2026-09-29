import { useStaggerReveal } from "@/hooks/useScrollReveal";
import { skills } from "@/data/content";

export default function Skills() {
  const ref = useStaggerReveal<HTMLDivElement>(".skill-card");

  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-28">
      <p className="font-mono text-sm text-accent">Skills</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
        Tools I build with
      </h2>

      <div ref={ref} className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {skills.map((group) => (
          <div
            key={group.category}
            className="skill-card rounded-2xl border border-white/10 bg-white/[0.02] p-6"
          >
            <h3 className="text-sm font-medium text-zinc-100">
              {group.category}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
