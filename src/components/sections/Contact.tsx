import { useScrollReveal } from "@/hooks/useScrollReveal";
import { socials } from "@/data/content";

export default function Contact() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-28">
      <div ref={ref} className="rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center">
        <p className="font-mono text-sm text-accent">Contact</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          Let&apos;s build something.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-zinc-400">
          Open to new opportunities and collaborations. Reach out through any
          of the channels below.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-zinc-100 transition-colors hover:border-accent hover:text-accent"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
