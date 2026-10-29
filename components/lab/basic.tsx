import Link from "next/link";
import { LocaleSwitch } from "@/components/locale-switch";
import { NavLink } from "@/components/nav-link";
import { ThemeToggle } from "@/components/theme";
import { socialLinks } from "@/components/site-footer";
import type { Dictionary, Locale } from "@/lib/i18n";

type Chrome = { locale: Locale; d: Dictionary };

/** Shared header/footer markup; each design styles `.{p}-header`, `.{p}-brand`, `.{p}-nav`, `.{p}-tools`, `.{p}-footer`. */
export function basicChrome(p: string, brand: React.ReactNode, footer: (locale: Locale) => React.ReactNode, opts: { theme?: boolean } = {}) {
  function Header({ locale, d }: Chrome) {
    return (
      <header className={`${p}-header`}>
        <Link href={`/${locale}`} className={`${p}-brand`}>
          {brand}
        </Link>
        <nav className={`${p}-nav`} aria-label="Main">
          <NavLink href={`/${locale}/writing`}>{d.nav.writing}</NavLink>
          <NavLink href={`/${locale}/about`}>{d.nav.about}</NavLink>
        </nav>
        <div className={`${p}-tools`}>
          <LocaleSwitch current={locale} />
          {opts.theme !== false && <ThemeToggle label={d.theme.toggle} />}
        </div>
      </header>
    );
  }
  function Footer({ locale }: Chrome) {
    return (
      <footer className={`${p}-footer`}>
        <span>{footer(locale)}</span>
        <span className={`${p}-footer-links`}>
          {socialLinks().map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </span>
      </footer>
    );
  }
  return { Header, Footer };
}
