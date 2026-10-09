import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { themeScript } from "@/components/theme";
import { AccentPicker, accentScript } from "@/components/v3/accent-picker";
import { dictionaries, isLocale, languageTags, locales, ogLocales } from "@/lib/i18n";
import { site } from "@/lib/site";
import "../globals.css";
import "../journal.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = dictionaries[locale];
  return {
    metadataBase: new URL(site.url),
    title: { default: d.meta.title, template: `%s — ${site.name}` },
    description: d.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", "pt-BR": "/pt-br", "x-default": "/en" },
      types: { "application/rss+xml": "/feed.xml" },
    },
    openGraph: { siteName: site.name, type: "website", locale: ogLocales[locale] },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f1" },
    { media: "(prefers-color-scheme: dark)", color: "#121311" },
  ],
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = dictionaries[locale];
  return (
    <html lang={languageTags[locale]} className={`${sans.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript + accentScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="shell">
          <SiteHeader locale={locale} d={d} />
          <main id="main">{children}</main>
          <SiteFooter d={d} />
        </div>
        <AccentPicker />
      </body>
    </html>
  );
}
