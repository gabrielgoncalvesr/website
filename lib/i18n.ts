export const locales = ["en", "pt-br"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const languageTags: Record<Locale, string> = { en: "en", "pt-br": "pt-BR" };
export const languageNames: Record<Locale, string> = { en: "English", "pt-br": "Português" };
export const ogLocales: Record<Locale, string> = { en: "en_US", "pt-br": "pt_BR" };

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

const en = {
  meta: {
    title: "Gabriel Gonçalves — Senior Backend Engineer",
    description:
      "Backend engineer writing about software architecture, distributed systems and the trade-offs in between.",
  },
  nav: { home: "Home", writing: "Writing", notes: "Notes", about: "About" },
  home: {
    writing: "Writing",
    writingHint: "Long-form, finished pieces.",
    notes: "Notes",
    notesHint: "Working notes. Some are sprouts, some are trees.",
    elsewhere: "Elsewhere",
    all: "All",
  },
  writing: {
    title: "Writing",
    intro: "Essays on software architecture, distributed systems and engineering practice.",
  },
  notes: {
    title: "Notes",
    intro:
      "A digital garden: notes that grow over time. Seedlings are rough, evergreens have settled. Read them as thinking in progress.",
    allTags: "All",
  },
  stage: { seedling: "Seedling", budding: "Budding", evergreen: "Evergreen" },
  post: {
    minRead: "min read",
    planted: "Planted",
    updated: "Updated",
    published: "Published",
    onThisPage: "On this page",
    back: "Back",
  },
  about: {
    title: "About",
    experience: "Experience",
    education: "Education",
    stack: "Toolbox",
    present: "present",
  },
  theme: { toggle: "Toggle theme" },
  notFound: { title: "Not found", body: "This page took a wrong turn somewhere.", home: "Go home" },
};

const ptbr: typeof en = {
  meta: {
    title: "Gabriel Gonçalves — Senior Backend Engineer",
    description:
      "Engenheiro backend escrevendo sobre arquitetura de software, sistemas distribuídos e os trade-offs no meio do caminho.",
  },
  nav: { home: "Início", writing: "Artigos", notes: "Notas", about: "Sobre" },
  home: {
    writing: "Artigos",
    writingHint: "Textos longos e fechados.",
    notes: "Notas",
    notesHint: "Notas de trabalho. Algumas são brotos, outras já viraram árvore.",
    elsewhere: "Em outros lugares",
    all: "Todos",
  },
  writing: {
    title: "Artigos",
    intro: "Ensaios sobre arquitetura de software, sistemas distribuídos e prática de engenharia.",
  },
  notes: {
    title: "Notas",
    intro:
      "Um jardim digital: notas que crescem com o tempo. Brotos são rascunhos, perenes já assentaram. Leia como pensamento em andamento.",
    allTags: "Todas",
  },
  stage: { seedling: "Broto", budding: "Crescendo", evergreen: "Perene" },
  post: {
    minRead: "min de leitura",
    planted: "Plantada",
    updated: "Atualizada",
    published: "Publicado",
    onThisPage: "Nesta página",
    back: "Voltar",
  },
  about: {
    title: "Sobre",
    experience: "Experiência",
    education: "Formação",
    stack: "Ferramentas",
    present: "atual",
  },
  theme: { toggle: "Alternar tema" },
  notFound: { title: "Não encontrado", body: "Essa página se perdeu no caminho.", home: "Voltar ao início" },
};

export type Dictionary = typeof en;
export const dictionaries: Record<Locale, Dictionary> = { en, "pt-br": ptbr };

export function formatDate(date: string, locale: Locale, style: "short" | "long" = "long") {
  const d = new Date(`${date}T12:00:00Z`);
  return new Intl.DateTimeFormat(languageTags[locale], {
    year: "numeric",
    month: style === "long" ? "long" : "short",
    ...(style === "long" ? { day: "numeric" } : {}),
    timeZone: "UTC",
  }).format(d);
}
