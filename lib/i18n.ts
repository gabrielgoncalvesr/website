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
  journal: {
    statement: ["I build backend systems that move money, and write about the", "architecture", "behind them."],
    spec: { now: "Now", based: "Based", before: "Before", stack: "Stack", focus: "Thinking about" },
    nowValue: "Senior Software Engineer at Nuvy",
    basedValue: "São Paulo · remote",
    beforeValue: "7 years at Lyra, intern → tech lead",
    latest: "Latest",
    read: "Read",
    garden: "From the garden",
    topics: "I write about",
    more: "More notes",
    allWriting: "All writing",
    backToTop: "Back to top",
    traceHint: "Eight years as a timeline. Hover a role for its tags.",
    background: "Background",
    backgroundHint: "Where I've worked and what I studied.",
    work: "Work",
    fullStory: "Full story",
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
  journal: {
    statement: ["Construo sistemas backend que movem dinheiro, e escrevo sobre a", "arquitetura", "por trás deles."],
    spec: { now: "Agora", based: "Base", before: "Antes", stack: "Stack", focus: "Pensando em" },
    nowValue: "Senior Software Engineer na Nuvy",
    basedValue: "São Paulo · remoto",
    beforeValue: "7 anos na Lyra, estagiário → tech lead",
    latest: "Mais recente",
    read: "Ler",
    garden: "Do jardim",
    topics: "Escrevo sobre",
    more: "Mais notas",
    allWriting: "Todos os artigos",
    backToTop: "Voltar ao topo",
    traceHint: "Oito anos numa linha do tempo. Passe o mouse num cargo para ver as tags.",
    background: "Trajetória",
    backgroundHint: "Onde trabalhei e o que estudei.",
    work: "Trabalho",
    fullStory: "História completa",
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
