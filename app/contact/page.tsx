import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { fullAddress, site, whatsappLink } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Call, WhatsApp or visit Rinse & Rise Laundryrite in Electronic City, Bangalore. Open ${site.hours}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the studio."
        description="Questions about a garment, a booking or a pickup window — we answer on phone and WhatsApp."
      />
      <div className="container-rr grid gap-8 pb-20 lg:grid-cols-[0.9fr_1.1fr]">
        <ul className="space-y-4">
          <Info icon={Phone} label="Phone" href={`tel:+91${site.phone}`} value={site.phoneDisplay} />
          <Info icon={MessageCircle} label="WhatsApp" href={whatsappLink()} value="Chat with us" external />
          {site.email ? <Info icon={Mail} label="Email" href={`mailto:${site.email}`} value={site.email} /> : null}
          <Info icon={MapPin} label="Studio" value={fullAddress()} />
          <Info icon={Clock} label="Hours" value={site.hours} />
        </ul>
        <ContactForm />
      </div>
    </>
  );
}

function Info({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <span className="neo-sm flex gap-4 p-5">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-orange" aria-hidden />
      <span>
        <span className="block text-xs font-extrabold uppercase tracking-[0.16em] text-muted">{label}</span>
        <span className="mt-1 block font-semibold">{value}</span>
      </span>
    </span>
  );
  if (!href) return <li>{inner}</li>;
  return (
    <li>
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="block">
        {inner}
      </a>
    </li>
  );
}
