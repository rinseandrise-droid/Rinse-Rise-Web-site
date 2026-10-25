"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { n: "01", title: "Schedule pickup", body: "Choose items, address and a time window." },
  { n: "02", title: "We collect", body: "Our team picks up from your door." },
  { n: "03", title: "We clean & care", body: "Washed, dry cleaned or pressed as required." },
  { n: "04", title: "Quality check", body: "Inspected before anything is packed." },
  { n: "05", title: "Fold & pack", body: "Neatly finished and packed." },
  { n: "06", title: "Deliver back", body: "Returned to you, ready to wear." },
];

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-step]", {
        autoAlpha: 0.35,
        y: 24,
        stagger: 0.12,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={ref} className="section">
      <div className="container-rr">
        <p className="eyebrow">How it works</p>
        <h2 className="section-title mt-3">Six quiet steps. Clothes come back right.</h2>
        <ol className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-5">
          {STEPS.map((s) => (
            <li key={s.n} data-step className="neo-sm p-6">
              <span className="font-display text-3xl font-extrabold text-orange">{s.n}</span>
              <h3 className="mt-3 font-display text-xl font-extrabold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
