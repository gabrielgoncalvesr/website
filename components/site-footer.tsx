import type { Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";

export function socialLinks() {
  return [
    { label: "GitHub", href: site.links.github },
    { label: "LinkedIn", href: site.links.linkedin },
    { label: "Email", href: site.links.email ? `mailto:${site.links.email}` : "" },
  ].filter((l) => l.href);
}

export function SiteFooter({ d }: { d: Dictionary }) {
  return (
    <footer className="site-footer">
      <p className="footer-name">
        <span className="wordmark-path">~/</span>
        {site.name} · {new Date().getFullYear()}
      </p>
      <ul className="footer-links">
        {socialLinks().map((l) => (
          <li key={l.label}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
        <li>
          <a href="#main">{d.journal.backToTop} ↑</a>
        </li>
      </ul>
    </footer>
  );
}
