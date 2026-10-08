import { FaqList } from "@/components/faq/FaqList";
import { FirstOrderOffer } from "@/components/home/FirstOrderOffer";
import { FinalCta } from "@/components/home/FinalCta";
import { GarmentCare } from "@/components/home/GarmentCare";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ServiceArea } from "@/components/home/ServiceArea";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyUs } from "@/components/home/WhyUs";
import { Hero } from "@/components/hero/Hero";
import { PricingPreview } from "@/components/pricing/PricingPreview";
import { ScrollWorld } from "@/components/scroll-world/ScrollWorld";
import { ServiceShowcase } from "@/components/services/ServiceShowcase";
import { faqs } from "@/data/faq";
import { faqJsonLd, JsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollWorld />
      <ServiceShowcase />
      <WhyUs />
      <HowItWorks />
      <PricingPreview />
      <FirstOrderOffer />
      <GarmentCare />
      <ServiceArea />
      <Testimonials />
      <section id="faq" className="section bg-cream">
        <div className="container-rr grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="section-title mt-3">Straight answers.</h2>
          </div>
          <FaqList items={faqs.slice(0, 8)} />
        </div>
      </section>
      <FinalCta />
      <JsonLd data={faqJsonLd(faqs.slice(0, 8))} />
    </>
  );
}
