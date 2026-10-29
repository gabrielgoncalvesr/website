"use client";

import { useState } from "react";
import { useChip } from "./chip";

type Item = { name: string; icon?: string; glyph?: string };

/** A closed chest; opening it spills the stack out one item at a time. */
export function Chest({ items, labels }: { items: Item[]; labels: { open: string; opened: string } }) {
  const [open, setOpen] = useState(false);
  const chip = useChip();

  function toggle() {
    if (!open) chip.chest();
    setOpen(!open);
  }

  return (
    <div className={`d18b-chest-wrap ${open ? "is-open" : ""}`}>
      <button type="button" className="d18b-chest" onClick={toggle} aria-expanded={open}>
        <span className="d18b-chest-lid" aria-hidden />
        <span className="d18b-chest-base" aria-hidden>
          <span className="d18b-chest-lock" />
        </span>
        <span className="d18b-chest-say">{open ? labels.opened : labels.open}</span>
      </button>
      <ul className="d18b-loot" hidden={!open}>
        {items.map((it, i) => (
          <li key={it.name} style={{ "--i": i } as React.CSSProperties}>
            <span className="d18b-slot">
              {it.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.icon} alt="" width={28} height={28} />
              ) : (
                <span aria-hidden>{it.glyph}</span>
              )}
            </span>
            <span className="d18b-slot-name">{it.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
