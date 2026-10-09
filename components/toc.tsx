"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/content";

export function Toc({ headings, label }: { headings: Heading[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;
  return (
    <nav className="toc" aria-label={label}>
      <p className="toc-label">{label}</p>
      <ol>
        {headings.map((h) => (
          <li key={h.id} data-depth={h.depth}>
            <a href={`#${h.id}`} aria-current={active === h.id ? "true" : undefined}>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
