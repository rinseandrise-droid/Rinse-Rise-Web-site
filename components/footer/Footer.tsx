import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { services } from "@/data/services";
import { fullAddress, site, whatsappLink } from "@/data/site";
import { policies } from "@/data/policies";
import { BookPickupButton } from "../ui/BookPickupButton";
import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="mt-auto">
      <section className="container-rr pb-16" aria-labelledby="footer-cta">
        <div className="relative overflow-hidden rounded-[32px] bg-ink px-6 py-12 text-white sm:px-12 sm:py-14">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange/30 blur-3xl"
          />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <h2 id="footer-cta" className="text-3xl font-extrabold sm:text-4xl">
                Don&apos;t let laundry take your time.
              </h2>
              <p className="mt-2 text-lg text-white/70">Let Rinse &amp; Rise take care of it.</p>
            </div>
            <BookPickupButton />
          </div>
        </div>
      </section>

      <div className="border-t border-line bg-cream">
        <div className="container-rr grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              Professional laundry care — steam ironing, dry cleaning, laundry by weight and shoe cleaning, with pickup
              and delivery.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange" aria-hidden />
                <span>{fullAddress()}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-4 w-4 shrink-0 text-orange" aria-hidden />
                <a href={`tel:+91${site.phone}`} className="hover:text-orange-dark">
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <MessageCircle className="h-4 w-4 shrink-0 text-orange" aria-hidden />
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-orange-dark">
                  WhatsApp
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="h-4 w-4 shrink-0 text-orange" aria-hidden />
                <span>Open {site.hours}</span>
              </li>
            </ul>
          </div>

          <FooterColumn
            title="Services"
            links={[
              ...services.map((s) => ({ href: `/services/${s.id}`, label: s.name })),
              { href: "/pricing", label: "Full price list" },
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              { href: "/about", label: "About" },
              { href: "/#how-it-works", label: "How it works" },
              { href: "/faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
              { href: site.googleReviewUrl, label: "Review us on Google", external: true },
            ]}
          />
          <FooterColumn
            title="Account & policies"
            links={[
              { href: "/account", label: "My account" },
              { href: "/account/orders", label: "Track an order" },
              ...policies.map((p) => ({ href: `/policies/${p.slug}`, label: p.title })),
            ]}
          />
        </div>
        <div className="border-t border-line">
          <div className="container-rr flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted sm:flex-row">
            <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
            <p>{site.tagline}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}) {
  return (
    <nav aria-label={title}>
      <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-ink">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm text-muted">
        {links.map((l) => (
          <li key={l.href}>
            {l.external ? (
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-orange-dark">
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="hover:text-orange-dark">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
