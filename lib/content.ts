import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

export type Kind = "articles" | "notes";
export type Stage = "seedling" | "budding" | "evergreen";

export type Frontmatter = {
  title: string;
  summary: string;
  date: string; // YYYY-MM-DD, published (articles) or planted (notes)
  updated?: string;
  tags?: string[];
  stage?: Stage; // notes only
  draft?: boolean;
};

export type Heading = { depth: 2 | 3; text: string; id: string };

export type Entry = Frontmatter & {
  kind: Kind;
  slug: string;
  tags: string[];
  readingMinutes: number;
  headings: Heading[];
};

const root = path.join(process.cwd(), "content");
const showDrafts = process.env.NODE_ENV !== "production";

function toDate(v: unknown) {
  return v instanceof Date ? v.toISOString().slice(0, 10) : String(v);
}

function extractHeadings(body: string): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  let inFence = false;
  for (const line of body.split("\n")) {
    if (line.startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const m = /^(##|###)\s+(.+?)\s*$/.exec(line);
    if (m) {
      const text = m[2].replace(/[`*_]/g, "");
      out.push({ depth: m[1].length as 2 | 3, text, id: slugger.slug(text) });
    }
  }
  return out;
}

function read(kind: Kind, file: string): Entry {
  const slug = file.replace(/\.mdx$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(root, kind, file), "utf8"));
  const fm = data as Frontmatter;
  if (!fm.title || !fm.date) {
    throw new Error(`content/${kind}/${file}: frontmatter needs title and date`);
  }
  const words = content.replace(/```[\s\S]*?```/g, "").split(/\s+/).filter(Boolean).length;
  return {
    ...fm,
    date: toDate(fm.date),
    updated: fm.updated ? toDate(fm.updated) : undefined,
    kind,
    slug,
    tags: fm.tags ?? [],
    readingMinutes: Math.max(1, Math.round(words / 220)),
    headings: extractHeadings(content),
  };
}

const cache = new Map<Kind, Entry[]>();

/** Every file of a kind, newest first. */
export function allEntries(kind: Kind): Entry[] {
  if (!cache.has(kind) || showDrafts) {
    const dir = path.join(root, kind);
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")) : [];
    const entries = files
      .map((f) => read(kind, f))
      .filter((e) => showDrafts || !e.draft)
      .sort((a, b) => lastTouched(b).localeCompare(lastTouched(a)));
    cache.set(kind, entries);
  }
  return cache.get(kind)!;
}

export function lastTouched(e: Pick<Entry, "date" | "updated">) {
  return e.updated ?? e.date;
}

export function getEntry(kind: Kind, slug: string) {
  return allEntries(kind).find((e) => e.slug === slug);
}

export async function loadBody(kind: Kind, slug: string) {
  const mod = await import(`@/content/${kind}/${slug}.mdx`);
  return mod.default as React.ComponentType;
}

export function allTags(entries: Entry[]) {
  const count = new Map<string, number>();
  for (const e of entries) for (const t of e.tags) count.set(t, (count.get(t) ?? 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
}
