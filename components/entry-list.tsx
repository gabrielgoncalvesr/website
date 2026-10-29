import Link from "next/link";
import type { Entry } from "@/lib/content";
import { formatDate, type Dictionary, type Locale } from "@/lib/i18n";
import { entryHref } from "@/lib/routes";
import { StageBadge } from "./stage";

/** One line per article: title, then date. */
export function ArticleRows({ entries, locale }: { entries: Entry[]; locale: Locale }) {
  return (
    <ol className="article-list">
      {entries.map((e) => (
        <li key={e.slug}>
          <Link href={entryHref(locale, e)} className="article-row" data-tags={e.tags.join(" ")}>
            <span className="article-title">{e.title}</span>
            <span className="article-leader" aria-hidden />
            <time dateTime={e.date} className="article-date">
              {formatDate(e.date, locale, "short")}
            </time>
          </Link>
        </li>
      ))}
    </ol>
  );
}

/** Articles grouped by year; the year hangs in the margin. */
export function ArticleList({ entries, locale }: { entries: Entry[]; locale: Locale }) {
  const years = [...new Set(entries.map((e) => e.date.slice(0, 4)))];
  return (
    <div className="article-years">
      {years.map((y) => (
        <div key={y} className="article-year" data-group>
          <p className="article-year-label">{y}</p>
          <ArticleRows entries={entries.filter((e) => e.date.startsWith(y))} locale={locale} />
        </div>
      ))}
    </div>
  );
}

export function NoteList({ entries, locale, d }: { entries: Entry[]; locale: Locale; d: Dictionary }) {
  return (
    <ul className="note-grid">
      {entries.map((e) => (
        <li key={e.slug}>
          <Link href={entryHref(locale, e)} className="note-card" data-tags={e.tags.join(" ")}>
            {e.stage && <StageBadge stage={e.stage} d={d} />}
            <span className="note-title">{e.title}</span>
            <span className="note-summary">{e.summary}</span>
            <span className="note-meta">
              {d.post.updated} {formatDate(e.updated ?? e.date, locale, "short")}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Articles and notes as a wall of tiles: date, length or stage, title, summary, tags. */
export function WritingGrid({ entries, locale, d }: { entries: Entry[]; locale: Locale; d: Dictionary }) {
  return (
    <ul className="wgrid">
      {entries.map((e) => (
        <li key={e.slug}>
          <Link href={entryHref(locale, e)} className={`wcard ${e.kind === "notes" ? "is-note" : ""}`} data-tags={e.tags.join(" ")}>
            <span className="wcard-top">
              <time dateTime={e.date}>{formatDate(e.date, locale, "short")}</time>
              <span>{e.kind === "notes" ? (e.stage ? d.stage[e.stage] : d.nav.notes) : `${e.readingMinutes} min`}</span>
            </span>
            <span className="wcard-title">{e.title}</span>
            <span className="wcard-sum">{e.summary}</span>
            {e.tags.length > 0 && (
              <span className="wcard-tags">
                {e.tags.map((x) => (
                  <span key={x}>{x.replace(/-/g, " ")}</span>
                ))}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
