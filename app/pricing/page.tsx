import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pricing",
  description: "Every Rinse & Rise rate — steam iron, dry clean, laundry by kg and shoe cleaning — copied from the shop rate card.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="The full rate card, made easy to read."
        description="Search, filter by service or group, and add items to an order. Laundry is charged per kg; carpets are charged per sq as listed."
      />
      <div className="container-rr pb-20">
        <CatalogBrowser variant="pricing" />
      </div>
    </>
  );
}
