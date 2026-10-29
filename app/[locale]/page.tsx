import { notFound } from "next/navigation";
import { chrome } from "@/components/lab/chrome";
import { dictionaries, isLocale } from "@/lib/i18n";
import { getDesign } from "@/lib/lab";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { Home: Page } = chrome[await getDesign()];
  return <Page locale={locale} d={dictionaries[locale]} />;
}
