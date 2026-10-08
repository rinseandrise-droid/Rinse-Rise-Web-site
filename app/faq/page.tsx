import { FaqList } from "@/components/faq/FaqList";
import { PageHeader } from "@/components/ui/PageHeader";
import { faqs } from "@/data/faq";
import { faqJsonLd, JsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "FAQ",
  description: "Pickup, turnaround, dry cleaning, first-order discount and how pricing works at Rinse & Rise.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHeader eyebrow="FAQ" title="Questions we hear most." />
      <div className="container-rr max-w-3xl pb-20">
        <FaqList items={faqs} />
      </div>
      <JsonLd data={faqJsonLd(faqs)} />
    </>
  );
}
