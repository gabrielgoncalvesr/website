/** Editorial two-column band: a narrow label column and a wide body. */
export function Band({
  id,
  label,
  hint,
  aside,
  children,
}: {
  id?: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="band" aria-labelledby={id ? `${id}-h` : undefined}>
      <header className="band-head">
        <h2 id={id ? `${id}-h` : undefined} className="band-label">
          <span className="band-mark" aria-hidden>
            §
          </span>
          {label}
        </h2>
        {hint && <p className="band-hint">{hint}</p>}
        {aside}
      </header>
      <div className="band-body">{children}</div>
    </section>
  );
}
