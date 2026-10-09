import type { Locale } from "./i18n";

type L = Record<Locale, string>;

export const profile = {
  name: "Gabriel Gonçalves",
  role: { en: "Senior Backend Engineer", "pt-br": "Senior Backend Engineer" } satisfies L,
  location: { en: "São Paulo, Brazil · remote", "pt-br": "São Paulo, Brasil · remoto" } satisfies L,
  stack: ["Go", ".NET", "C#", "Java", "PostgreSQL", "AWS", "Kubernetes", "Datadog"],
  intro: {
    en: "I build the backend systems that move money: payment gateways, card platforms and the plumbing that keeps them honest under load. Eight years in, from intern to tech lead, now a senior engineer at Nuvy.",
    "pt-br":
      "Construo os sistemas backend que movem dinheiro: gateways de pagamento, plataformas de cartão e o encanamento que mantém tudo honesto sob carga. Oito anos de estrada, de estagiário a tech lead, hoje engenheiro sênior na Nuvy.",
  } satisfies L,
  about: {
    en: [
      "Most of my work lives where correctness matters more than cleverness: idempotent payment flows, transactional boundaries, pool sizing, the query that is fine until it isn't.",
      "I write here to think in public about software architecture — the patterns, the trade-offs and the incidents that taught them to me.",
    ],
    "pt-br": [
      "A maior parte do meu trabalho vive onde correção importa mais que esperteza: fluxos de pagamento idempotentes, fronteiras transacionais, dimensionamento de pool, a query que está ok até deixar de estar.",
      "Escrevo aqui para pensar em voz alta sobre arquitetura de software — os padrões, os trade-offs e os incidentes que me ensinaram cada um.",
    ],
  } satisfies Record<Locale, string[]>,
};

export type Job = {
  company: string;
  role: L;
  start: string; // YYYY-MM
  end?: string;
  tags: string[];
  summary: L;
};

export const experience: Job[] = [
  {
    company: "Nuvy",
    role: { en: "Senior Software Engineer", "pt-br": "Senior Software Engineer" },
    start: "2026-04",
    tags: ["go", "card-issuing", "aws"],
    summary: {
      en: "Card issuing and payment platform services. Performance, reliability and the occasional 3am trace.",
      "pt-br": "Serviços da plataforma de emissão de cartões e pagamentos. Performance, confiabilidade e um trace às 3h da manhã de vez em quando.",
    },
  },
  {
    company: "Lyra",
    role: { en: "Tech Lead · Senior .NET Developer", "pt-br": "Tech Lead · Senior .NET Developer" },
    start: "2024-09",
    end: "2026-04",
    tags: ["c#", "leadership", "payment-gateway"],
    summary: {
      en: "Led the team behind payment gateway integrations; owned architecture decisions and delivery.",
      "pt-br": "Liderei o time de integrações com gateways de pagamento; dono das decisões de arquitetura e entrega.",
    },
  },
  {
    company: "Lyra",
    role: { en: ".NET Developer", "pt-br": "Desenvolvedor .NET" },
    start: "2022-12",
    end: "2024-09",
    tags: ["c#", ".net", "leadership"],
    summary: {
      en: "Grew from mid-level into leading parts of the team and its technical direction.",
      "pt-br": "Cresci de pleno para liderar partes do time e sua direção técnica.",
    },
  },
  {
    company: "Lyra",
    role: { en: "Junior .NET Developer", "pt-br": "Desenvolvedor .NET Júnior" },
    start: "2021-10",
    end: "2022-11",
    tags: ["c#", "payment-gateway"],
    summary: {
      en: "Took over a payment project end to end when its only developer left.",
      "pt-br": "Assumi um projeto de pagamentos de ponta a ponta quando o único dev saiu.",
    },
  },
  {
    company: "Lyra",
    role: { en: "Java Developer", "pt-br": "Desenvolvedor Java" },
    start: "2020-10",
    end: "2021-10",
    tags: ["java", "javascript"],
    summary: { en: "Mid-level on Java systems, broader ownership.", "pt-br": "Pleno em sistemas Java, com mais responsabilidade." },
  },
  {
    company: "Lyra",
    role: { en: "Junior Java Developer", "pt-br": "Desenvolvedor Java Júnior" },
    start: "2019-07",
    end: "2020-10",
    tags: ["java", "shell"],
    summary: { en: "First full-time role, Java and shell automation.", "pt-br": "Primeiro emprego efetivo, Java e automação em shell." },
  },
  {
    company: "Lyra",
    role: { en: "Backend Intern", "pt-br": "Estagiário Back-end" },
    start: "2018-09",
    end: "2019-07",
    tags: ["java", "shell"],
    summary: { en: "Where it started.", "pt-br": "Onde tudo começou." },
  },
];

export const education = [
  { school: "FIAP", degree: { en: "MBA, Software Engineering", "pt-br": "MBA, Engenharia de Software" }, years: "2024–2025" },
  { school: "Universidade de Mogi das Cruzes", degree: { en: "B.Sc. Information Systems", "pt-br": "Bacharelado em Sistemas de Informação" }, years: "2018–2021" },
  { school: "ETEC", degree: { en: "Technical degree, IT", "pt-br": "Técnico em Informática" }, years: "2017–2018" },
] satisfies { school: string; degree: L; years: string }[];

export function yearsOfExperience(now = new Date()) {
  return now.getFullYear() - 2018;
}
