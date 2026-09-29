export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-8 text-center text-xs text-zinc-500">
      © {new Date().getFullYear()} Varun Gavoor. Built with Next.js, Tailwind CSS, GSAP and React Three Fiber.
    </footer>
  );
}
