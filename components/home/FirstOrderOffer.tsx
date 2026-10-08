import Link from "next/link";
import { firstOrderOffer } from "@/data/site";
import { BookPickupButton } from "@/components/ui/BookPickupButton";

export function FirstOrderOffer() {
  return (
    <section className="section">
      <div className="container-rr">
        <div className="neo relative overflow-hidden px-6 py-12 sm:px-12 sm:py-16">
          <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange/20 blur-3xl" />
          <p className="eyebrow">New here?</p>
          <p className="mt-4 font-display text-[clamp(3.4rem,10vw,7rem)] font-extrabold leading-none text-orange">
            {firstOrderOffer.percent}% OFF
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Your first order</h2>
          <p className="mt-4 max-w-lg text-muted">
            Create an account and the offer is attached to it. Applied once, automatically, at checkout — never guessed
            from the browser.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BookPickupButton>Start my first order</BookPickupButton>
            <Link href="/signup?offer=first-order" className="btn btn-secondary">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
