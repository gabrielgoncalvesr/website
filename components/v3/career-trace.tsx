import type { Job } from "@/lib/profile";
import type { Locale } from "@/lib/i18n";

/** Months since epoch for a YYYY-MM string. */
function m(ym: string) {
  const [y, mo] = ym.split("-").map(Number);
  return y * 12 + (mo - 1);
}

function duration(months: number, locale: Locale) {
  const y = Math.floor(months / 12);
  const mo = months % 12;
  const [ys, ms] = locale === "en" ? ["y", "m"] : ["a", "m"];
  return [y && `${y}${ys}`, mo && `${mo}${ms}`].filter(Boolean).join(" ") || `<1${ms}`;
}

type Props = { jobs: Job[]; locale: Locale; now?: Date; labels: { present: string; trace: string } };

/**
 * Career rendered as a distributed trace: one root span, one span per company,
 * child spans per role — positioned on a shared time axis.
 */
export function CareerTrace({ jobs, locale, now = new Date(), labels }: Props) {
  const nowYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const start = Math.min(...jobs.map((j) => m(j.start)));
  const end = m(nowYm) + 1;
  const total = end - start;
  const pct = (v: number) => ((v - start) / total) * 100;

  const companies = [...new Set(jobs.map((j) => j.company))].map((company) => {
    const roles = jobs.filter((j) => j.company === company).sort((a, b) => m(a.start) - m(b.start));
    const s = m(roles[0].start);
    const e = Math.max(...roles.map((r) => (r.end ? m(r.end) : end)));
    return { company, roles, s, e };
  }).sort((a, b) => b.s - a.s); // most recent company first

  const years: number[] = [];
  for (let y = Math.ceil(start / 12); y * 12 < end; y++) years.push(y);

  return (
    <div className="trace" role="table" aria-label={labels.trace}>
      <div className="trace-axis" aria-hidden>
        {years.map((y) => (
          <span key={y} style={{ left: `${pct(y * 12)}%` }}>
            {String(y).slice(2)}
          </span>
        ))}
      </div>

      <TraceRow depth={0} name="career" meta={`${duration(total, locale)}`} left={0} width={100} tone="root" />

      {companies.map((c, ci) => (
        <div key={c.company} role="rowgroup">
          <TraceRow
            depth={1}
            name={c.company.toLowerCase()}
            meta={duration(c.e - c.s, locale)}
            left={pct(c.s)}
            width={pct(c.e) - pct(c.s)}
            tone={`c${ci % 3}`}
            delay={ci}
          />
          {[...c.roles].reverse().map((r, ri) => {
            const s = m(r.start);
            const e = r.end ? m(r.end) : end;
            return (
              <TraceRow
                key={r.start}
                depth={2}
                name={r.role[locale]}
                meta={`${duration(e - s, locale)}${r.end ? "" : ` · ${labels.present}`}`}
                left={pct(s)}
                width={pct(e) - pct(s)}
                tone={`c${ci % 3}`}
                live={!r.end}
                detail={r.summary[locale]}
                tags={r.tags}
                delay={ci + ri * 0.4 + 0.5}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

type RowProps = {
  depth: number;
  name: string;
  meta: string;
  left: number;
  width: number;
  tone: string;
  live?: boolean;
  detail?: string;
  tags?: string[];
  delay?: number;
};

function TraceRow({ depth, name, meta, left, width, tone, live, detail, tags, delay = 0 }: RowProps) {
  // Bars that run to the right edge get their duration label on the left side.
  const flip = left + width > 80 && left > 12;
  return (
    <div className={`trace-row depth-${depth}`} role="row" style={{ "--d": `${delay * 90}ms` } as React.CSSProperties}>
      <div className="trace-label" role="rowheader">
        <span className="trace-name">{name}</span>
        {detail && <span className="trace-detail">{detail}</span>}
        {tags && (
          <span className="trace-tags">
            {tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </span>
        )}
      </div>
      <div className="trace-track" role="cell">
        <span className={`trace-bar tone-${tone} ${live ? "is-live" : ""}`} style={{ left: `${left}%`, width: `${width}%` }} />
        <span
          className={`trace-meta ${flip ? "is-flipped" : ""}`}
          style={flip ? { right: `${100 - left}%` } : { left: `${left + width}%` }}
        >
          {meta}
        </span>
      </div>
    </div>
  );
}
