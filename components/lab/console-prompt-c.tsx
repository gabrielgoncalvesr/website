"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Item = { title: string; href: string; file: string };
type Line = { kind: "in" | "out" | "err"; text: string };

type Props = {
  locale: "en" | "pt-br";
  posts: Item[];
  notes: Item[];
  github: string;
};

const help = {
  en: [
    "help              this list",
    "ls [writing|notes] list files",
    "open <n>          open the n-th file from the last ls",
    "cd <writing|notes|about|~>",
    "whoami            short bio",
    "theme             toggle light/dark",
    "github            open GitHub",
    "clear             clear the screen",
  ],
  "pt-br": [
    "help              esta lista",
    "ls [writing|notes] lista arquivos",
    "open <n>          abre o n-ésimo arquivo do último ls",
    "cd <writing|notes|about|~>",
    "whoami            bio curta",
    "theme             alterna claro/escuro",
    "github            abre o GitHub",
    "clear             limpa a tela",
  ],
};

/** A tiny fake shell. Navigation only; nothing leaves the browser. */
export function ConsolePrompt({ locale, posts, notes, github }: Props) {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: locale === "en" ? "type `help` and press enter." : "digite `help` e aperte enter." },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const last = useRef<Item[]>(posts);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = box.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function out(...text: string[]) {
    return text.map((t) => ({ kind: "out" as const, text: t }));
  }

  function run(raw: string): Line[] {
    const [cmd = "", ...args] = raw.trim().split(/\s+/);
    const arg = args.join(" ");
    const base = `/${locale}`;
    switch (cmd) {
      case "":
        return [];
      case "help":
        return out(...help[locale]);
      case "ls": {
        const list = arg.startsWith("n") ? notes : posts;
        last.current = list;
        return out(...list.slice(0, 12).map((p, i) => `${String(i + 1).padStart(2)}  ${p.file}`));
      }
      case "open": {
        const n = Number(arg);
        const item = last.current[n - 1];
        if (!item) return [{ kind: "err", text: `open: ${arg || "?"}: no such file` }];
        router.push(item.href);
        return out(`opening ${item.file}…`);
      }
      case "cd": {
        const dest = arg.replace(/\/$/, "");
        const map: Record<string, string> = { "~": base, "": base, writing: `${base}/writing`, notes: `${base}/writing`, about: `${base}/about` };
        if (!(dest in map)) return [{ kind: "err", text: `cd: ${dest}: no such directory` }];
        router.push(map[dest]);
        return [];
      }
      case "whoami":
        return out(
          locale === "en"
            ? "gabriel — senior backend engineer. payments, cards, go, postgres. são paulo."
            : "gabriel — engenheiro backend sênior. pagamentos, cartões, go, postgres. são paulo.",
        );
      case "theme": {
        const root = document.documentElement;
        const cur = root.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        const next = cur === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {}
        return out(`theme=${next}`);
      }
      case "github":
        window.open(github, "_blank", "noreferrer");
        return out(github);
      case "sudo":
        return [{ kind: "err", text: "gabriel is not in the sudoers file. This incident will be reported." }];
      case "rm":
        return [{ kind: "err", text: "rm: refusing to run without an idempotency key" }];
      case "exit":
        return out("there is no exit. only more backend.");
      default:
        return [{ kind: "err", text: `${cmd}: command not found` }];
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim() === "clear") {
      setLines([]);
    } else {
      setLines((l) => [...l, { kind: "in", text: value }, ...run(value)]);
    }
    if (value.trim()) setHistory((h) => [value, ...h]);
    setHi(-1);
    setValue("");
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowUp" && history[hi + 1] !== undefined) {
      e.preventDefault();
      setHi(hi + 1);
      setValue(history[hi + 1]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = hi - 1;
      setHi(Math.max(-1, n));
      setValue(n >= 0 ? history[n] : "");
    }
  }

  return (
    <div className="d2c-shell" onClick={() => input.current?.focus({ preventScroll: true })}>
      <div className="d2c-shell-lines" aria-live="polite" ref={box}>
        {lines.map((l, i) => (
          <p key={i} className={`d2c-line is-${l.kind}`}>
            {l.kind === "in" && <span className="d2c-ps1">~ $ </span>}
            {l.text}
          </p>
        ))}
      </div>
      <form onSubmit={submit} className="d2c-shell-form">
        <label htmlFor="d2c-input" className="d2c-ps1">
          ~ $
        </label>
        <input
          id="d2c-input"
          ref={input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label={locale === "en" ? "Command" : "Comando"}
        />
      </form>
    </div>
  );
}
