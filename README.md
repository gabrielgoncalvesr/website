# gabriel-site

Personal site + blog. Next.js 16 (App Router) · React 19 · Tailwind 4 · MDX.

```sh
npm ci
npm run dev
npm run build
```

## Writing

- `content/articles/*.mdx` — finished, long-form pieces.
- `content/notes/*.mdx` — digital garden; notes carry a `stage`.

Frontmatter:

```yaml
title: Required
summary: One or two sentences
date: 2026-10-09        # published (articles) / planted (notes)
updated: 2026-10-12     # optional
tags: [architecture, go]
stage: seedling         # notes: seedling | budding | evergreen
draft: true             # optional; hidden in production builds
```

Posts are written in English. Only the site chrome (nav, labels, profile) is translated to `pt-br`;
`/` always goes to `/en`.

MDX components: `<Sidenote>`, `<Callout title="">`, `<Figure src alt caption />`.

Profile, experience and links live in `lib/profile.ts` and `lib/site.ts`.

## Hosting

Vercel, Next.js preset, no env vars. Target domain `gabriel.mosaic-labs.co` (CNAME to Vercel).

## Design lines

Two designs on top of this base, each in its own worktree:

| Branch | Worktree | Port |
| --- | --- | --- |
| `design/v1-sober` | `../gabriel-site-v1` | 3050 |
| `design/v2-creative` | `../gabriel-site-v2` | 3051 |
| `design/v3` | `../gabriel-site-v3` | 3052 |

Pick one, merge it into `main`, then `git worktree remove` the other.
