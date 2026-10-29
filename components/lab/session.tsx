"use client";

import { useEffect, useRef } from "react";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Plays a shell session in order: each `[data-step]` types its `[data-cmd]`, then prints its
 * `[data-ln]` lines one by one, and only then hands over to the next step. A step is queued once
 * it scrolls into view; steps the reader already scrolled past play fast to catch up.
 */
export function Session({
  children,
  className,
  start = 0,
  gap = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** ms before the first command starts typing */
  start?: number;
  /** ms of idle prompt between steps (skipped while catching up) */
  gap?: number;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const steps = [...el.querySelectorAll<HTMLElement>("[data-step]")];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      steps.forEach((s) => mark(s, "done"));
      return;
    }

    let target = -1;
    let cur = 0;
    let busy = false;
    let dead = false;

    /** Mirrors a step's state onto anything that points at it with `data-step-ref`. */
    function mark(step: HTMLElement, state: string) {
      step.setAttribute("data-step", state);
      el!.querySelectorAll(`[data-step-ref="${steps.indexOf(step)}"]`).forEach((r) => r.setAttribute("data-state", state));
    }

    async function play(step: HTMLElement, fast: boolean) {
      mark(step, "typing");
      const cmd = step.querySelector<HTMLElement>("[data-cmd]");
      const n = cmd?.textContent?.length ?? 0;
      for (let c = 0; c <= n && !dead; c++) {
        cmd?.style.setProperty("--c", String(c));
        await wait(fast ? 6 : 38 + Math.random() * 40);
      }
      await wait(fast ? 20 : 260);
      mark(step, "printing");
      for (const ln of step.querySelectorAll<HTMLElement>("[data-ln]")) {
        if (dead) return;
        ln.classList.add("is-on");
        await wait(fast ? 8 : 70);
      }
      mark(step, "done");
    }

    async function pump() {
      if (busy) return;
      busy = true;
      while (cur <= target && !dead) {
        const fast = cur < target;
        if (!fast) await wait(cur === 0 ? start : gap);
        await play(steps[cur], cur < target);
        cur++;
      }
      busy = false;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          target = Math.max(target, steps.indexOf(e.target as HTMLElement));
          io.unobserve(e.target);
        }
        pump();
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    steps.forEach((s) => {
      mark(s, "wait");
      io.observe(s);
    });
    return () => {
      dead = true;
      io.disconnect();
    };
  }, [start, gap]);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
