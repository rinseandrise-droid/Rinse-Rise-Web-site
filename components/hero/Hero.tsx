import { ChevronDown } from "lucide-react";
import { firstOrderOffer, site } from "@/data/site";
import { BookPickupButton } from "@/components/ui/BookPickupButton";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-8 pt-5 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-14">
      <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-orange/15 blur-3xl sm:h-72 sm:w-72" />
      <div aria-hidden className="pointer-events-none absolute -right-16 top-32 hidden h-80 w-80 rounded-full bg-orange-soft/20 blur-3xl sm:block" />
      <div className="container-rr grid items-center gap-8 md:gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="min-w-0">
          <p className="eyebrow">Electronic City · Bangalore</p>
          <h1 className="mt-3 font-display text-[clamp(2.15rem,9vw,5.6rem)] font-extrabold leading-[0.94] tracking-[-0.04em] sm:mt-4">
            Fresh clothes.
            <br />
            Fresh start.
          </h1>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted sm:mt-6 sm:text-lg">
            Professional laundry care, washing, drying, steam ironing, folding and packing — handled with the same
            care we&apos;d want for our own wardrobe.
          </p>
          <div className="btn-row mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
            <BookPickupButton />
            <a href="#services" className="btn btn-secondary">
              View services
            </a>
          </div>
          <p className="mt-5 text-sm font-semibold text-orange-dark">
            {firstOrderOffer.percent}% off your first order · {site.promises[0]}
          </p>
        </div>
        <HeroVisual />
      </div>
      <a
        href="#journey"
        className="mx-auto mt-7 flex w-max max-w-[calc(100%-2rem)] flex-col items-center gap-2 px-2 text-center text-[0.65rem] font-extrabold tracking-[0.16em] text-orange-dark sm:mt-14 sm:text-[0.72rem] sm:tracking-[0.2em]"
      >
        <span className="sm:hidden">SCROLL THE JOURNEY ↓</span>
        <span className="hidden sm:inline">SCROLL TO EXPERIENCE THE JOURNEY</span>
        <ChevronDown className="animate-bob h-5 w-5" aria-hidden />
      </a>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto hidden aspect-square w-full max-w-[280px] min-[480px]:block sm:max-w-[360px] lg:max-w-[420px]">
      <div className="neo absolute inset-4 grid place-items-center overflow-hidden sm:inset-6">
        <svg viewBox="0 0 320 320" className="h-[86%] w-[86%] animate-float-soft" aria-hidden>
          <defs>
            <linearGradient id="hero-shirt" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#edf3fa" />
              <stop offset="1" stopColor="#cfdced" />
            </linearGradient>
          </defs>
          <ellipse cx="160" cy="278" rx="90" ry="12" fill="#b98f6c" opacity="0.18" />
          <path d="M160 42 c-12 0 -14 -16 -2 -18 c10 -2 14 8 8 16 L160 72" stroke="#c9bdb2" strokeWidth="5" fill="none" />
          <path d="M160 72 L70 118 Q58 124 70 130 H250 Q262 124 250 118 Z" fill="none" stroke="#d1a07a" strokeWidth="8" />
          <g style={{ transformOrigin: "160px 86px", animation: "sway 4.2s ease-in-out infinite" }}>
            <path d="M92 92 L132 78 Q160 98 188 78 L228 92 L224 268 Q160 284 96 268 Z" fill="url(#hero-shirt)" />
            <path d="M132 78 L148 108 L160 94 L172 108 L188 78 Q160 96 132 78 Z" fill="#f4f8fc" />
            <line x1="160" y1="96" x2="160" y2="268" stroke="#bccde1" strokeWidth="3" />
          </g>
        </svg>
      </div>
      <span className="badge absolute left-0 top-6 sm:top-8">Steam pressed</span>
      <span className="badge absolute bottom-8 right-0 sm:bottom-10">Pickup &amp; delivery</span>
    </div>
  );
}
