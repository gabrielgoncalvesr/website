import Link from "next/link";
import { LocaleSwitch } from "@/components/locale-switch";
import { NavLink } from "@/components/nav-link";
import { ThemeToggle } from "@/components/theme";
import { socialLinks } from "@/components/site-footer";
import { allTags } from "@/lib/content";
import { formatDate, type Dictionary, type Locale } from "@/lib/i18n";
import { rolesNewestFirst, t, writing } from "@/lib/lab";
import { education, profile } from "@/lib/profile";
import { entryHref } from "@/lib/routes";
import { site } from "@/lib/site";
import { Clock } from "./bits";

type Chrome = { locale: Locale; d: Dictionary };

/** Per-letter spans so each letter can light up on hover. */
function Letters({ text }: { text: string }) {
  return (
    <span className="d1b-word" aria-hidden>
      {[...text].map((c, i) => (
        <span key={i}>{c}</span>
      ))}
    </span>
  );
}

export function Header({ locale, d }: Chrome) {
  return (
    <header className="d1b-header">
      <Link href={`/${locale}`} className="d1b-brand">
        Gabriel Gonçalves
      </Link>
      <nav className="d1b-nav" aria-label="Main">
        <NavLink href={`/${locale}/writing`}>{d.nav.writing}</NavLink>
        <NavLink href={`/${locale}/about`}>{d.nav.about}</NavLink>
      </nav>
      <div className="d1b-tools">
        <LocaleSwitch current={locale} />
        <ThemeToggle label={d.theme.toggle} />
      </div>
    </header>
  );
}

export function Footer({ locale, d }: Chrome) {
  // "Say hi" only once there is a way to reach me (LinkedIn or email in lib/site.ts).
  const hasContact = Boolean(site.links.linkedin || site.links.email);
  const links = [...socialLinks().map((l) => ({ ...l, mark: "↗" })), { label: d.journal.backToTop, href: "#main", mark: "↑" }];
  return (
    <footer className="d1b-footer">
      <header className="d1b-footer-head">
        <span>(05)</span>
        <h2>{hasContact ? t(locale, "Say hi", "Bora conversar") : t(locale, "Elsewhere", "Em outros lugares")}</h2>
        <span>
          São Paulo · <Clock />
        </span>
      </header>
      <ul className="d1b-links">
        {links.map((l, i) => (
          <li key={l.label}>
            <a href={l.href}>
              <span className="d1b-links-no">{String(i + 1).padStart(2, "0")}</span>
              <span className="d1b-links-label">{l.label}</span>
              <span className="d1b-links-mark" aria-hidden>
                {l.mark}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="d1b-colophon">
        <span>© {new Date().getFullYear()} Gabriel Gonçalves</span>
      </p>
    </footer>
  );
}

export function Home({ locale, d }: Chrome) {
  const entries = writing();
  const topics = allTags(entries);
  const roles = rolesNewestFirst();
  const ticker = [...profile.stack, ...topics.slice(0, 6).map((x) => x.replace(/-/g, " "))];

  return (
    <div className="d1b">
      <section className="d1b-hero">
        <p className="d1b-kicker">
          <span>(00)</span>
          <span>{t(locale, "Curriculum & journal", "Currículo & diário")}</span>
        </p>
        <h1 className="d1b-name">
          <span className="sr-only">{profile.name}</span>
          <Letters text="Gabriel" />
          <Letters text="Gonçalves" />
        </h1>
        <div className="d1b-hero-grid">
          <p className="d1b-role">
            {profile.role[locale]}
            <br />
            <span>{profile.location[locale]}</span>
          </p>
          <p className="d1b-intro">{profile.intro[locale]}</p>
          <a href="#work" className="d1b-down" aria-label={t(locale, "Scroll to work", "Ir para trabalho")}>
            ↓
          </a>
        </div>
      </section>

      <div className="d1b-marquee" aria-hidden>
        <div className="d1b-track">
          {[0, 1].map((k) => (
            <span key={k}>
              {ticker.map((s) => (
                <span key={s}>
                  {s} <i>✶</i>{" "}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <section id="work" className="d1b-sec">
        <header className="d1b-sec-head">
          <span>(01)</span>
          <h2>{t(locale, "Work", "Trabalho")}</h2>
          <span>{t(locale, "Hover a row", "Passe o mouse")}</span>
        </header>
        <ol className="d1b-roles">
          {roles.map((r) => (
            <li key={r.start} className="d1b-role-row" tabIndex={0}>
              <span className="d1b-years">
                {r.start.slice(0, 4)}–{r.end ? r.end.slice(2, 4) : t(locale, "now", "hoje")}
              </span>
              <span className="d1b-role-name">{r.role[locale].replace(/ · .*/, "")}</span>
              <span className="d1b-company">{r.company}</span>
              <span className="d1b-summary">{r.summary[locale]}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="d1b-sec" id="education">
        <header className="d1b-sec-head">
          <span>(02)</span>
          <h2>{t(locale, "Education", "Formação")}</h2>
          <span>{education.length} {t(locale, "diplomas", "diplomas")}</span>
        </header>
        <ol className="d1b-edu">
          {education.map((e, i) => (
            <li key={e.school}>
              <span className="d1b-edu-top">
                <span>{e.years}</span>
                <span>{String(i + 1).padStart(2, "0")}</span>
              </span>
              <span className="d1b-edu-degree">{e.degree[locale]}</span>
              <span className="d1b-edu-school">{e.school}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="d1b-sec">
        <header className="d1b-sec-head">
          <span>(03)</span>
          <h2>{d.nav.writing}</h2>
          <Link href={`/${locale}/writing`}>{d.journal.allWriting} →</Link>
        </header>
        <div className="d1b-cards">
          {entries.slice(0, 9).map((e, i) => (
            <Link key={e.slug} href={entryHref(locale, e)} className={`d1b-card ${i === 0 ? "is-lead" : ""}`}>
              <span className="d1b-card-top">
                <time dateTime={e.date}>{formatDate(e.date, locale, "short")}</time>
                <span>{e.kind === "notes" ? (e.stage ? d.stage[e.stage] : d.nav.notes) : `${e.readingMinutes} min`}</span>
              </span>
              <span className="d1b-card-title">{e.title}</span>
              <span className="d1b-card-sum">{e.summary}</span>
              {e.tags.length > 0 && (
                <span className="d1b-card-tags">
                  {e.tags.slice(0, 3).map((x) => (
                    <span key={x}>{x.replace(/-/g, " ")}</span>
                  ))}
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      <section className="d1b-sec">
        <header className="d1b-sec-head">
          <span>(04)</span>
          <h2>{d.journal.topics}</h2>
          <span />
        </header>
        <ul className="d1b-topics">
          {topics.map((x) => (
            <li key={x}>
              <Link href={`/${locale}/writing?tag=${encodeURIComponent(x)}`}>{x.replace(/-/g, " ")}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
