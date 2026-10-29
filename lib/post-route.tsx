import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostView } from "@/components/post-view";
import { allEntries, getEntry, loadBody, type Kind } from "./content";
import { dictionaries, isLocale, locales, ogLocales } from "./i18n";
import { entryHref } from "./routes";
import { site } from "./site";

type Params = { params: Promise<{ locale: string; slug: string }> };

/** /writing/[slug] serves both articles and notes; slugs are unique across the two. */
export function postRoute(kinds: Kind[]) {
  const find = (slug: string) => kinds.map((k) => getEntry(k, slug)).find(Boolean);

  function generateStaticParams() {
    return locales.flatMap((locale) => kinds.flatMap((k) => allEntries(k)).map((e) => ({ locale, slug: e.slug })));
  }

  async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { locale, slug } = await params;
    const entry = find(slug);
    if (!entry || !isLocale(locale)) return {};
    const canonical = entryHref("en", entry);
    return {
      title: entry.title,
      description: entry.summary,
      alternates: { canonical },
      openGraph: {
        type: "article",
        title: entry.title,
        description: entry.summary,
        url: `${site.url}${canonical}`,
        publishedTime: entry.date,
        modifiedTime: entry.updated,
        locale: ogLocales.en,
        tags: entry.tags,
      },
    };
  }

  async function Page({ params }: Params) {
    const { locale, slug } = await params;
    const entry = find(slug);
    if (!entry || !isLocale(locale)) notFound();
    const Body = await loadBody(entry.kind, slug);
    return (
      <PostView entry={entry} locale={locale} d={dictionaries[locale]}>
        <Body />
      </PostView>
    );
  }

  return { generateStaticParams, generateMetadata, Page };
}
