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
      {/* Always mounted so it can slide shut as well as open. */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out md:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        <ul id="mobile-nav" className="overflow-hidden bg-powder px-6">
          {nav.map((n) => (
            <li key={n.to}>
              <Link to={n.to} onClick={() => setOpen(false)} className="block py-3 font-display text-3xl">
                {n.label}
              </Link>
            </li>
          ))}
          <li className="pb-8" aria-hidden />
        </ul>
      </div>
    </header>
  );
}

export function Footer() {
  const label = "mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-sky";
  return (
    <footer className="bg-slate px-6 pb-10 pt-20 text-porcelain">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="font-display text-4xl md:text-5xl">{studio.name}</p>
            <p className="mt-4 max-w-sm text-sky">{studio.tagline}</p>
          </div>
          <div>
            <p className={label}>Explore</p>
            <ul className="space-y-3">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="nav-link text-xs font-medium uppercase tracking-[0.2em]">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={label}>Contact</p>
            {studio.contactLive ? (
              <div className="space-y-2">
                <p className="font-display text-2xl">{studio.contactName}</p>
                <a href={`mailto:${studio.email}`} className="block text-sky transition-colors hover:text-porcelain">
                  {studio.email}
                </a>
                <a
                  href={`tel:${studio.phone.replace(/\s/g, "")}`}
                  className="block text-sky transition-colors hover:text-porcelain"
                >
                  {studio.phone}
                </a>
              </div>
            ) : (
              <p className="text-sky">Contact details coming soon</p>
            )}
          </div>
        </div>
        <p className="mt-16 border-t border-sky/25 pt-6 text-[11px] uppercase tracking-[0.2em] text-sky/70">
          © {new Date().getFullYear()} {studio.name}
        </p>
      </div>
    </footer>
  );
}
