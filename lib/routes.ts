import type { Entry, Kind } from "./content";
import type { Locale } from "./i18n";

export const section: Record<Kind, "writing" | "notes"> = { articles: "writing", notes: "notes" };

export function entryHref(locale: Locale, e: Pick<Entry, "kind" | "slug">) {
  return `/${locale}/${section[e.kind]}/${e.slug}`;
}
