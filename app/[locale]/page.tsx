import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteList } from "@/components/entry-list";
import { Band } from "@/components/v3/columns";
import { Reveal } from "@/components/v3/reveal";
import { allEntries, allTags } from "@/lib/content";
import { dictionaries, formatDate, isLocale } from "@/lib/i18n";
import { profile } from "@/lib/profile";
import { entryHref } from "@/lib/routes";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = dictionaries[locale];
  const j = d.journal;
  const articles = allEntries("articles");
  const notes = allEntries("notes");
  const [featured, ...rest] = articles;
  const topics = allTags([...articles, ...notes]);

  const spec = [
    [j.spec.now, j.nowValue],
    [j.spec.based, j.basedValue],
    [j.spec.before, j.beforeValue],
    [j.spec.stack, profile.stack.slice(0, 5).join(", ")],
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-main">
          <p className="eyebrow">
            <span className="now-dot" aria-hidden /> {profile.role[locale]}
          </p>
          <h1 className="statement">
            {j.statement[0]} <em>{j.statement[1]}</em> {j.statement[2]}
          </h1>
        </div>
        <dl className="spec">
          {spec.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {featured && (
        <Band
          id="writing"
          label={d.home.writing}
          hint={d.home.writingHint}
          aside={
            <Link href={`/${locale}/writing`} className="band-more">
              {j.allWriting} →
            </Link>
          }
        >
          <Reveal>
            <Link href={entryHref(locale, featured)} className="feature">
              <span className="feature-kicker">
                <span>{j.latest}</span>
                <time dateTime={featured.date}>{formatDate(featured.date, locale)}</time>
                <span>
                  {featured.readingMinutes} {d.post.minRead}
                </span>
              </span>
              <span className="feature-title">
                <span className="u">{featured.title}</span>
              </span>
              <span className="feature-summary">{featured.summary}</span>
              <span className="feature-read">{j.read} →</span>
            </Link>
          </Reveal>
          {rest.length > 0 && (
            <ol className="feature-rest">
              {rest.slice(0, 4).map((e, i) => (
                <li key={e.slug}>
                  <Reveal>
                    <Link href={entryHref(locale, e)} className="rest-row">
                      <span className="rest-no">No. {String(i + 2).padStart(2, "0")}</span>
                      <span className="rest-title">
                        <span className="u">{e.title}</span>
                      </span>
                      <span className="rest-summary">{e.summary}</span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ol>
          )}
        </Band>
      )}

      <Band
        id="garden"
        label={j.garden}
        hint={d.home.notesHint}
        aside={
          <Link href={`/${locale}/notes`} className="band-more">
            {j.more} →
          </Link>
        }
      >
        <Reveal>
          <NoteList entries={notes.slice(0, 6)} locale={locale} d={d} />
        </Reveal>
      </Band>

      <Band id="topics" label={j.topics}>
        <Reveal>
          <p className="topics">
            {topics.map((t, i) => (
              <span key={t}>
                <Link href={`/${locale}/notes?tag=${encodeURIComponent(t)}`}>{t.replace(/-/g, " ")}</Link>
                {i < topics.length - 1 && (
                  <span className="topics-sep" aria-hidden>
                    {" / "}
                  </span>
                )}
              </span>
            ))}
          </p>
        </Reveal>
      </Band>
    </div>
  );
}
