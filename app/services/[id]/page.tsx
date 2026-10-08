import { notFound } from "next/navigation";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { PageHeader } from "@/components/ui/PageHeader";
import { getService, services, startingRate, formatRate } from "@/data/services";
import { breadcrumbJsonLd, JsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/services/[id]">) {
  const { id } = await params;
  const service = getService(id);
  if (!service) return {};
  return pageMetadata({
    title: service.name,
    description: service.description,
    path: `/services/${service.id}`,
  });
}

export default async function ServiceDetailPage({ params }: PageProps<"/services/[id]">) {
  const { id } = await params;
  const service = getService(id);
  if (!service) notFound();
  const start = startingRate(service.items);

  return (
    <>
      <PageHeader
        eyebrow={service.name}
        title={service.tagline}
        description={service.description}
      />
      <div className="container-rr pb-20">
        <p className="mb-8 text-sm font-semibold text-muted">
          {service.items.length} items
          {start ? ` · from ${formatRate(start)}` : ""} · {service.careNote}
        </p>
        <CatalogBrowser initialServiceId={service.id} />
      </div>
      <JsonLd data={serviceJsonLd(service)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.id}` },
        ])}
      />
    </>
  );
}
