import { useEffect, useState, type AnchorHTMLAttributes } from "react";

// Minimal hash router (no dependency): routes look like "#/work/project-one".
const read = () => window.location.hash.replace(/^#/, "") || "/";

export function usePath() {
  const [path, setPath] = useState(read);
  useEffect(() => {
    const onChange = () => {
      setPath(read());
      window.scrollTo(0, 0);
      document.getElementById("main")?.focus({ preventScroll: true });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return path;
}

export function Link({
  to,
  ...rest
}: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={`#${to}`} {...rest} />;
}
