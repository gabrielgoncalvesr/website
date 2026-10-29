"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { designs, type DesignId } from "@/lib/designs";

/** Floating picker for the design lab. Keys 1–9, 0 (= 10) and ←/→ switch too. */
export function DesignSwitcher({ current }: { current: DesignId }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(true);

  function pick(id: string) {
    document.cookie = `design=${id}; path=/; max-age=31536000; samesite=lax`;
    start(() => router.refresh());
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target instanceof Element ? e.target : document.body;
      if (e.defaultPrevented || el.closest("input, textarea, [contenteditable], [data-keys]") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const i = designs.findIndex((d) => d.id === current);
        const next = designs[(i + (e.key === "ArrowRight" ? 1 : -1) + designs.length) % designs.length];
        pick(next.id);
        return;
      }
      const id = e.key === "0" ? "10" : e.key;
      if (designs.some((d) => d.id === id)) pick(id);
    }
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const active = designs.find((d) => d.id === current)!;
  return (
    <div className="lab-switch" data-open={open} data-pending={pending}>
      <button type="button" className="lab-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Design lab">
        {open ? "×" : "◐"}
      </button>
      {open && (
        <>
          <span className="lab-label">
            <b>{active.name}</b>
            <span>{active.hint}</span>
          </span>
          <div className="lab-buttons" role="group" aria-label="Design">
            {designs.map((d) => (
              <button key={d.id} type="button" aria-pressed={d.id === current} onClick={() => pick(d.id)} title={d.name}>
                {d.id}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
