import type { Entry, Kind } from "./content";
import type { Locale } from "./i18n";

/** Articles and notes share one section: everything lives under /writing. */
export const section: Record<Kind, "writing"> = { articles: "writing", notes: "writing" };

export function entryHref(locale: Locale, e: Pick<Entry, "kind" | "slug">) {
  return `/${locale}/${section[e.kind]}/${e.slug}`;
}
