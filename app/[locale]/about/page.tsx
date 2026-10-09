import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dictionaries, formatDate, isLocale, type Locale } from "@/lib/i18n";
import { education, experience, profile } from "@/lib/profile";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: dictionaries[locale].about.title, alternates: { canonical: `/${locale}/about` } };
}

function month(ym: string, locale: Locale) {
  return formatDate(`${ym}-01`, locale, "short");
}

export default async function About({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = dictionaries[locale];
  return (
    <div className="about">
      <header className="page-head">
        <h1>{d.about.title}</h1>
        {profile.about[locale].map((p) => (
          <p key={p}>{p}</p>
        ))}
      </header>

      <section aria-labelledby="h-exp">
        <h2 id="h-exp" className="section-label">
          {d.about.experience}
        </h2>
        <ol className="timeline">
          {experience.map((j) => (
            <li key={`${j.company}-${j.start}`} className="job">
              <p className="job-when">
                {month(j.start, locale)} — {j.end ? month(j.end, locale) : d.about.present}
              </p>
              <div>
                <h3 className="job-role">
                  {j.role[locale]} <span className="muted">· {j.company}</span>
                </h3>
                <p className="job-summary">{j.summary[locale]}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="h-edu">
        <h2 id="h-edu" className="section-label">
          {d.about.education}
        </h2>
        <ul className="edu">
          {education.map((e) => (
            <li key={e.school}>
              <span>
                {e.degree[locale]} <span className="muted">· {e.school}</span>
              </span>
              <span className="muted mono">{e.years}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="h-stack">
        <h2 id="h-stack" className="section-label">
          {d.about.stack}
        </h2>
        <ul className="chips">
          {profile.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
