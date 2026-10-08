import { MapPin } from "lucide-react";
import { fullAddress, serviceAreas, site } from "@/data/site";

export function ServiceArea() {
  return (
    <section className="section pt-0">
      <div className="container-rr neo p-8 sm:p-10">
        <p className="eyebrow">Service area</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold">We pick up. We clean. We deliver.</h2>
        <p className="mt-3 max-w-xl text-muted">{fullAddress()}</p>
        <ul className="mt-6 flex flex-wrap gap-3">
          {serviceAreas.map((area) => (
            <li key={area.name} className="neo-sm flex items-center gap-2 px-4 py-3 text-sm font-bold">
              <MapPin className="h-4 w-4 text-orange" aria-hidden />
              {area.name}, {area.city}
              <span className="font-semibold text-muted">({area.pincodes.join(", ")})</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">
          Open {site.hours}. Just outside these PIN codes? Call {site.phoneDisplay}.
        </p>
      </div>
    </section>
  );
}
