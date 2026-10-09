import Link from "next/link";
import type { Entry } from "@/lib/content";
import { formatDate, languageNames, type Dictionary, type Locale } from "@/lib/i18n";
import { entryHref, section } from "@/lib/routes";
import { StageBadge } from "./stage";
import { Toc } from "./toc";

type Props = {
  entry: Entry;
  translations: Entry[];
  locale: Locale;
  d: Dictionary;
  children: React.ReactNode;
};

export function PostView({ entry, translations, locale, d, children }: Props) {
  const isNote = entry.kind === "notes";
  return (
    <article className="post" lang={entry.lang === "pt-br" ? "pt-BR" : "en"}>
      <header className="post-header">
        <Link href={`/${locale}/${section[entry.kind]}`} className="back-link">
          ← {isNote ? d.nav.notes : d.nav.writing}
        </Link>
        {entry.stage && <StageBadge stage={entry.stage} d={d} />}
        <h1 className="post-title">{entry.title}</h1>
        <p className="post-summary">{entry.summary}</p>
        <dl className="post-meta">
          <div>
            <dt>{isNote ? d.post.planted : d.post.published}</dt>
            <dd>
              <time dateTime={entry.date}>{formatDate(entry.date, locale)}</time>
            </dd>
          </div>
          {entry.updated && (
            <div>
              <dt>{d.post.updated}</dt>
              <dd>
                <time dateTime={entry.updated}>{formatDate(entry.updated, locale)}</time>
              </dd>
            </div>
          )}
          <div>
            <dt className="sr-only">{d.post.minRead}</dt>
            <dd>
              {entry.readingMinutes} {d.post.minRead}
            </dd>
          </div>
        </dl>
        {entry.tags.length > 0 && (
          <ul className="post-tags">
            {entry.tags.map((t) => (
              <li key={t}>#{t}</li>
            ))}
          </ul>
        )}
        {translations.length > 0 && (
          <p className="post-translations">
            {d.post.alsoIn}{" "}
            {translations.map((t, i) => (
              <span key={t.slug}>
                {i > 0 && ", "}
                <Link href={entryHref(t.lang, t)} hrefLang={t.lang}>
                  {languageNames[t.lang]}
                </Link>
              </span>
            ))}
          </p>
        )}
      </header>
      <div className="post-layout">
        <aside className="post-aside">
          <Toc headings={entry.headings} label={d.post.onThisPage} />
        </aside>
        <div className="prose">{children}</div>
      </div>
    </article>
  );
}
