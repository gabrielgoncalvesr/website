import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CareerTrace } from "@/components/v3/career-trace";
import { Band } from "@/components/v3/columns";
import { dictionaries, isLocale } from "@/lib/i18n";
import { education, experience, profile } from "@/lib/profile";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: dictionaries[locale].about.title, alternates: { canonical: `/${locale}/about` } };
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

      <Band id="experience" label={d.about.experience} hint={d.journal.traceHint}>
        <div className="trace-wrap">
          <CareerTrace jobs={experience} locale={locale} labels={{ present: d.about.present, trace: d.about.experience }} />
        </div>
      </Band>

      <Band id="education" label={d.about.education}>
        <ul className="edu">
          {education.map((e) => (
            <li key={e.school}>
              <span>
                <span className="edu-degree">{e.degree[locale]}</span>
                <span className="muted"> · {e.school}</span>
              </span>
              <span className="muted mono">{e.years}</span>
            </li>
          ))}
        </ul>
      </Band>

      <Band id="stack" label={d.about.stack}>
        <ul className="chips">
          {profile.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Band>
    </div>
  );
}
