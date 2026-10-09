import Link from "next/link";
import type { Entry } from "@/lib/content";
import { formatDate, type Dictionary, type Locale } from "@/lib/i18n";
import { entryHref } from "@/lib/routes";
import { StageBadge } from "./stage";

export function ArticleList({ entries, locale }: { entries: Entry[]; locale: Locale }) {
  return (
    <ol className="article-list">
      {entries.map((e) => (
        <li key={e.slug}>
          <Link href={entryHref(locale, e)} className="article-row">
            <time dateTime={e.date} className="article-date">
              {formatDate(e.date, locale, "short")}
            </time>
            <span className="article-title">
              {e.title}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function NoteList({ entries, locale, d }: { entries: Entry[]; locale: Locale; d: Dictionary }) {
  return (
    <ul className="note-grid">
      {entries.map((e) => (
        <li key={e.slug}>
          <Link href={entryHref(locale, e)} className="note-card" data-tags={e.tags.join(" ")}>
            {e.stage && <StageBadge stage={e.stage} d={d} />}
            <span className="note-title">
              {e.title}
            </span>
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
