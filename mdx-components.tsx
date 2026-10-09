import type { MDXComponents } from "mdx/types";
import Link from "next/link";

function Sidenote({ children }: { children: React.ReactNode }) {
  return (
    <aside className="sidenote" role="note">
      {children}
    </aside>
  );
}

function Callout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="callout">
      {title && <p className="callout-title">{title}</p>}
      <div className="callout-body">{children}</div>
    </div>
  );
}

function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

const components: MDXComponents = {
  a: ({ href = "", children, ...rest }) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <Link href={href} {...rest}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noreferrer" {...rest}>
        {children}
      </a>
    ),
  Sidenote,
  Callout,
  Figure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
