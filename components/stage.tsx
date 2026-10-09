import type { Stage } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";

const glyph: Record<Stage, string> = { seedling: "🌱", budding: "🌿", evergreen: "🌳" };

export function StageBadge({ stage, d }: { stage: Stage; d: Dictionary }) {
  return (
    <span className={`stage stage-${stage}`}>
      <span aria-hidden>{glyph[stage]}</span>
      {d.stage[stage]}
    </span>
  );
}
