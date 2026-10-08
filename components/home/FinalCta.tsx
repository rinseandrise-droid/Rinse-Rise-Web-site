import { firstOrderOffer } from "@/data/site";
import { BookPickupButton } from "@/components/ui/BookPickupButton";

export function FinalCta() {
  return (
    <section className="section pt-0">
      <div className="container-rr">
        <div className="relative overflow-hidden rounded-[32px] bg-ink px-6 py-16 text-center text-white sm:px-12 sm:py-20">
          <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-soft via-orange to-orange-dark" />
          <p className="eyebrow mx-auto justify-center text-orange-soft before:bg-orange-soft">Your laundry. Our care.</p>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,7vw,4.6rem)] font-extrabold leading-[0.95]">
            Ready when you are.
          </h2>
          <div className="mt-8 flex justify-center">
            <BookPickupButton />
          </div>
          <p className="mt-5 text-sm font-semibold text-white/60">{firstOrderOffer.percent}% off your first order</p>
        </div>
      </div>
    </section>
  );
}
