import { useEffect } from "react";
import { studio } from "@/data/studio";

function setMeta(selector: string, content: string) {
  document.head.querySelector(selector)?.setAttribute("content", content);
}

export function useSeo(title: string, description: string) {
  useEffect(() => {
    const full = `${title} — ${studio.name}`;
    document.title = full;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', full);
    setMeta('meta[property="og:description"]', description);
  }, [title, description]);
}
