import { allEntries, getEntry } from "@/lib/content";
import { locales } from "@/lib/i18n";
import { ogCard, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const size = ogSize;
export const contentType = "image/png";
export const alt = site.name;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getEntry("notes", slug);
  return ogCard({
    eyebrow: "notes",
    title: entry?.title ?? site.name,
    footer: `${site.name} · ${new URL(site.url).host}`,
  });
}

export function generateStaticParams() {
  return locales.flatMap((locale) => allEntries("notes").map((e) => ({ locale, slug: e.slug })));
}
