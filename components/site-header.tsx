import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { LocaleSwitch } from "./locale-switch";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme";

export function SiteHeader({ locale, d }: { locale: Locale; d: Dictionary }) {
  return (
    <header className="site-header">
      <Link href={`/${locale}`} className="wordmark">
        <span className="wordmark-path">~/</span>Gabriel Gonçalves
      </Link>
      <nav className="site-nav" aria-label="Main">
        <NavLink href={`/${locale}/writing`}>{d.nav.writing}</NavLink>
        <NavLink href={`/${locale}/notes`}>{d.nav.notes}</NavLink>
        <NavLink href={`/${locale}/about`}>{d.nav.about}</NavLink>
      </nav>
      <div className="site-tools">
        <LocaleSwitch current={locale} />
        <ThemeToggle label={d.theme.toggle} />
      </div>
    </header>
  );
}
