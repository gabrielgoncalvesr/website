"use client";

import { useEffect, useState } from "react";

// Temporary: lets us try accent colours across the whole site. Remove once one is picked.
export const accents = [
  { id: "moss", label: "Moss" },
  { id: "cobalt", label: "Cobalt" },
  { id: "terracotta", label: "Terracotta" },
  { id: "plum", label: "Plum" },
  { id: "ochre", label: "Ochre" },
  { id: "teal", label: "Teal" },
  { id: "crimson", label: "Crimson" },
  { id: "ink", label: "Ink" },
] as const;

export const accentScript = `(()=>{try{const a=localStorage.getItem("accent");if(a)document.documentElement.dataset.accent=a}catch{}})()`;

export function AccentPicker() {
  const [current, setCurrent] = useState<string>("moss");
  useEffect(() => setCurrent(document.documentElement.dataset.accent ?? "moss"), []);

  function pick(id: string) {
    document.documentElement.dataset.accent = id;
    setCurrent(id);
    try {
      localStorage.setItem("accent", id);
    } catch {}
  }

  return (
    <div className="accent-picker" role="radiogroup" aria-label="Accent colour">
      {accents.map((a) => (
        <button
          key={a.id}
          type="button"
          role="radio"
          aria-checked={current === a.id}
          title={a.label}
          data-swatch={a.id}
          onClick={() => pick(a.id)}
        >
          <span className="sr-only">{a.label}</span>
        </button>
      ))}
      <span className="accent-name">{accents.find((a) => a.id === current)?.label}</span>
    </div>
  );
}
