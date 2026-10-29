"use client";

import { useEffect, useRef, useState } from "react";
import { useChip } from "./chip";

type Stop = { year: string; company: string; role: string; current: boolean };
type Copy = { title: string; cleared: string; coins: string; sound: string; hint: string; hintTouch: string; oneUp: string; allVisited: string };

// 16×11 kart: . empty, h hair, s skin, k dark, w white, b hoodie, r kart, y light, g hub
const kart = [
  "......hhhh......",
  ".....hhhhhh.....",
  ".....hssssh.....",
  ".....skwskw.....",
  "......ssss......",
  "...rrrbbbbrrr...",
  "..rrrrrrrrrrrrr.",
  ".rrrrrrrrrrrrrry",
  ".rkkkrrrrrrkkkr.",
  "..kgk......kgk..",
  "..kkk......kkk..",
];
const px: Record<string, string> = { h: "#21160f", s: "#b5794f", k: "#1d2b53", w: "#fff1e8", b: "#29adff", r: "#ff004d", y: "#ffec27", g: "#c2c3c7" };

function Kart() {
  return (
    <span className="d18b-kart-px" aria-hidden>
      {kart.join("").split("").map((c, i) => (
        <i key={i} style={c === "." ? undefined : { background: px[c] }} />
      ))}
    </span>
  );
}

/** Career as an overworld: click a stop (or ←/→) to drive there; every stop pays a coin. */
export function WorldMap({ stops, copy }: { stops: Stop[]; copy: Copy }) {
  const n = stops.length;
  const [at, setAt] = useState(n - 1);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [driving, setDriving] = useState(false);
  const [coins, setCoins] = useState(0);
  const [pops, setPops] = useState<{ id: number; i: number }[]>([]);
  const [bump, setBump] = useState<{ id: number; i: number } | null>(null);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([n - 1]));
  const [banner, setBanner] = useState<string | null>(null);
  const [sound, setSound] = useState(true);
  const seq = useRef(0);
  const chip = useChip(sound);

  useEffect(() => {
    if (!driving) return;
    const id = setTimeout(() => setDriving(false), 900);
    return () => clearTimeout(id);
  }, [driving, at]);

  useEffect(() => {
    if (!banner) return;
    const id = setTimeout(() => setBanner(null), 2600);
    return () => clearTimeout(id);
  }, [banner]);

  function go(i: number) {
    const id = ++seq.current;
    if (i !== at) {
      setFacing(i > at ? 1 : -1);
      setDriving(true);
      setAt(i);
      chip.vroom();
    }
    setBump({ id, i });
    setPops((p) => [...p.slice(-6), { id, i }]);
    chip.coin();
    const next = coins + 1;
    setCoins(next);
    const seen = new Set(visited).add(i);
    setVisited(seen);
    if (next % 10 === 0) {
      setBanner(copy.oneUp);
      setTimeout(() => chip.oneUp(), 250);
    } else if (seen.size === n && visited.size < n) {
      setBanner(copy.allVisited);
    }
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    go(Math.min(n - 1, Math.max(0, at + (e.key === "ArrowRight" ? 1 : -1))));
  }

  return (
    <div className="d18b-map" data-keys onKeyDown={onKey}>
      <div className="d18b-map-head">
        <h2 className="d18b-h2">
          {copy.title} <span className="d18b-dim">· {n} {copy.cleared}</span>
        </h2>
        <p className="d18b-hud-row">
          <span className="d18b-coin-ico" aria-hidden />
          <span aria-label={copy.coins}>× {String(coins).padStart(2, "0")}</span>
          <button type="button" className="d18b-sound" onClick={() => setSound(!sound)} aria-pressed={sound}>
            ♪ {sound ? "ON" : "OFF"}
          </button>
        </p>
      </div>

      <div className="d18b-track" style={{ "--n": n, "--at": at, "--face": facing } as React.CSSProperties}>
        {/* phones show one stop at a time; these step through them */}
        <button type="button" className="d18b-step is-prev" onClick={() => go(at - 1)} disabled={at === 0} aria-label="←">
          ‹
        </button>
        <button type="button" className="d18b-step is-next" onClick={() => go(at + 1)} disabled={at === n - 1} aria-label="→">
          ›
        </button>
        <ol className="d18b-stops">
          {stops.map((s, i) => (
            <li key={s.year + s.company} className={`${s.current ? "is-current" : ""} ${visited.has(i) ? "is-visited" : ""} ${i === at ? "is-at" : ""}`}>
              <button type="button" className="d18b-block" onClick={() => go(i)} aria-label={`${s.year} · ${s.role} · ${s.company}`}>
                <span key={bump?.i === i ? bump.id : "idle"} className={`d18b-block-face ${bump?.i === i ? "is-bump" : ""}`}>
                  {s.current ? "★" : "$"}
                </span>
              </button>
              {pops
                .filter((p) => p.i === i)
                .map((p) => (
                  <span key={p.id} className="d18b-pop" aria-hidden>
                    <span className="d18b-coin-ico" />
                  </span>
                ))}
            </li>
          ))}
        </ol>

        <div className={`d18b-road ${driving ? "is-driving" : ""}`} aria-hidden>
          <span className={`d18b-kart ${driving ? "is-driving" : ""}`} style={{ "--face": facing } as React.CSSProperties}>
            <Kart />
            {driving && <span className="d18b-puff" />}
          </span>
        </div>

        <ol className="d18b-labels" aria-hidden>
          {stops.map((s, i) => (
            <li key={s.year + s.company} className={i === at ? "is-here" : ""}>
              <a href={`#ch-${i + 1}`} tabIndex={-1}>
                <b>{s.year}</b>
                <span>{s.company}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <p className="d18b-map-foot">{banner ? (
          <b className="d18b-banner">{banner}</b>
        ) : (
          <>
            <span className="d18b-hint-wide">{copy.hint}</span>
            <span className="d18b-hint-touch">{copy.hintTouch}</span>
          </>
        )}</p>
    </div>
  );
}
