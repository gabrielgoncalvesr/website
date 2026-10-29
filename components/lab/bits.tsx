"use client";

import { useEffect, useRef, useState } from "react";

/** Live São Paulo time; renders a placeholder until mounted to keep hydration stable. */
export function Clock({ withZone = true }: { withZone?: boolean }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span suppressHydrationWarning>
      {now ?? "--:--"}
      {withZone && " GMT-3"}
    </span>
  );
}

/** Sets `--p` (0→1) on the element as it travels through the viewport. */
export function ScrollProgress({
  className,
  children,
  as: Tag = "div",
  mode = "pin",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section";
  /** pin: 0→1 while a tall element scrolls under the viewport. pass: 0 when it enters, 1 when it leaves. */
  mode?: "pin" | "pass";
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - innerHeight;
      const p = mode === "pass" ? (innerHeight - r.top) / (innerHeight + r.height) : span > 0 ? -r.top / span : 1 - r.top / innerHeight;
      el.style.setProperty("--p", String(Math.min(1, Math.max(0, p))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [mode]);
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
