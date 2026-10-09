import { allEntries } from "@/lib/content";
import { dictionaries } from "@/lib/i18n";
import { site } from "@/lib/site";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const dynamic = "force-static";

export function GET() {
  const items = [...allEntries("articles"), ...allEntries("notes")]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((e) => {
      const url = `${site.url}/en/${e.kind === "articles" ? "writing" : "notes"}/${e.slug}`;
      return `<item><title>${esc(e.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(
        `${e.date}T12:00:00Z`,
      ).toUTCString()}</pubDate><description>${esc(e.summary)}</description>${e.tags
        .map((t) => `<category>${esc(t)}</category>`)
        .join("")}</item>`;
    })
    .join("");
  const d = dictionaries.en.meta;
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(
    d.title,
  )}</title><link>${site.url}</link><description>${esc(d.description)}</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
