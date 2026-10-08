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
    <div data-sw-intro className="pointer-events-none absolute inset-x-0 top-[18%] z-10 px-6 text-center sm:top-[16%]">
      <p className="eyebrow mx-auto justify-center before:hidden">The garment&apos;s journey</p>
      <h2 className="mx-auto mt-3 max-w-3xl font-display text-[clamp(2rem,6vw,4.4rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
        Your clothes deserve
        <br />
        more than a wash.
      </h2>
      <p className="mt-4 text-lg text-muted">They deserve proper care.</p>
      <p className="animate-bob mt-8 text-xs font-extrabold tracking-[0.22em] text-orange-dark">SCROLL TO BEGIN ↓</p>
    </div>
  );
}

function FinaleCopy() {
  return (
    <div data-sw-finale className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-canvas/55 px-6 text-center backdrop-blur-[2px]">
      <div className="pointer-events-auto max-w-xl">
        <p className="eyebrow mx-auto justify-center">Ready for you</p>
        <h2 className="mt-3 font-display text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold leading-none">Packed. Pressed. Yours.</h2>
        <p className="mt-4 text-muted">From hanger to doorstep — handled as one continuous craft.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
    <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 px-5 sm:bottom-14 sm:left-12 sm:right-auto sm:max-w-md">
      {CAPTIONS.map((c) => (
        <div
          key={c.id}
          data-caption
          data-in={c.in}
          data-out={c.out}
          className="absolute inset-x-5 bottom-0 sm:inset-x-0"
        >
          {c.eyebrow && <p className="eyebrow">{c.eyebrow}</p>}
          <h3 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{c.title}</h3>
          {c.body && <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{c.body}</p>}
          {c.note && <p className="mt-2 text-xs font-semibold text-orange-dark">{c.note}</p>}
        </div>
      ))}
    </div>
  );
}

function ChipLayer() {
  const groups = {
    wash: "right-6 top-[28%] sm:right-14",
    dry: "right-6 top-[30%] sm:right-14",
    qc: "left-6 top-[32%] sm:left-14",
  } as const;
  return (
    <>
      {(["wash", "dry", "qc"] as const).map((group) => (
        <ul key={group} className={`pointer-events-none absolute z-10 flex flex-col gap-2 ${groups[group]}`}>
          {CHIPS.filter((c) => c.group === group).map((c) => (
            <li
              key={c.id}
              data-chip
              data-in={c.in}
              data-out={c.out}
              className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-white/90 px-3 py-1.5 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-ink shadow-[6px_6px_16px_rgba(150,110,80,0.12)] backdrop-blur-md"
            >
              {c.check && <Check className="h-3.5 w-3.5 text-orange" aria-hidden />}
              {c.label}
            </li>
          ))}
        </ul>
      ))}
    </>
  );
}

function ProgressRail() {
  return (
    <>
      <ol
        className="pointer-events-none absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
        aria-hidden
      >
        {STEPS.map((step, i) => (
          <li key={step.id} className="flex items-center gap-3 text-[0.68rem] font-extrabold tracking-[0.16em] uppercase text-muted">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-line bg-white text-[0.65rem] text-ink">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{step.label}</span>
          </li>
        ))}
        <span
          className="absolute left-[13px] top-3 w-0.5 origin-top bg-orange"
          style={{ height: "calc(var(--sw-p) * 92%)" }}
        />
      </ol>
      <div className="absolute inset-x-8 top-4 z-10 h-1 overflow-hidden rounded-full bg-white/70 lg:hidden" aria-hidden>
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
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.id} className="neo-sm p-5">
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
