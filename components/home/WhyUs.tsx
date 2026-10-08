import { FoldHorizontal, MapPinned, Shirt, Sparkles, Truck, Wallet } from "lucide-react";

const FEATURES = [
  { icon: Shirt, title: "Fabric-focused care", body: "Different garments need different processes — we match the method to the fabric." },
  { icon: Sparkles, title: "Professional cleaning", body: "Steam ironing, dry cleaning, laundry by weight and shoe cleaning, under one roof." },
  { icon: FoldHorizontal, title: "Steam finish", body: "Pressed with steam for a crisp, clean look — not a hurried once-over." },
  { icon: Shirt, title: "Careful folding", body: "Neatly folded and packed so clothes arrive ready to wear or put away." },
  { icon: Truck, title: "Convenient pickup & delivery", body: "Book from your account. We collect and bring it back — no store visit required." },
  { icon: Wallet, title: "Transparent pricing", body: "Every item and rate is published. What you see on the rate card is what you pay." },
];

export function WhyUs() {
  return (
    <section className="section bg-cream">
      <div className="container-rr">
        <p className="eyebrow">Why Rinse &amp; Rise</p>
        <h2 className="section-title mt-3 max-w-2xl">These people take care of my clothes professionally.</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} className="neo-sm p-6">
              <f.icon className="h-6 w-6 text-orange" aria-hidden />
              <h3 className="mt-4 font-display text-xl font-extrabold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 flex items-center gap-2 text-sm text-muted">
          <MapPinned className="h-4 w-4 text-orange" aria-hidden />
          Based in Ananth Nagar Phase 1, Electronic City, Bangalore 560100.
        </p>
      </div>
    </section>
  );
}
