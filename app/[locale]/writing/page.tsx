import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleList } from "@/components/entry-list";
import { entriesFor } from "@/lib/content";
import { dictionaries, isLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = dictionaries[locale];
  return { title: d.writing.title, description: d.writing.intro, alternates: { canonical: `/${locale}/writing` } };
}

export default async function Writing({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = dictionaries[locale];
  return (
    <section className="index-page">
      <header className="page-head">
        <h1>{d.writing.title}</h1>
        <p className="muted">{d.writing.intro}</p>
      </header>
      <ArticleList entries={entriesFor("articles", locale)} locale={locale} />
    </section>
  );
}
