import Link from "next/link";
import { ArrowRight, Shirt, Sparkles, Waves, Footprints } from "lucide-react";
import { formatRate, services, startingRate, type Service } from "@/data/services";

const ICONS = {
  "steam-iron": Shirt,
  "dry-clean": Sparkles,
  laundry: Waves,
  "shoe-cleaning": Footprints,
} as const;

export function ServiceShowcase() {
  return (
    <section id="services" className="section">
      <div className="container-rr">
        <p className="eyebrow">Services</p>
        <h2 className="section-title mt-3 max-w-3xl">Now choose how we can care for your clothes.</h2>
        <p className="mt-4 max-w-2xl text-muted">
          Four services from the shop rate card — names, units and prices exactly as listed.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  const Icon = ICONS[service.id as keyof typeof ICONS] ?? Shirt;
  const start = startingRate(service.items);
  return (
    <article className="neo card-hover flex flex-col p-7">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-tint text-orange">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="mt-5 font-display text-2xl font-extrabold">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{service.description}</p>
      <p className="mt-5 text-sm font-bold">
        {service.items.length} items
        {start && (
          <span className="ml-2 font-semibold text-orange-dark">from {formatRate(start)}</span>
        )}
      </p>
      <Link href={`/services/${service.id}`} className="btn btn-secondary mt-6 self-start">
        Explore service
        <ArrowRight className="btn-arrow h-4 w-4" aria-hidden />
      </Link>
    </article>
  );
}
