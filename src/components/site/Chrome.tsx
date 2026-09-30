import { useState } from "react";
import { Link } from "@/lib/router";
import { nav, studio } from "@/data/studio";

export function Header({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const active = (to: string) => path === to || path.startsWith(`${to}/`);
  return (
    <header className="sticky top-0 z-50 bg-powder/90 backdrop-blur">
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-slate focus:px-4 focus:py-2 focus:text-porcelain"
      >
        Skip to content
      </a>
      <nav aria-label="Primary" className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-2xl tracking-tight text-slate">
          {studio.name}
        </Link>
        <ul className="nav-list hidden gap-10 md:flex">
          {nav.map((n) => (
            <li key={n.to}>
              <Link
                to={n.to}
                aria-current={active(n.to) ? "page" : undefined}
                className="nav-link text-xs font-medium uppercase tracking-[0.2em]"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          className="cursor-pointer text-xs font-medium uppercase tracking-[0.2em] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>
      {open && (
        <ul id="mobile-nav" className="bg-powder px-6 pb-8 md:hidden">
          {nav.map((n) => (
            <li key={n.to}>
              <Link
                to={n.to}
                onClick={() => setOpen(false)}
                className="block py-3 font-display text-3xl"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate px-6 py-20 text-porcelain">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl">{studio.name}</p>
          <p className="mt-4 max-w-sm text-sm text-sky">{studio.tagline}</p>
        </div>
        <ul className="space-y-2 text-sm">
          {nav.map((n) => (
            <li key={n.to}>
              <Link to={n.to} className="hover:text-sky">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="text-sm text-sky">
          <a href={`mailto:${studio.email}`} className="hover:text-porcelain">
            {studio.email}
          </a>
          <p className="mt-2">{studio.location}</p>
        </div>
      </div>
      <p className="mx-auto mt-16 max-w-7xl text-xs text-sky/70">
        © {new Date().getFullYear()} {studio.name}
      </p>
    </footer>
  );
}
