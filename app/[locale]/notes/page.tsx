import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoteList } from "@/components/entry-list";
import { TagFilter } from "@/components/tag-filter";
import { allTags, allEntries } from "@/lib/content";
import { dictionaries, isLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = dictionaries[locale];
  return { title: d.notes.title, description: d.notes.intro, alternates: { canonical: `/${locale}/notes` } };
}

export default async function Notes({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = dictionaries[locale];
  const entries = allEntries("notes");
  return (
    <section className="index-page" id="garden">
      <header className="page-head">
        <h1>{d.notes.title}</h1>
        <p className="muted">{d.notes.intro}</p>
      </header>
      <TagFilter tags={allTags(entries)} allLabel={d.notes.allTags} scopeId="garden" />
      <NoteList entries={entries} locale={locale} d={d} />
    </section>
  );
}
