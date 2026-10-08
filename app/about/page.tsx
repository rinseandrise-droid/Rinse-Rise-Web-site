import { PageHeader } from "@/components/ui/PageHeader";
import { WhyUs } from "@/components/home/WhyUs";
import { fullAddress, site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description: `Rinse & Rise Laundryrite in Electronic City, Bangalore — steam ironing, dry cleaning, laundry and shoe care.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A laundry studio that treats garments as craft."
        description={`${site.name} is a laundry and garment-care studio in Electronic City, Bangalore. We steam iron, dry clean, wash by weight and clean shoes — then fold, pack and bring them back.`}
      />
      <div className="container-rr grid gap-6 pb-10 sm:grid-cols-3">
        <Fact label="Studio" value={fullAddress()} />
        <Fact label="Hours" value={site.hours} />
        <Fact label="Phone" value={site.phoneDisplay} />
      </div>
      <WhyUs />
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="neo-sm p-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}
