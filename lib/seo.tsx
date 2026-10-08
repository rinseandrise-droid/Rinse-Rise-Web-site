import type { Metadata } from "next";
import type { FaqItem } from "@/data/faq";
import type { Service } from "@/data/services";
import { site } from "@/data/site";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} · ${site.shortName}`, description, url: path },
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function localBusinessJsonLd() {
  const a = site.address;
  return {
    "@context": "https://schema.org",
    "@type": "DryCleaningOrLaundry",
    name: site.name,
    url: site.url,
    image: `${site.url}/images/logo.png`,
    telephone: `+91${site.phone}`,
    openingHours: site.hoursSchema,
    priceRange: "₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: a.line1,
      addressLocality: `${a.area}, ${a.city}`,
      addressRegion: a.state,
      postalCode: a.pincode,
      addressCountry: a.country,
    },
  };
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: { "@type": "DryCleaningOrLaundry", name: site.name, telephone: `+91${site.phone}` },
    areaServed: `${site.address.area}, ${site.address.city}`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: service.name,
      itemListElement: service.items.map((item) => ({
        "@type": "Offer",
        name: item.name,
        price: item.rate,
        priceCurrency: "INR",
      })),
    },
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${site.url}${c.path}`,
    })),
  };
}
