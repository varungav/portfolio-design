import { lazy, Suspense, useState } from "react";
import { Link } from "@/lib/router";
import { useSeo } from "@/lib/seo";
import { collections, projects, services, studio, testimonials } from "@/data/studio";
import { Eyebrow, Photo, Reveal, Section } from "@/components/site/ui";
import { ProjectShowcase } from "@/components/site/ProjectShowcase";

function PageHead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="bg-powder px-6 pb-20 pt-24 md:pb-28 md:pt-32">
      <div className="mx-auto max-w-7xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="max-w-4xl text-5xl md:text-8xl">{title}</h1>
        {intro && <p className="mt-8 max-w-xl text-stone">{intro}</p>}
      </div>
    </div>
  );
}

function ProjectCard({ p, tall }: { p: (typeof projects)[number]; tall?: boolean }) {
  return (
    <Link to={`/work/${p.slug}`} className="group block">
      <Photo src={p.image} label={p.title} ratio={tall ? "4/5" : "5/4"} fit={p.imageFit ?? "cover"} />
      <div className="mt-5 flex items-baseline justify-between">
        <h3 className="text-3xl">{p.title}</h3>
        <span className="text-xs uppercase tracking-[0.2em] text-stone">{p.category}</span>
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone">Click to know more →</p>
    </Link>
  );
}

import BrandWall from "@/components/site/BrandWall";
import Profile from "@/components/site/Profile";

const PhotoTour = lazy(() => import("@/components/site/PhotoTour"));

export function Home() {
  useSeo("Furniture & Interior Design", studio.tagline);
  return (
    <>
      <h1 className="sr-only">{studio.name} — {studio.tagline}</h1>
      <Suspense fallback={null}>
        <PhotoTour />
      </Suspense>

      <Section>
        <Reveal>
          <p className="mx-auto max-w-3xl text-center font-display text-3xl leading-snug md:text-5xl">
            Editorial statement to be supplied by the client.
          </p>
        </Reveal>
      </Section>

      <Section tone="mist">
        <div className="mb-14 flex items-end justify-between">
          <h2 className="text-4xl md:text-6xl">Projects</h2>
          <Link to="/work" className="text-xs uppercase tracking-[0.2em] underline underline-offset-8">All projects</Link>
        </div>
        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
          {projects.slice(0, 2).map((p, i) => (
            <Reveal key={p.slug} className={i === 1 ? "md:mt-24" : ""}>
              <ProjectCard p={p} tall />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="mb-14 text-4xl md:text-6xl">Portfolio</h2>
        <div className="grid gap-10 md:grid-cols-3">
          {collections.map((c) => (
            <Reveal key={c.slug}>
              <Link to="/collections" className="group block">
                <Photo src={c.image} label={c.name} />
                <h3 className="mt-5 text-2xl">{c.name}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {testimonials.length > 0 && (
        <Section tone="mist">
          {testimonials.map((t) => (
            <blockquote key={t.author} className="mx-auto max-w-3xl text-center">
              <p className="font-display text-3xl italic md:text-5xl">“{t.quote}”</p>
              <footer className="mt-6 text-xs uppercase tracking-[0.2em] text-stone">{t.author}</footer>
            </blockquote>
          ))}
        </Section>
      )}

      <Section tone="slate">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl text-4xl md:text-6xl">Tell us about your space.</h2>
          <Link
            to="/contact"
            className="bg-porcelain px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-slate transition-colors hover:bg-sky"
          >
            Get in touch
          </Link>
        </div>
      </Section>
    </>
  );
}

export function Work() {
  useSeo("Projects", "Selected furniture and interior projects.");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const toggle = (slug: string) => setOpenSlug((cur) => (cur === slug ? null : slug));

  return (
    <Section className="pt-24 md:pt-32" tight>
      <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
        <div className="flex flex-col justify-start">
          <Eyebrow>Featured Project</Eyebrow>
          <h1 className="text-6xl md:text-8xl">Projects</h1>
          <p className="mt-6 max-w-sm text-xl text-stone">Production-ready detail: no revisions, no delays.</p>
        </div>
        {projects.map((p) => (
          <div key={p.slug} className={openSlug === p.slug ? "md:col-span-2" : ""}>
            <ProjectShowcase project={p} open={openSlug === p.slug} onToggle={() => toggle(p.slug)} />
          </div>
        ))}
      </div>
    </Section>
  );
}

export function ProjectDetail({ slug }: { slug: string }) {
  const p = projects.find((x) => x.slug === slug);
  useSeo(p?.title ?? "Project not found", p?.summary ?? "This project could not be found.");
  if (!p) {
    return (
      <Section>
        <h1 className="text-5xl">Project not found</h1>
        <p className="mt-6"><Link to="/work" className="underline underline-offset-8">Back to work</Link></p>
      </Section>
    );
  }
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];
  return (
    <>
      <PageHead eyebrow={`${p.category} · ${p.year}`} title={p.title} intro={p.summary} />
      <Section>
        <div className="grid gap-8">
          <Photo src={p.image} label={`${p.title} — lead`} ratio="16/9" fit={p.imageFit ?? "cover"} />
          <div className="grid gap-8 md:grid-cols-2">
            <Photo label={`${p.title} — detail`} ratio="4/5" />
            <Photo label={`${p.title} — detail`} ratio="4/5" />
          </div>
        </div>
      </Section>
      <Section tone="mist">
        <Eyebrow>Next project</Eyebrow>
        <ProjectShowcase project={next} />
        <p className="mt-10 text-center">
          <Link to={`/work/${next.slug}`} className="text-xs uppercase tracking-[0.2em] underline underline-offset-8">
            View {next.title} project page →
          </Link>
        </p>
      </Section>
    </>
  );
}

export function Collections() {
  useSeo("Portfolio", "Furniture collections.");
  return (
    <>
      <PageHead eyebrow="Furniture" title="Portfolio" intro="Pieces, materials and finishes to be supplied." />
      <Section>
        <div className="grid gap-x-10 gap-y-16 md:grid-cols-3">
          {collections.map((c) => (
            <Reveal key={c.slug}>
              <div className="group bg-porcelain">
                <Photo src={c.image} label={c.name} />
                <h2 className="mt-5 text-3xl">{c.name}</h2>
                <p className="mt-2 text-sm text-stone">{c.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

export function Services() {
  useSeo("What we offer", "Furniture and interior design services.");
  return (
    <>
      <PageHead eyebrow="Services" title="What we offer" />
      <Section>
        <ul className="divide-y divide-sky">
          {services.map((s, i) => (
            <li key={s.name} className="grid gap-4 py-10 md:grid-cols-[6rem_1fr_1.2fr]">
              <span className="font-display text-2xl text-stone">0{i + 1}</span>
              <h2 className="text-3xl md:text-4xl">{s.name}</h2>
              <p className="text-stone">{s.text}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

export function About() {
  useSeo("About", `About ${studio.name}.`);
  return (
    <>
      <h1 className="sr-only">About</h1>
      <BrandWall />
      <Profile />
    </>
  );
}

export function Contact() {
  useSeo("Contact", "Get in touch to begin a project.");
  const field =
    "mt-2 w-full border-0 border-b border-slate/30 bg-transparent py-3 text-slate placeholder:text-stone/60 focus:border-slate focus:outline-none";
  return (
    <>
      <PageHead eyebrow="Enquiries" title="Contact" />
      <Section>
        <div className="grid gap-16 md:grid-cols-[1fr_1.3fr]">
          <div className="space-y-2 text-stone">
            <a href={`mailto:${studio.email}`} className="block text-slate underline underline-offset-8">
              {studio.email}
            </a>
            <p>{studio.location}</p>
          </div>
          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              const body = `${d.get("message")}\n\n— ${d.get("name")}`;
              window.location.href = `mailto:${studio.email}?subject=Project enquiry&body=${encodeURIComponent(body)}`;
            }}
          >
            <label className="block text-xs uppercase tracking-[0.2em]">
              Name
              <input name="name" required autoComplete="name" className={field} />
            </label>
            <label className="block text-xs uppercase tracking-[0.2em]">
              Email
              <input name="email" type="email" required autoComplete="email" className={field} />
            </label>
            <label className="block text-xs uppercase tracking-[0.2em]">
              Message
              <textarea name="message" rows={5} required className={field} />
            </label>
            <button className="cursor-pointer bg-slate px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-porcelain transition-colors hover:bg-slate/85">
              Send enquiry
            </button>
          </form>
        </div>
      </Section>
    </>
  );
}
