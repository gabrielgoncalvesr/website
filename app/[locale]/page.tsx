import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteList } from "@/components/entry-list";
import { Band } from "@/components/v3/columns";
import { Reveal } from "@/components/v3/reveal";
import { allEntries, allTags } from "@/lib/content";
import { dictionaries, formatDate, isLocale } from "@/lib/i18n";
import { education, experience, profile } from "@/lib/profile";
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

  // Newest company first; roles oldest → newest so the path reads as a progression.
  const companies = [...new Set(experience.map((x) => x.company))].map((company) => {
    const roles = experience.filter((x) => x.company === company).sort((a, b) => a.start.localeCompare(b.start));
    const last = roles[roles.length - 1];
    return {
      company,
      from: roles[0].start.slice(0, 4),
      to: last.end?.slice(0, 4),
      roles: roles.map((r) => r.role[locale].replace(/ · .*/, "")),
    };
  });

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
        id="background"
        label={j.background}
        hint={j.backgroundHint}
        aside={
          <Link href={`/${locale}/about`} className="band-more">
            {j.fullStory} →
          </Link>
        }
      >
        <Reveal className="background">
          <div>
            <h3 className="bg-label">{j.work}</h3>
            <ol className="bg-list">
              {companies.map((c) => (
                <li key={c.company} className="bg-item">
                  <span className="bg-years mono">
                    {c.from}–{c.to ?? d.about.present}
                  </span>
                  <span className="bg-main">
                    <span className="bg-title">{c.company}</span>
                    <span className="bg-path">
                      {c.roles.map((r, i) => (
                        <span key={r}>
                          {i > 0 && <span className="bg-arrow" aria-hidden> → </span>}
                          {r}
                        </span>
                      ))}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="bg-label">{d.about.education}</h3>
            <ol className="bg-list">
              {education.map((e) => (
                <li key={e.school} className="bg-item">
                  <span className="bg-years mono">{e.years}</span>
                  <span className="bg-main">
                    <span className="bg-title">{e.degree[locale]}</span>
                    <span className="bg-path">{e.school}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </Band>

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
          <ul className="topics">
            {topics.map((t) => (
              <li key={t}>
                <Link href={`/${locale}/notes?tag=${encodeURIComponent(t)}`}>{t.replace(/-/g, " ")}</Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Band>
    </div>
  );
}
