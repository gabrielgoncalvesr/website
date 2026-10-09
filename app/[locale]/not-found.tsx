import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">404</p>
      <h1>Not found · Não encontrado</h1>
      <p className="muted">This page took a wrong turn somewhere.</p>
      <Link href="/">← Home</Link>
    </section>
  );
}
