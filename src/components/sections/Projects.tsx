import { useStaggerReveal } from "@/hooks/useScrollReveal";
import { projects } from "@/data/content";

export default function Projects() {
  const ref = useStaggerReveal<HTMLDivElement>(".project-card");

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-28">
      <p className="font-mono text-sm text-accent">Projects</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
        Selected work
      </h2>

      <div ref={ref} className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.href}
            className="project-card group flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-accent/50"
          >
            <h3 className="text-lg font-medium text-zinc-50 transition-colors group-hover:text-accent">
              {project.title}
            </h3>
            <p className="mt-3 flex-1 text-sm text-zinc-400">
              {project.description}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </a>
        ))}
      </div>
    </section>
  );
}
