import Link from "next/link";
import type { Entry } from "@/lib/content";
import { formatDate, type Dictionary, type Locale } from "@/lib/i18n";
import { entryHref } from "@/lib/routes";
import { StageBadge } from "./stage";

/** Articles grouped by year; the year hangs in the margin. */
export function ArticleList({ entries, locale }: { entries: Entry[]; locale: Locale }) {
  const years = [...new Set(entries.map((e) => e.date.slice(0, 4)))];
  return (
    <div className="article-years">
      {years.map((y) => (
        <div key={y} className="article-year">
          <p className="article-year-label">{y}</p>
          <ol className="article-list">
            {entries
              .filter((e) => e.date.startsWith(y))
              .map((e) => (
                <li key={e.slug}>
                  <Link href={entryHref(locale, e)} className="article-row">
                    <span className="article-title">
                      <span className="u">{e.title}</span>
                    </span>
                    <span className="article-summary">{e.summary}</span>
                    <time dateTime={e.date} className="article-date">
                      {formatDate(e.date, locale, "short")}
                    </time>
                  </Link>
                </li>
              ))}
          </ol>
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
