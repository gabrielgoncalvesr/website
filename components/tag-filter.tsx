"use client";

import { useEffect, useState } from "react";

/** Filters sibling `[data-tags]` cards inside `scopeId` without re-rendering the server list. */
export function TagFilter({ tags, allLabel, scopeId }: { tags: string[]; allLabel: string; scopeId: string }) {
  const [active, setActive] = useState<string | null>(null);

  function pick(tag: string | null) {
    setActive(tag);
    document.querySelectorAll<HTMLElement>(`#${scopeId} [data-tags]`).forEach((el) => {
      const show = !tag || el.dataset.tags!.split(" ").includes(tag);
      el.closest("li")!.hidden = !show;
    });
  }

  // Deep link: /notes?tag=go
  useEffect(() => {
    const t = new URLSearchParams(location.search).get("tag");
    if (t && tags.includes(t)) pick(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tag-filter" role="toolbar">
      {[null, ...tags].map((t) => (
        <button key={t ?? "*"} type="button" aria-pressed={active === t} onClick={() => pick(t)} className="tag">
          {t ? `#${t}` : allLabel}
        </button>
      ))}
    </div>
  );
}
