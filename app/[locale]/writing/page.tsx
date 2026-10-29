import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WritingGrid } from "@/components/entry-list";
import { TagFilter } from "@/components/tag-filter";
import { allTags } from "@/lib/content";
import { writing } from "@/lib/lab";
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
    <section className="index-page" id="writing">
      <header className="page-head">
        <h1>{d.writing.title}</h1>
        <p>{d.writing.intro}</p>
      </header>
      <TagFilter tags={allTags(writing())} allLabel={d.notes.allTags} scopeId="writing" />
      <WritingGrid entries={writing()} locale={locale} d={d} />
    </section>
  );
}
