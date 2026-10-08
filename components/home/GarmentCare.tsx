import {
  Droplets,
  Feather,
  Flame,
  Palette,
  Snowflake,
  Sparkles,
  Sun,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { careTopics } from "@/data/care";

const ICONS: Record<(typeof careTopics)[number]["icon"], LucideIcon> = {
  droplets: Droplets,
  wind: Wind,
  flame: Flame,
  feather: Feather,
  snowflake: Snowflake,
  sun: Sun,
  palette: Palette,
  sparkles: Sparkles,
};

export function GarmentCare() {
  return (
    <section className="section bg-cream">
      <div className="container-rr">
        <p className="eyebrow">Garment care</p>
        <h2 className="section-title mt-3 max-w-2xl">A little knowledge keeps clothes looking newer, longer.</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {careTopics.map((t) => {
            const Icon = ICONS[t.icon];
            return (
              <article key={t.id} className="neo-sm p-5">
                <Icon className="h-5 w-5 text-orange" aria-hidden />
                <h3 className="mt-3 font-display text-lg font-extrabold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.tip}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
