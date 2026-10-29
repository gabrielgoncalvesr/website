import Link from "next/link";
import { LocaleSwitch } from "@/components/locale-switch";
import { NavLink } from "@/components/nav-link";
import { ThemeToggle } from "@/components/theme";
import { socialLinks } from "@/components/site-footer";
import { formatDate, type Dictionary, type Locale } from "@/lib/i18n";
import { t, writing } from "@/lib/lab";
import { education, experience, profile } from "@/lib/profile";
import { entryHref } from "@/lib/routes";
import { PaymentToy, Stickers } from "./toys-b";

type Chrome = { locale: Locale; d: Dictionary };

function Bouncy({ text }: { text: string }) {
  return (
    <>
      {[...text].map((c, i) => (
        <span key={i} className="d4b-bounce" style={{ "--i": i } as React.CSSProperties}>
          {c === " " ? " " : c}
        </span>
      ))}
    </>
  );
}

export function Header({ locale, d }: Chrome) {
  return (
    <header className="d4b-header">
      <Link href={`/${locale}`} className="d4b-logo">
        <span className="d4b-logo-mark" aria-hidden>
          g
        </span>
        Gabriel
      </Link>
      <nav className="d4b-nav" aria-label="Main">
        <NavLink href={`/${locale}/writing`}>{d.nav.writing}</NavLink>
        <NavLink href={`/${locale}/about`}>{d.nav.about}</NavLink>
      </nav>
      <div className="d4b-tools">
        <LocaleSwitch current={locale} />
        <ThemeToggle label={d.theme.toggle} />
      </div>
    </header>
  );
}

export function Footer({ locale }: Chrome) {
  return (
    <footer className="d4b-footer">
      <p className="d4b-footer-big">
        {t(locale, "Got a gnarly backend problem?", "Tem um problema cabeludo de backend?")}
        <br />
        <span>{t(locale, "Let's talk.", "Bora conversar.")}</span>
      </p>
      <ul>
        {socialLinks().map((l, i) => (
          <li key={l.label}>
            <a href={l.href} className={`d4b-pill tone-${(i % 4) + 1}`}>
              {l.label} ↗
            </a>
          </li>
        ))}
      </ul>
      <p className="d4b-footer-small">
        © {new Date().getFullYear()} {profile.name} · {t(locale, "made with Go energy and too much coffee", "feito com energia de Go e café demais")}
      </p>
    </footer>
  );
}

export function Home({ locale, d }: Chrome) {
  const entries = writing();
  const levels = [...experience].sort((a, b) => a.start.localeCompare(b.start));
  const stickers = [
    { label: "Go", x: 2, y: 2, r: -12, tone: 2 },
    { label: "PostgreSQL", x: 30, y: 4, r: 8, tone: 4 },
    { label: ".NET", x: 64, y: 1, r: -6, tone: 1 },
    { label: "AWS", x: 84, y: 30, r: 10, tone: 3 },
    { label: "Kubernetes", x: 52, y: 90, r: -9, tone: 5 },
    { label: "Datadog", x: 4, y: 91, r: 5, tone: 1 },
    { label: "Java", x: 74, y: 84, r: 14, tone: 2 },
    { label: "C#", x: 28, y: 93, r: -4, tone: 4 },
  ];

  return (
    <div className="d4b">
      <section className="d4b-hero">
        <div className="d4b-hero-play">
          <Stickers items={stickers} />
          <div className="d4b-hero-copy">
            <p className="d4b-hello">{t(locale, "Oi! 👋 I'm", "Oi! 👋 Eu sou o")}</p>
            <h1 className="d4b-name" aria-label={profile.name}>
              <Bouncy text="Gabriel" />
              <br />
              <Bouncy text="Gonçalves" />
            </h1>
            <p className="d4b-intro">{profile.intro[locale]}</p>
            <p className="d4b-drag">{t(locale, "↗ psst, the stickers move", "↗ psiu, dá pra arrastar os adesivos")}</p>
          </div>
        </div>
        <div className="d4b-hero-toy">
          <PaymentToy locale={locale} />
        </div>
      </section>

      <section className="d4b-sec" id="work">
        <h2 className="d4b-h2">
          {t(locale, "The level map", "O mapa de fases")} <span className="d4b-tag tone-3">{t(locale, "8 years", "8 anos")}</span>
        </h2>
        <ol className="d4b-levels" style={{ "--n": levels.length } as React.CSSProperties}>
          {levels.map((r, i) => (
            <li key={r.start} className={`d4b-level tone-${(i % 5) + 1}`} style={{ "--r": `${i % 2 ? 1.5 : -1.5}deg` } as React.CSSProperties}>
              <span className="d4b-lv">LV {i + 1}</span>
              <span className="d4b-level-role">{r.role[locale].replace(/ · .*/, "")}</span>
              <span className="d4b-level-co">
                {r.company} · {r.start.slice(0, 4)}
              </span>
              <span className="d4b-level-sum">{r.summary[locale]}</span>
              {!r.end && <span className="d4b-now">{t(locale, "you are here", "você está aqui")}</span>}
            </li>
          ))}
        </ol>
      </section>

      <section className="d4b-sec" id="school">
        <h2 className="d4b-h2">
          {t(locale, "Training grounds", "Onde aprendi")} <span className="d4b-tag tone-4">🎓 {education.length}</span>
        </h2>
        <ol className="d4b-school">
          {education.map((e, i) => (
            <li key={e.school} className={`d4b-diploma tone-${[2, 5, 3][i % 3]}`} style={{ "--r": `${[-2, 1.5, -1][i % 3]}deg` } as React.CSSProperties}>
              <span className="d4b-diploma-years">{e.years}</span>
              <span className="d4b-diploma-degree">{e.degree[locale]}</span>
              <span className="d4b-diploma-school">{e.school}</span>
              <span className="d4b-diploma-seal" aria-hidden>
                ★
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="d4b-sec">
        <h2 className="d4b-h2">
          {d.nav.writing}
          <Link href={`/${locale}/writing`} className="d4b-pill tone-2">
            {d.journal.allWriting} →
          </Link>
        </h2>
        <div className="d4b-cards">
          {entries.slice(0, 9).map((e, i) => (
            <Link key={e.slug} href={entryHref(locale, e)} className={`d4b-card tone-${(i % 5) + 1} ${i === 0 ? "is-big" : ""} ${e.kind === "notes" ? "is-note" : ""}`}>
              <span className="d4b-card-meta">
                {formatDate(e.date, locale, "short")} · {e.kind === "notes" ? (e.stage ? d.stage[e.stage] : d.nav.notes) : `${e.readingMinutes} min`}
              </span>
              <span className="d4b-card-title">{e.title}</span>
              <span className="d4b-card-sum">{e.summary}</span>
              {e.tags.length > 0 && (
                <span className="d4b-card-tags">
                  {e.tags.slice(0, 3).map((x) => (
                    <span key={x}>#{x}</span>
                  ))}
                </span>
              )}
              <span className="d4b-card-go" aria-hidden>
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
