import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostView } from "@/components/post-view";
import { allEntries, getEntry, loadBody, translationsOf, type Kind } from "./content";
import { dictionaries, isLocale, locales, ogLocales } from "./i18n";
import { entryHref } from "./routes";
import { site } from "./site";

type Params = { params: Promise<{ locale: string; slug: string }> };

/** Shared implementation for /writing/[slug] and /notes/[slug]. */
export function postRoute(kind: Kind) {
  function generateStaticParams() {
    return locales.flatMap((locale) => allEntries(kind).map((e) => ({ locale, slug: e.slug })));
  }

  async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { locale, slug } = await params;
    const entry = getEntry(kind, slug);
    if (!entry || !isLocale(locale)) return {};
    const canonical = entryHref(entry.lang, entry);
    const languages = Object.fromEntries(
      [entry, ...translationsOf(entry)].map((e) => [e.lang === "pt-br" ? "pt-BR" : "en", entryHref(e.lang, e)]),
    );
    return {
      title: entry.title,
      description: entry.summary,
      alternates: { canonical, languages },
      openGraph: {
        type: "article",
        title: entry.title,
        description: entry.summary,
        url: `${site.url}${canonical}`,
        publishedTime: entry.date,
        modifiedTime: entry.updated,
        locale: ogLocales[entry.lang],
        tags: entry.tags,
      },
    };
  }

  async function Page({ params }: Params) {
    const { locale, slug } = await params;
    const entry = getEntry(kind, slug);
    if (!entry || !isLocale(locale)) notFound();
    const Body = await loadBody(kind, slug);
    return (
      <PostView entry={entry} translations={translationsOf(entry)} locale={locale} d={dictionaries[locale]}>
        <Body />
      </PostView>
    );
  }

  return { generateStaticParams, generateMetadata, Page };
}
