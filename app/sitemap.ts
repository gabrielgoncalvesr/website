import type { MetadataRoute } from "next";
import { allEntries, lastTouched } from "@/lib/content";
import { locales } from "@/lib/i18n";
import { entryHref } from "@/lib/routes";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/writing", "/about"].flatMap((p) =>
    locales.map((l) => ({ url: `${site.url}/${l}${p}` })),
  );
  const posts = (["articles", "notes"] as const).flatMap((kind) =>
    allEntries(kind).flatMap((e) =>
      locales.map((l) => ({
        url: `${site.url}${entryHref(l, e)}`,
        lastModified: lastTouched(e),
      })),
    ),
  );
  return [...pages, ...posts];
}
