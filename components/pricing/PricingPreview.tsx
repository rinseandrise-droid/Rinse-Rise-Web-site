import Link from "next/link";
import { formatRate, services, startingRate } from "@/data/services";

export function PricingPreview() {
  return (
    <section id="pricing" className="section bg-cream">
      <div className="container-rr">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Pricing</p>
            <h2 className="section-title mt-3">Clear rates. No guessing.</h2>
          </div>
          <Link href="/pricing" className="btn btn-secondary w-full sm:w-auto">
            Full price list
          </Link>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {services.map((service) => {
            const sample = service.groups[0]?.items.slice(0, 5) ?? [];
            const start = startingRate(service.items);
            return (
              <article key={service.id} className="neo overflow-hidden">
                <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-4 sm:px-6">
                  <h3 className="min-w-0 font-display text-lg font-extrabold sm:text-xl">{service.name}</h3>
                  {start && <span className="shrink-0 text-sm font-bold text-orange-dark">from {formatRate(start)}</span>}
                </header>
                <ul>
                  {sample.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-baseline justify-between gap-3 border-b border-line/70 px-4 py-3 last:border-0 sm:gap-4 sm:px-6"
                    >
                      <span className="min-w-0 break-words text-sm">{item.name}</span>
                      <span className="shrink-0 font-bold tabular-nums">{formatRate(item)}</span>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-4 sm:px-6">
                  <Link href={`/services/${service.id}`} className="text-sm font-extrabold text-orange-dark hover:underline">
                    View all {service.items.length} items →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
