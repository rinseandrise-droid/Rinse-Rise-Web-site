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
    <header className="container-rr pb-6 pt-6 sm:pb-10 sm:pt-12">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="section-title mt-3 max-w-3xl">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-base text-muted sm:mt-4 sm:text-lg">{description}</p>}
    </header>
  );
}
