import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPolicy, policies } from "@/data/policies";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/policies/[slug]">) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) return {};
  return pageMetadata({ title: policy.title, description: policy.summary, path: `/policies/${policy.slug}` });
}

export default async function PolicyPage({ params }: PageProps<"/policies/[slug]">) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  return (
    <>
      <PageHeader eyebrow="Policy" title={policy.title} description={policy.summary} />
      <article className="container-rr max-w-3xl space-y-8 pb-20">
        {policy.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-2xl font-extrabold">{s.heading}</h2>
            <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
          </section>
        ))}
        <p className="text-xs text-muted">These pages describe how this website works. Have the shop review them before launch.</p>
      </article>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: policy.title, path: `/policies/${policy.slug}` },
        ])}
      />
    </>
  );
}
