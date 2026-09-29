const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="font-mono text-sm tracking-tight text-zinc-100">
          varun<span className="text-accent">.</span>dev
        </a>
        <ul className="hidden gap-8 text-sm text-zinc-400 sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="transition-colors hover:text-zinc-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-zinc-100 transition-colors hover:border-accent hover:text-accent"
        >
          Let&apos;s talk
        </a>
      </nav>
    </header>
  );
}
