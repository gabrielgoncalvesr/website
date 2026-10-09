"use client";

import { Moon, Sun } from "@phosphor-icons/react";

export const themeScript = `(()=>{try{const t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch{}})()`;

export function ThemeToggle({ label }: { label: string }) {
  function toggle() {
    const root = document.documentElement;
    const current =
      root.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }
  return (
    <button type="button" onClick={toggle} aria-label={label} title={label} className="icon-button">
      <Sun className="theme-icon-light" size={16} weight="regular" />
      <Moon className="theme-icon-dark" size={16} weight="regular" />
    </button>
  );
}
