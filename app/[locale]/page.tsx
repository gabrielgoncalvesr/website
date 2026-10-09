import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleList, NoteList } from "@/components/entry-list";
import { socialLinks } from "@/components/site-footer";
import { entriesFor } from "@/lib/content";
import { dictionaries, isLocale } from "@/lib/i18n";
import { profile } from "@/lib/profile";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = dictionaries[locale];
  return (
    <div className="home">
      <section className="intro">
        <h1 className="intro-name">{profile.name}</h1>
        <p className="intro-role">
          {profile.role[locale]} · {profile.stack.slice(0, 3).join(" · ")}
        </p>
        <p className="intro-body">{profile.intro[locale]}</p>
      </section>

      <section className="home-section" aria-labelledby="h-writing">
        <div className="section-head">
          <h2 id="h-writing">{d.home.writing}</h2>
          <Link href={`/${locale}/writing`} className="section-more">
            {d.home.all} →
          </Link>
        </div>
        <ArticleList entries={entriesFor("articles", locale).slice(0, 5)} locale={locale} />
      </section>

      <section className="home-section" aria-labelledby="h-notes">
        <div className="section-head">
          <h2 id="h-notes">{d.home.notes}</h2>
          <Link href={`/${locale}/notes`} className="section-more">
            {d.home.all} →
          </Link>
        </div>
        <NoteList entries={entriesFor("notes", locale).slice(0, 4)} locale={locale} d={d} />
      </section>

      <section className="home-section" aria-labelledby="h-elsewhere">
        <div className="section-head">
          <h2 id="h-elsewhere">{d.home.elsewhere}</h2>
        </div>
        <ul className="link-row">
          {socialLinks().map((l) => (
            <li key={l.label}>
              <a href={l.href}>{l.label} ↗</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
