"use client";

import { useRef } from "react";

/** Tiny square-wave synth; created on the first click so browsers allow it. */
export function useChip(on = true) {
  const ctx = useRef<AudioContext | null>(null);
  function tone(notes: [number, number][], vol = 0.06) {
    if (!on) return;
    ctx.current ??= new AudioContext();
    const a = ctx.current;
    const t0 = a.currentTime;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = "square";
    let t = t0;
    for (const [hz, dur] of notes) {
      o.frequency.setValueAtTime(hz, t);
      t += dur;
    }
    g.gain.setValueAtTime(vol, t0);
    g.gain.setValueAtTime(vol, t - 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(g).connect(a.destination);
    o.start(t0);
    o.stop(t + 0.3);
  }
  return {
    coin: () => tone([
      [988, 0.07],
      [1319, 0.3],
    ]),
    oneUp: () => tone([
      [659, 0.09],
      [784, 0.09],
      [1319, 0.09],
      [1047, 0.09],
      [1175, 0.09],
      [1568, 0.2],
    ]),
    chest: () => tone([
      [523, 0.08],
      [659, 0.08],
      [784, 0.08],
      [1047, 0.08],
      [1319, 0.25],
    ], 0.05),
    vroom: () => tone([
      [110, 0.06],
      [147, 0.06],
      [196, 0.1],
    ], 0.035),
  };
}
