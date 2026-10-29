import Link from "next/link";
import { LocaleSwitch } from "@/components/locale-switch";
import { NavLink } from "@/components/nav-link";
import { ThemeToggle } from "@/components/theme";
import { socialLinks } from "@/components/site-footer";
import { allTags, type Entry } from "@/lib/content";
import type { Dictionary, Locale } from "@/lib/i18n";
import { rolesNewestFirst, t, writing } from "@/lib/lab";
import { education, profile, yearsOfExperience } from "@/lib/profile";
import { entryHref } from "@/lib/routes";
import { site } from "@/lib/site";
import { Clock } from "./bits";
import { ConsolePrompt } from "./console-prompt-c";
import { Session } from "./session";

type Chrome = { locale: Locale; d: Dictionary };

/** Deterministic fake commit hash. */
function hash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function lsDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${months[Number(m) - 1]} ${d.padStart(2, " ")} ${y}`;
}

/** One step of the session: the command types itself, then each `data-ln` line prints. */
function Block({ cmd, children, id }: { cmd: string; children: React.ReactNode; id?: string }) {
  return (
    <section className="d2c-block" data-step="wait">
      <p className="d2c-cmd" id={id}>
        <span className="d2c-ps1">gabriel@sp:~$</span>{" "}
        <span className="d2c-typed" data-cmd style={{ "--n": cmd.length } as React.CSSProperties}>
          {cmd}
        </span>
        <span className="d2c-caret" aria-hidden />
      </p>
      <div className="d2c-out">{children}</div>
    </section>
  );
}

export function Header({ locale, d }: Chrome) {
  return (
    <header className="d2c-header">
      <Link href={`/${locale}`} className="d2c-host">
        <span className="d2c-dot" aria-hidden />
        gabriel@sp<span className="d2c-dim">:~</span>
      </Link>
      <nav className="d2c-tabs" aria-label="Main">
        <NavLink href={`/${locale}/writing`}>{d.nav.writing.toLowerCase()}/</NavLink>
        <NavLink href={`/${locale}/about`}>{d.nav.about.toLowerCase()}/</NavLink>
      </nav>
      <div className="d2c-tools">
        <span className="d2c-dim">
          <Clock withZone={false} />
        </span>
        <LocaleSwitch current={locale} />
        <ThemeToggle label={d.theme.toggle} />
      </div>
    </header>
  );
}

export function Footer({ locale }: Chrome) {
  return (
    <footer className="d2c-footer">
      <span>
        <span className="d2c-ok">●</span> {t(locale, "all systems operational", "todos os sistemas operacionais")}
      </span>
      <span className="d2c-footer-links">
        {socialLinks().map((l) => (
          <a key={l.label} href={l.href}>
            {l.label.toLowerCase()}
          </a>
        ))}
      </span>
      <span className="d2c-dim">exit 0 · {new Date().getFullYear()}</span>
    </footer>
  );
}

function file(e: Entry) {
  return `${e.slug.replace(/^sample-/, "")}.mdx`;
}

const steps = ["whoami", "git log --graph career", "ls -lt writing/", "cat stack.json", "./shell --interactive"];

export function Home({ locale, d }: Chrome) {
  const entries = writing();
  const roles = rolesNewestFirst();
  const tags = allTags(entries);

  return (
    <Session className="d2c" start={900} gap={650}>
      <noscript>
        <style>{`.d2c [data-step] *, .d2c [data-ln] { visibility: visible !important; opacity: 1 !important; }`}</style>
      </noscript>

      <aside className="d2c-side" aria-label={t(locale, "System info", "Info do sistema")}>
        <div className="d2c-pane">
          <p className="d2c-pane-title">neofetch</p>
          <div className="d2c-fetch">
            <pre className="d2c-logo" aria-hidden>
              {"  ____\n / ___|\n| |  _ \n| |_| |\n \\____|"}
            </pre>
            <dl>
              <div>
                <dt>user</dt>
                <dd>gabriel@sp</dd>
              </div>
              <div>
                <dt>role</dt>
                <dd>{profile.role[locale]}</dd>
              </div>
              <div>
                <dt>host</dt>
                <dd>Nuvy</dd>
              </div>
              <div>
                <dt>uptime</dt>
                <dd>{yearsOfExperience()}y</dd>
              </div>
              <div>
                <dt>shell</dt>
                <dd>Go, C#, Java</dd>
              </div>
              <div>
                <dt>pkgs</dt>
                <dd>
                  {entries.length} {t(locale, "posts", "textos")}
                </dd>
              </div>
              <div>
                <dt>time</dt>
                <dd>
                  <Clock />
                </dd>
              </div>
            </dl>
          </div>
          <p className="d2c-swatch" aria-hidden>
            {["var(--accent)", "var(--green)", "var(--cyan)", "var(--pink)", "var(--fg)", "var(--muted)"].map((c) => (
              <i key={c} style={{ background: c }} />
            ))}
          </p>
        </div>

        <div className="d2c-pane">
          <p className="d2c-pane-title">history</p>
          <ol className="d2c-toc">
            {steps.map((c, i) => (
              <li key={c} data-step-ref={i} data-state="wait">
                <span className="d2c-toc-n">{String(i + 1).padStart(2, " ")}</span> {c}
              </li>
            ))}
          </ol>
        </div>

        <div className="d2c-pane">
          <p className="d2c-pane-title">tags</p>
          <p className="d2c-tags">
            {tags.slice(0, 12).map((x) => (
              <Link key={x} href={`/${locale}/writing?tag=${encodeURIComponent(x)}`}>
                #{x}
              </Link>
            ))}
          </p>
        </div>
      </aside>

      <div className="d2c-main">
        <Block cmd={steps[0]}>
          <h1 className="d2c-name" data-ln>
            {profile.name}
          </h1>
          <p className="d2c-role" data-ln>
            <span className="d2c-key">role</span> {profile.role[locale]} <span className="d2c-dim">@</span> Nuvy
          </p>
          <p className="d2c-role" data-ln>
            <span className="d2c-key">loc </span> {profile.location[locale]}
          </p>
          <p className="d2c-intro" data-ln>
            {profile.intro[locale]}
          </p>
        </Block>

        <Block cmd={steps[1]} id="work">
          <ol className="d2c-graph">
            {roles.map((r, i) => (
              <li key={r.start} className={r.company === "Nuvy" ? "is-nuvy" : ""} data-ln>
                <span className="d2c-lane" aria-hidden>
                  *
                </span>
                <span className="d2c-commit">
                  <span className="d2c-hash">{hash(r.start + r.company)}</span>{" "}
                  {i === 0 && <span className="d2c-ref">(HEAD -&gt; {r.company.toLowerCase()})</span>}
                  {i > 0 && roles[i - 1].company !== r.company && <span className="d2c-ref is-tag">(tag: {r.company.toLowerCase()})</span>}{" "}
                  <b>{r.role[locale]}</b> <span className="d2c-dim">· {r.start}</span>
                  <span className="d2c-msg">{r.summary[locale]}</span>
                </span>
              </li>
            ))}
            <li className="d2c-root" data-ln>
              <span className="d2c-lane" aria-hidden>
                *
              </span>
              <span className="d2c-commit">
                <span className="d2c-hash">0000000</span> <span className="d2c-dim">init: </span>
                {education
                  .slice()
                  .reverse()
                  .map((e) => `${e.school} (${e.years})`)
                  .join(" → ")}
              </span>
            </li>
          </ol>
        </Block>

        <Block cmd={steps[2]}>
          <p className="d2c-dim" data-ln>
            total {entries.length}
          </p>
          <ul className="d2c-ls">
            {entries.slice(0, 12).map((e) => (
              <li key={e.slug} data-ln>
                <Link href={entryHref(locale, e)}>
                  <span className="d2c-dim">{e.kind === "notes" ? "-rw-rw-r--" : "-rw-r--r--"}</span>
                  <span className="d2c-size">{e.kind === "notes" ? (e.stage ? d.stage[e.stage].toLowerCase() : "note") : `${e.readingMinutes}min`}</span>
                  <span className="d2c-dim">{lsDate(e.date)}</span>
                  <span className="d2c-file">{file(e)}</span>
                  <span className="d2c-title">{e.tags.slice(0, 3).map((x) => `#${x}`).join(" ")}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={`/${locale}/writing`} className="d2c-more" data-ln>
            … {d.journal.allWriting.toLowerCase()} →
          </Link>
        </Block>

        <Block cmd={steps[3]}>
          <pre className="d2c-json">
            <span data-ln>{"{\n"}</span>
            {[
              ["languages", ["Go", "C#", "Java"]],
              ["platforms", [".NET", "PostgreSQL", "AWS", "Kubernetes"]],
              ["observability", ["Datadog", "OpenTelemetry"]],
              ["domains", ["payments", "card issuing", "ledgers"]],
            ].map(([k, v], i, all) => (
              <span key={k as string} data-ln>
                {"  "}
                <span className="d2c-k">&quot;{k as string}&quot;</span>: [
                {(v as string[]).map((x, j) => (
                  <span key={x}>
                    <span className="d2c-s">&quot;{x}&quot;</span>
                    {j < (v as string[]).length - 1 ? ", " : ""}
                  </span>
                ))}
                ]{i < all.length - 1 ? "," : ""}
                {"\n"}
              </span>
            ))}
            <span data-ln>{"}"}</span>
          </pre>
        </Block>

        <Block cmd={steps[4]}>
          <p className="d2c-dim d2c-hint" data-ln>
            {t(locale, "your turn ↓ try help", "sua vez ↓ tente help")}
          </p>
          <div data-ln>
            <ConsolePrompt
              locale={locale}
              github={site.links.github}
              posts={entries.filter((e) => e.kind === "articles").map((a) => ({ title: a.title, href: entryHref(locale, a), file: file(a) }))}
              notes={entries.filter((e) => e.kind === "notes").map((n) => ({ title: n.title, href: entryHref(locale, n), file: file(n) }))}
            />
          </div>
        </Block>
      </div>
    </Session>
  );
}
