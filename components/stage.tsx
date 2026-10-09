import type { Stage } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";

/** Growth glyphs: an outline that fills in as the note matures. */
function Glyph({ stage }: { stage: Stage }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className="stage-glyph">
      <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.25" />
      {stage === "budding" && <path d="M6 1.5a4.5 4.5 0 0 1 0 9z" fill="currentColor" />}
      {stage === "evergreen" && <circle cx="6" cy="6" r="4.5" fill="currentColor" />}
    </svg>
  );
}

export function StageBadge({ stage, d }: { stage: Stage; d: Dictionary }) {
  return (
    <span className={`stage stage-${stage}`}>
      <Glyph stage={stage} />
      {d.stage[stage]}
    </span>
  );
}
