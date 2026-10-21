import { firstOrderOffer } from "@/data/site";
import { BookPickupButton } from "@/components/ui/BookPickupButton";

export function FinalCta() {
  return (
    <section className="section pt-0">
      <div className="container-rr">
        <div className="relative overflow-hidden rounded-[24px] bg-ink px-5 py-12 text-center text-white sm:rounded-[32px] sm:px-12 sm:py-20">
          <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-soft via-orange to-orange-dark" />
          <p className="eyebrow mx-auto justify-center text-orange-soft before:bg-orange-soft">Your laundry. Our care.</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,8vw,4.6rem)] font-extrabold leading-[0.95]">
            Ready when you are.
          </h2>
          <div className="mt-8 flex justify-center">
            <BookPickupButton className="w-full sm:w-auto" />
          </div>
          <p className="mt-5 text-sm font-semibold text-white/60">{firstOrderOffer.percent}% off your first order</p>
        </div>
      </div>
    </section>
  );
}
