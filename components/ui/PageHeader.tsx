export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="container-rr pb-10 pt-8 sm:pt-12">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="section-title mt-3 max-w-3xl">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-lg text-muted">{description}</p>}
    </header>
  );
}
