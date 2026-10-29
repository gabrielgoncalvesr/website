import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  pageExtensions: ["ts", "tsx", "mdx"],
  // Notes used to live under /notes; everything is "writing" now.
  async redirects() {
    return [
      { source: "/:locale(en|pt-br)/notes", destination: "/:locale/writing", permanent: true },
      { source: "/:locale(en|pt-br)/notes/:slug", destination: "/:locale/writing/:slug", permanent: true },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-gfm",
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
    ],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-pretty-code",
        {
          theme: { light: "github-light", dark: "github-dark-dimmed" },
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(config);
