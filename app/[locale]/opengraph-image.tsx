import { dictionaries, isLocale, locales } from "@/lib/i18n";
import { ogCard, ogSize } from "@/lib/og";
import { profile } from "@/lib/profile";
import { site } from "@/lib/site";

export const size = ogSize;
export const contentType = "image/png";
export const alt = site.name;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "en";
  return ogCard({
    eyebrow: profile.role[l],
    title: profile.name,
    footer: dictionaries[l].meta.description,
  });
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
