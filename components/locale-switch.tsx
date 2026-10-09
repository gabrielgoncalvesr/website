"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

const short: Record<Locale, string> = { en: "EN", "pt-br": "PT" };

export function LocaleSwitch({ current }: { current: Locale }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(en|pt-br)(?=\/|$)/, "");
  return (
    <div className="locale-switch" role="group" aria-label="Language">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          aria-current={l === current ? "true" : undefined}
          className="locale-link"
        >
          {short[l]}
        </Link>
      ))}
    </div>
  );
}
