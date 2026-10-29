"use client";

import { useEffect, useRef, useState } from "react";

type Sticker = { label: string; x: number; y: number; r: number; tone: number };

/** Stack stickers you can drag around the hero. Positions are percentages of the board. */
export function Stickers({ items }: { items: Sticker[] }) {
  const [pos, setPos] = useState(items);
  const [top, setTop] = useState<number | null>(null);
  const board = useRef<HTMLDivElement>(null);
  const drag = useRef<{ i: number; dx: number; dy: number } | null>(null);

  function down(e: React.PointerEvent<HTMLButtonElement>, i: number) {
    const b = board.current!.getBoundingClientRect();
    const p = pos[i];
    drag.current = { i, dx: e.clientX - (b.left + (p.x / 100) * b.width), dy: e.clientY - (b.top + (p.y / 100) * b.height) };
    e.currentTarget.setPointerCapture(e.pointerId);
    setTop(i);
  }
  function move(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const b = board.current!.getBoundingClientRect();
    const x = ((e.clientX - d.dx - b.left) / b.width) * 100;
    const y = ((e.clientY - d.dy - b.top) / b.height) * 100;
    setPos((ps) => ps.map((p, j) => (j === d.i ? { ...p, x: clamp(x, -2, 96), y: clamp(y, -4, 96) } : p)));
  }
  function up() {
    drag.current = null;
  }

  return (
    <div className="d4b-board" ref={board} aria-hidden>
      {pos.map((p, i) => (
        <button
          key={p.label}
          type="button"
          tabIndex={-1}
          className={`d4b-sticker tone-${p.tone}`}
          style={{ left: `${p.x}%`, top: `${p.y}%`, rotate: `${p.r}deg`, zIndex: top === i ? 3 : 1 }}
          onPointerDown={(e) => down(e, i)}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}

type Log = { id: number; text: string; kind: "ok" | "fail" | "replay" };
type Flight = { n: number; leg: "out" | "lost" | "retry" };

const FAIL_RATE = 0.3;

/**
 * One button, real-world odds: most payments go through, some lose the response on the way back.
 * The client retries with the same idempotency key and the api answers from what it stored,
 * so the ledger is written once no matter what.
 */
export function PaymentToy({ locale }: { locale: "en" | "pt-br" }) {
  const en = locale === "en";
  const [log, setLog] = useState<Log[]>([]);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [stats, setStats] = useState({ sent: 0, retries: 0 });
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const n = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function later(ms: number, fn: () => void) {
    timers.current.push(setTimeout(fn, ms));
  }
  function push(kind: Log["kind"], text: string) {
    n.current += 1;
    const id = n.current;
    setLog((l) => [{ id, kind, text }, ...l].slice(0, 3));
  }

  function pay() {
    if (inFlight.current) return;
    inFlight.current = true;
    const key = newKey();
    const lost = Math.random() < FAIL_RATE;
    setBusy(true);
    setStats((s) => ({ ...s, sent: s.sent + 1 }));
    setFlight({ n: n.current + 1, leg: "out" });
    if (!lost) {
      later(950, () => {
        push("ok", `POST /payments key=${key} → 201 ${en ? "created" : "criado"}`);
        inFlight.current = false;
        setBusy(false);
      });
      return;
    }
    later(1000, () => {
      setFlight({ n: n.current + 1, leg: "lost" });
      push("fail", `POST /payments key=${key} → ${en ? "timeout, response lost" : "timeout, resposta perdida"}`);
    });
    later(1900, () => {
      setFlight({ n: n.current + 1, leg: "retry" });
      setStats((s) => ({ ...s, retries: s.retries + 1 }));
    });
    later(2900, () => {
      push("replay", `retry key=${key} → 200 ${en ? "already done" : "já processado"}`);
      inFlight.current = false;
      setBusy(false);
    });
  }

  const f = flight;
  return (
    <div className="d4b-toy">
      <div className="d4b-toy-head">
        <p className="d4b-toy-title">{en ? "Pay something." : "Faça um pagamento."}</p>
        <p className="d4b-toy-sub">
          {en
            ? "Networks drop responses. When that happens the client retries with the same idempotency key, and the ledger still moves once. That's most of my job."
            : "Redes perdem respostas. Quando acontece, o cliente tenta de novo com a mesma chave de idempotência, e o ledger continua mudando uma vez só. É boa parte do meu trabalho."}
        </p>
      </div>
      <div className="d4b-pipe" aria-hidden>
        <span className="d4b-node tone-1">client</span>
        <span className="d4b-wire">
          {f?.leg === "out" && <i key={`a${f.n}`} className="d4b-coin" />}
          {f?.leg === "lost" && (
            <b key={`x${f.n}`} className="d4b-lost">
              ✕
            </b>
          )}
          {f?.leg === "retry" && <i key={`r${f.n}`} className="d4b-coin" />}
          {f?.leg === "retry" && <i key={`rb${f.n}`} className="d4b-coin is-back" />}
        </span>
        <span className="d4b-node tone-2">
          api
          {f?.leg === "retry" && (
            <b key={`c${f.n}`} className="d4b-cached">
              {en ? "seen this key" : "chave já vista"}
            </b>
          )}
        </span>
        <span className="d4b-wire">{f?.leg === "out" && <i key={`b${f.n}`} className="d4b-coin is-late" />}</span>
        <span className="d4b-node tone-3">ledger</span>
      </div>
      <div className="d4b-toy-actions">
        <button type="button" className="d4b-btn is-primary" onClick={pay} disabled={busy}>
          {busy ? (en ? "Sending…" : "Enviando…") : en ? "Pay" : "Pagar"}
        </button>
        <span className="d4b-stats">
          {stats.sent} {en ? "sent" : "enviados"} · {stats.retries} {en ? "retried" : "retentados"} · <b>0</b> {en ? "double charges" : "cobranças duplas"}
        </span>
      </div>
      <ol className="d4b-log" aria-live="polite">
        {log.length === 0 && <li className="is-idle">{en ? "waiting for the first payment…" : "esperando o primeiro pagamento…"}</li>}
        {log.map((l) => (
          <li key={l.id} className={`is-${l.kind}`}>
            {l.text}
          </li>
        ))}
      </ol>
    </div>
  );
}

function newKey() {
  return Math.random().toString(36).slice(2, 8);
}
