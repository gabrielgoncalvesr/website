"use client";

import { useState } from "react";

type Option = { label: string; href?: string; reply?: string };

/** JRPG battle menu: links jump to sections, RUN just refuses. */
export function RpgMenu({ intro, options }: { intro: string; options: Option[] }) {
  const [line, setLine] = useState(intro);
  return (
    <div className="d18b-dialog">
      <p className="d18b-dialog-text" key={line}>
        {line}
      </p>
      <ul className="d18b-menu">
        {options.map((o) => (
          <li key={o.label}>
            {o.href ? (
              <a href={o.href}>{o.label}</a>
            ) : (
              <button type="button" onClick={() => setLine(o.reply ?? "")}>
                {o.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
