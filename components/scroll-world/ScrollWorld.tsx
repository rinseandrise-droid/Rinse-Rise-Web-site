"use client";

import { Check } from "lucide-react";
import { useEffect, useRef } from "react";
import { BookPickupButton } from "@/components/ui/BookPickupButton";
import { useMediaQuery } from "@/lib/use-media-query";
import { CAPTIONS, CHIPS, STEPS } from "./journey";
import { LaundryScene } from "./LaundryScene";
import { playScrollWorld } from "./use-scroll-world";

export function ScrollWorld() {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  if (reduce) return <ReducedMotionJourney />;
  return <ScrollWorldFilm />;
}

function ScrollWorldFilm() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const compact = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;
    return playScrollWorld(root, pin, { compact });
  }, [compact]);

  return (
    <section
      ref={rootRef}
      id="journey"
      className="relative bg-canvas"
      aria-label="A garment's journey from hanger to packed delivery"
      style={{ ["--sw-p" as string]: "0" }}
    >
      <div ref={pinRef} className="relative h-[100svh] overflow-hidden">
        <LaundryScene compact={compact} />
        <ProgressRail />
        <IntroCopy />
        <CaptionLayer />
        <ChipLayer />
        <FinaleCopy />
      </div>
    </section>
  );
}

function IntroCopy() {
  return (
    <div data-sw-intro className="pointer-events-none absolute inset-x-0 top-[12%] z-20 px-4 text-center sm:top-[14%] sm:px-8 xl:px-40">
      <p className="eyebrow mx-auto justify-center before:hidden">The garment&apos;s journey</p>
      <h2 className="mx-auto mt-2 max-w-3xl font-display text-[clamp(1.7rem,7vw,4.4rem)] font-extrabold leading-[0.98] tracking-[-0.03em] sm:mt-3">
        Your clothes deserve
        <br />
        more than a wash.
      </h2>
      <p className="mt-3 text-sm text-muted sm:mt-4 sm:text-lg">They deserve proper care.</p>
      <p className="animate-bob mt-5 text-[0.65rem] font-extrabold tracking-[0.18em] text-orange-dark sm:mt-8 sm:text-xs sm:tracking-[0.22em]">
        SCROLL TO BEGIN ↓
      </p>
    </div>
  );
}

function FinaleCopy() {
  return (
    <div data-sw-finale className="pointer-events-none absolute inset-0 z-30 grid place-items-center bg-canvas/80 px-4 text-center backdrop-blur-[2px] sm:px-6">
      <div className="pointer-events-auto w-full max-w-xl">
        <p className="eyebrow mx-auto justify-center">Ready for you</p>
        <h2 className="mt-3 font-display text-[clamp(1.9rem,7vw,4.2rem)] font-extrabold leading-none">Packed. Pressed. Yours.</h2>
        <p className="mt-3 text-sm text-muted sm:mt-4 sm:text-base">From hanger to doorstep — handled as one continuous craft.</p>
        <div className="btn-row mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8">
          <BookPickupButton />
          <a href="#services" className="btn btn-secondary">
            Explore services
          </a>
        </div>
      </div>
    </div>
  );
}

function CaptionLayer() {
  return (
    <div className="pointer-events-none absolute inset-x-4 bottom-24 z-20 sm:inset-x-8 sm:bottom-10 xl:left-28 xl:right-auto xl:w-[min(28rem,calc(100%-12rem))]">
      {CAPTIONS.map((c) => (
        <div
          key={c.id}
          data-caption
          data-in={c.in}
          data-out={c.out}
          className="absolute inset-x-0 bottom-0 rounded-2xl border border-line bg-canvas/92 px-4 py-3 shadow-[8px_12px_28px_rgba(150,110,80,0.12)] backdrop-blur-md sm:px-5 sm:py-4"
        >
          {c.eyebrow && <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-orange-dark">{c.eyebrow}</p>}
          <h3 className="mt-1 font-display text-xl font-extrabold sm:text-2xl lg:text-3xl">{c.title}</h3>
          {c.body && <p className="mt-1 text-sm leading-relaxed text-muted">{c.body}</p>}
          {c.note && <p className="mt-1 text-xs font-semibold text-orange-dark">{c.note}</p>}
        </div>
      ))}
    </div>
  );
}

function ChipLayer() {
  return (
    <ul className="pointer-events-none absolute right-3 top-[22%] z-20 hidden w-40 flex-col items-end gap-2 md:flex lg:right-8">
      {CHIPS.map((c) => (
        <li
          key={c.id}
          data-chip
          data-in={c.in}
          data-out={c.out}
          className="inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-white/92 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-ink shadow-[6px_6px_16px_rgba(150,110,80,0.12)] backdrop-blur-md"
        >
          {c.check && <Check className="h-3.5 w-3.5 shrink-0 text-orange" aria-hidden />}
          {c.label}
        </li>
      ))}
    </ul>
  );
}

function ProgressRail() {
  return (
    <>
      <ol
        className="pointer-events-none absolute left-3 top-1/2 z-20 hidden w-11 -translate-y-1/2 flex-col items-center gap-3 xl:flex"
        aria-hidden
      >
        <span className="absolute left-1/2 top-3 z-0 w-0.5 -translate-x-1/2 rounded-full bg-orange-tint" style={{ height: "calc(100% - 1.5rem)" }} />
        <span
          className="absolute left-1/2 top-3 z-0 w-0.5 origin-top -translate-x-1/2 rounded-full bg-orange"
          style={{ height: "calc(var(--sw-p) * (100% - 1.5rem))" }}
        />
        {STEPS.map((step, i) => (
          <li key={step.id} className="relative z-10" title={step.label}>
            <span className="grid h-8 w-8 place-items-center rounded-full border border-line bg-white text-[0.65rem] font-extrabold text-ink shadow-sm">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="sr-only">{step.label}</span>
          </li>
        ))}
      </ol>
      <div className="absolute inset-x-4 top-3 z-20 h-1 overflow-hidden rounded-full bg-white/80 sm:inset-x-8 sm:top-4 xl:hidden" aria-hidden>
        <span className="block h-full origin-left bg-orange" style={{ transform: "scaleX(var(--sw-p))" }} />
      </div>
    </>
  );
}

function ReducedMotionJourney() {
  return (
    <section id="journey" className="section bg-cream" aria-label="How we care for a garment">
      <div className="container-rr">
        <p className="eyebrow">The garment&apos;s journey</p>
        <h2 className="section-title mt-3 max-w-2xl">From hanger to packed and ready.</h2>
        <ol className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.id} className="neo-sm p-4 sm:p-5">
              <span className="text-xs font-extrabold tracking-[0.18em] text-orange">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-xl font-extrabold">{step.label}</h3>
              <p className="mt-1 text-sm text-muted">
                {
                  {
                    intro: "Collected and inspected.",
                    wash: "Cleaned with the right process.",
                    rinse: "Rinsed and extracted.",
                    dry: "Dried according to the fabric.",
                    press: "Steam finished.",
                    fold: "Folded neatly.",
                    pack: "Packed for delivery.",
                  }[step.id]
                }
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
