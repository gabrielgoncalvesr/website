import Link from "next/link";
import { LocaleSwitch } from "@/components/locale-switch";
import { NavLink } from "@/components/nav-link";
import { ThemeToggle } from "@/components/theme";
import { socialLinks } from "@/components/site-footer";
import { formatDate, type Dictionary, type Locale } from "@/lib/i18n";
import { t, writing } from "@/lib/lab";
import { education, experience, profile, yearsOfExperience } from "@/lib/profile";
import { entryHref } from "@/lib/routes";
import { RpgMenu } from "./rpg-menu-b";
import { Chest } from "./chest";
import { WorldMap } from "./world-map";

type Chrome = { locale: Locale; d: Dictionary };

/** Icon file (public/lab/stack) per stack entry. */
const icons: Record<string, string> = {
  Go: "go",
  ".NET": "dotnet",
  "C#": "csharp",
  Java: "java",
  PostgreSQL: "postgresql",
  AWS: "aws",
  Kubernetes: "kubernetes",
  Datadog: "datadog",
};

// 12×12 sprite: . empty, h hair, s skin, k dark, w white, b hoodie, r accent
const sprite = [
  "....hhhh....",
  "...hhhhhh...",
  "..hhhhhhhh..",
  "..hssssssh..",
  "..skwskwss..",
  "..ssssssss..",
  "...ssrrss...",
  "....ssss....",
  "..bbbbbbbb..",
  ".bbbwbbwbbb.",
  ".bbbbbbbbbb.",
  ".ss.bbbb.ss.",
];
const px: Record<string, string> = { h: "#21160f", s: "#b5794f", k: "#1d2b53", w: "#fff1e8", b: "#29adff", r: "#5c2a1c" };

function Sprite() {
  return (
    <div className="d18b-sprite" aria-hidden>
      {sprite.join("").split("").map((c, i) => (
        <i key={i} style={c === "." ? undefined : { background: px[c] }} />
      ))}
    </div>
  );
}

function Bar({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="d18b-bar">
      <span>{label}</span>
      <span className="d18b-bar-track">
        <i style={{ width: `${value}%`, background: tone }} />
      </span>
      <span>{value}</span>
    </div>
  );
}

export function Header({ locale, d }: Chrome) {
  return (
    <header className="d18b-header">
      <Link href={`/${locale}`} className="d18b-logo">
        GABRIEL<span>QUEST</span>
      </Link>
      <nav className="d18b-nav" aria-label="Main">
        <NavLink href={`/${locale}/writing`}>{d.nav.writing}</NavLink>
        <NavLink href={`/${locale}/about`}>{d.nav.about}</NavLink>
      </nav>
      <div className="d18b-tools">
        <LocaleSwitch current={locale} />
        <ThemeToggle label={d.theme.toggle} />
      </div>
    </header>
  );
}

export function Footer({ locale }: Chrome) {
  return (
    <footer className="d18b-footer">
      <p className="d18b-blink">{t(locale, "PRESS START TO CONTINUE", "APERTE START PARA CONTINUAR")}</p>
      <p className="d18b-footer-links">
        {socialLinks().map((l) => (
          <a key={l.label} href={l.href}>
            ▶ {l.label}
          </a>
        ))}
      </p>
      <p className="d18b-small">© {new Date().getFullYear()} · {t(locale, "No microtransactions.", "Sem microtransações.")}</p>
    </footer>
  );
}

export function Home({ locale, d }: Chrome) {
  const entries = writing();
  const chapters = [...experience].sort((a, b) => a.start.localeCompare(b.start));
  const lv = yearsOfExperience();

  return (
    <div className="d18b">
      <RpgMenu
        intro={t(locale, "A wild RECRUITER appeared! What will you do?", "Um RECRUTADOR selvagem apareceu! O que você vai fazer?")}
        options={[
          { label: t(locale, "READ CV", "LER CV"), href: "#work" },
          { label: t(locale, "QUESTS", "MISSÕES"), href: "#quests" },
          { label: t(locale, "ITEMS", "ITENS"), href: "#items" },
          { label: t(locale, "RUN", "FUGIR"), reply: t(locale, "Can't escape! Gabriel is too interesting.", "Não dá pra fugir! O Gabriel é interessante demais.") },
        ]}
      />

      <section className="d18b-box d18b-world" aria-label={t(locale, "World map", "Mapa do mundo")}>
        <WorldMap
          stops={chapters.map((r) => ({ year: r.start.slice(0, 4), company: r.company, role: r.role[locale], current: !r.end }))}
          copy={{
            title: t(locale, "World map", "Mapa do mundo"),
            cleared: t(locale, "areas cleared", "áreas concluídas"),
            coins: t(locale, "coins", "moedas"),
            sound: t(locale, "Sound", "Som"),
            hint: t(locale, "Click a block (or ← →) to drive there. Every stop pays.", "Clique num bloco (ou ← →) pra dirigir até lá. Toda parada paga."),
            hintTouch: t(locale, "Tap ‹ › to drive. Tap the block for a coin.", "Toque ‹ › pra dirigir. Toque no bloco pra ganhar moeda."),
            oneUp: "1UP! " + t(locale, "Extra life: one more on-call shift.", "Vida extra: mais um plantão."),
            allVisited: t(locale, "ACHIEVEMENT: full career run!", "CONQUISTA: carreira completa!"),
          }}
        />
      </section>

      <div className="d18b-game">
        <aside className="d18b-box d18b-party">
          <p className="d18b-party-tag">{t(locale, "PARTY", "GRUPO")} · 1/1</p>
          <div className="d18b-portrait">
            <Sprite />
            <p className="d18b-lv">LV {lv}</p>
          </div>
          <h1 className="d18b-name">{profile.name}</h1>
          <dl className="d18b-dl">
            <div>
              <dt>{t(locale, "Class", "Classe")}</dt>
              <dd>{t(locale, "Backend Engineer", "Engenheiro Backend")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Guild", "Guilda")}</dt>
              <dd>Nuvy</dd>
            </div>
            <div>
              <dt>{t(locale, "Home", "Base")}</dt>
              <dd>São Paulo</dd>
            </div>
          </dl>
          <Bar label="HP" value={99} tone="#00e436" />
          <Bar label={t(locale, "COFFEE", "CAFÉ")} value={87} tone="#ffa300" />
          <Bar label="XP" value={Math.min(100, lv * 12)} tone="#29adff" />
          <p className="d18b-flavor">{profile.intro[locale]}</p>
        </aside>

        <section className="d18b-box d18b-story" id="work">
          <h2 className="d18b-h2">{t(locale, "Story so far", "A história até aqui")}</h2>
          <ol className="d18b-chapters">
            {chapters
              .map((r, i) => ({ r, i }))
              .reverse()
              .map(({ r, i }) => (
                <li key={r.start} id={`ch-${i + 1}`} className={!r.end ? "is-current" : ""}>
                  <span className="d18b-ch">
                    {t(locale, "CH.", "CAP.")} {i + 1}
                  </span>
                  <b>{r.role[locale]}</b>
                  <span className="d18b-where">
                    {r.company} · {r.start.slice(0, 4)}
                  </span>
                  <span className="d18b-what">{r.summary[locale]}</span>
                </li>
              ))}
          </ol>
        </section>

        <section className="d18b-box d18b-academy" id="school">
          <h2 className="d18b-h2">{t(locale, "Training grounds", "Campos de treino")}</h2>
          <ol className="d18b-scrolls">
            {education.map((e, i) => (
              <li key={e.school} className={`tone-${i}`}>
                <span className="d18b-crest" aria-hidden>
                  {["✦", "♜", "⚙"][i % 3]}
                </span>
                <span className="d18b-scroll-years">{e.years}</span>
                <b>{e.degree[locale]}</b>
                <span className="d18b-scroll-school">{e.school}</span>
                <span className="d18b-scroll-xp">+{[300, 500, 200][i % 3]} XP</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="d18b-box d18b-quests-box" id="quests">
          <h2 className="d18b-h2">{t(locale, "Quest log", "Diário de missões")}</h2>
          <ul className="d18b-quests">
            {entries.slice(0, 10).map((e) => (
              <li key={e.slug}>
                <Link href={entryHref(locale, e)}>
                  <span className={`d18b-check ${e.kind === "notes" && e.stage !== "evergreen" ? "is-open" : ""}`}>{e.kind === "notes" && e.stage !== "evergreen" ? "…" : "✔"}</span>
                  <span className="d18b-quest">
                    {e.title}
                    <small>
                      {formatDate(e.date, locale, "short")}
                      {e.tags.slice(0, 3).map((x) => ` · #${x}`).join("")}
                    </small>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={`/${locale}/writing`} className="d18b-more">
            ▶ {d.journal.allWriting}
          </Link>
        </section>


        <aside className="d18b-hud">
          <section className="d18b-box" id="items">
            <h2 className="d18b-h2">{t(locale, "Inventory", "Inventário")}</h2>
            <Chest
              labels={{ open: t(locale, "Click to open", "Clique pra abrir"), opened: t(locale, "Close chest", "Fechar baú") }}
              items={[
                ...profile.stack.map((name) => ({ name, icon: `/lab/stack/${icons[name]}.svg` })),
                { name: t(locale, "Idempotency key", "Chave de idempotência"), glyph: "🗝" },
              ]}
            />
          </section>
          <section className="d18b-box">
            <h2 className="d18b-h2">{t(locale, "Records", "Recordes")}</h2>
            <dl className="d18b-records">
              <div>
                <dt>{t(locale, "Quests done", "Missões feitas")}</dt>
                <dd>{entries.filter((e) => e.kind === "articles" || e.stage === "evergreen").length}</dd>
              </div>
              <div>
                <dt>{t(locale, "In progress", "Em andamento")}</dt>
                <dd>{entries.filter((e) => e.kind === "notes" && e.stage !== "evergreen").length}</dd>
              </div>
              <div>
                <dt>{t(locale, "Areas", "Áreas")}</dt>
                <dd>{chapters.length}</dd>
              </div>
              <div>
                <dt>{t(locale, "Play time", "Tempo de jogo")}</dt>
                <dd>{lv}y</dd>
              </div>
              <div>
                <dt>{t(locale, "Double charges", "Cobranças duplas")}</dt>
                <dd>0</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
