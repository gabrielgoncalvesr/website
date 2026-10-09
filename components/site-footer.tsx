import type { Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";

export function socialLinks() {
  return [
    { label: "GitHub", href: site.links.github },
    { label: "LinkedIn", href: site.links.linkedin },
    { label: "Email", href: site.links.email ? `mailto:${site.links.email}` : "" },
    { label: "RSS", href: "/feed.xml" },
  ].filter((l) => l.href);
}

export function SiteFooter({ d }: { d: Dictionary }) {
  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  );
}
