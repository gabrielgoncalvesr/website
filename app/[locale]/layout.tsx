import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Bricolage_Grotesque,
  Caveat,
  IBM_Plex_Mono,
  Fraunces,
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Inter_Tight,
  JetBrains_Mono,
  Newsreader,
  Press_Start_2P,
  Shippori_Mincho,
} from "next/font/google";
import { notFound } from "next/navigation";
import { DesignSwitcher } from "@/components/lab/design-switcher";
import { chrome } from "@/components/lab/chrome";
import { cookies } from "next/headers";
import { ThemeSync } from "@/components/theme";
import { dictionaries, isLocale, languageTags, locales, ogLocales } from "@/lib/i18n";
import { getDesign } from "@/lib/lab";
import { site } from "@/lib/site";
import "../globals.css";
import "../journal.css";
import "../lab/lab.css";
import "../lab/d1b.css";
import "../lab/d2c.css";
import "../lab/d4b.css";
import "../lab/d18b.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  axes: ["opsz"],
});
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-tight", style: ["normal", "italic"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jet" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", style: ["normal", "italic"], axes: ["opsz", "SOFT"] });
const instrument = Instrument_Serif({ subsets: ["latin"], variable: "--font-instrument", weight: "400", style: ["normal", "italic"] });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", axes: ["opsz", "wdth"] });

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", axes: ["wdth"] });
const plex = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-plex", weight: ["400", "500", "700"] });

const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const pixel = Press_Start_2P({ subsets: ["latin"], variable: "--font-pixel", weight: "400" });
const mincho = Shippori_Mincho({ subsets: ["latin"], variable: "--font-mincho", weight: ["400", "600", "800"] });

const fontVars = [sans, mono, serif, interTight, jetbrains, fraunces, instrument, bricolage, archivo, plex, caveat, pixel, mincho].map((f) => f.variable).join(" ");

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

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
  const design = await getDesign();
  const { Header, Footer } = chrome[design];
  const saved = (await cookies()).get("theme")?.value;
  const theme = saved === "light" || saved === "dark" ? saved : undefined;
  return (
    <html lang={languageTags[locale]} className={fontVars} data-design={design} data-theme={theme} suppressHydrationWarning>
      <body>
        <ThemeSync />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="shell">
          <Header locale={locale} d={d} />
          <main id="main">{children}</main>
          <Footer locale={locale} d={d} />
        </div>
        <DesignSwitcher current={design} />
      </body>
    </html>
  );
}
