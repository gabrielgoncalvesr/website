import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { themeScript } from "@/components/theme";
import { dictionaries, isLocale, languageTags, locales, ogLocales } from "@/lib/i18n";
import { site } from "@/lib/site";
import "../globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

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
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#111110" },
  ],
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = dictionaries[locale];
  return (
    <html lang={languageTags[locale]} className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
      </body>
    </html>
  );
}
