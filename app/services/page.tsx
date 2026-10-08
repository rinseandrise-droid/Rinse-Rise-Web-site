import { PageHeader } from "@/components/ui/PageHeader";
import { ServiceShowcase } from "@/components/services/ServiceShowcase";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description: "Steam ironing, dry cleaning, laundry by weight and shoe cleaning — priced from the Rinse & Rise rate card.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Four ways we care for your clothes."
        description="Every category and item comes from the shop rate card. Open a service to see every garment and rate."
      />
      <div className="pb-20">
        <ServiceShowcase />
      </div>
    </>
  );
}
