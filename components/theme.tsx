"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useLayoutEffect } from "react";

export type Theme = "light" | "dark";

function save(t: Theme) {
  document.cookie = `theme=${t}; path=/; max-age=31536000; samesite=lax`;
  try {
    localStorage.setItem("theme", t);
  } catch {}
}

/**
 * The server renders `data-theme` from the `theme` cookie, so no inline script is needed.
 * This only migrates a theme saved in localStorage before the cookie existed.
 */
export function ThemeSync() {
  useLayoutEffect(() => {
    if (document.cookie.includes("theme=")) return;
    try {
      const t = localStorage.getItem("theme");
      if (t === "light" || t === "dark") {
        document.documentElement.dataset.theme = t;
        save(t);
      }
    } catch {}
  }, []);
  return null;
}

export function ThemeToggle({ label }: { label: string }) {
  function toggle() {
    const root = document.documentElement;
    const current =
      root.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    save(next);
  }
  return (
    <button type="button" onClick={toggle} aria-label={label} title={label} className="icon-button">
      <Sun className="theme-icon-light" size={16} weight="regular" />
      <Moon className="theme-icon-dark" size={16} weight="regular" />
    </button>
  );
}
