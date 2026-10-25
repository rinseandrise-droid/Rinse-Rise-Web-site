"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { onViewportChange } from "@/lib/observe-viewport";

gsap.registerPlugin(ScrollTrigger);

function shouldSmooth(): boolean {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.matchMedia("(pointer: fine)").matches;
}

function refreshTriggers() {
  ScrollTrigger.refresh();
}

/**
 * Lenis smooth scrolling for wheel/trackpad on desktop only, driven by GSAP's ticker
 * so ScrollTrigger stays perfectly in sync. Touch scrolling stays native, and it is
 * skipped entirely for reduced-motion users.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
    return () => {
      delete document.documentElement.dataset.hydrated;
    };
  }, []);

  useEffect(() => {
    if (navigator.webdriver || !shouldSmooth()) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      const stop = onViewportChange(refreshTriggers, 100);
      reduce.addEventListener("change", refreshTriggers);
      void document.fonts?.ready.then(refreshTriggers);
      return () => {
        reduce.removeEventListener("change", refreshTriggers);
        stop();
      };
    }

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: { offset: -112 }, autoResize: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const stopViewport = onViewportChange(refreshTriggers, 100);
    const onLock = (event: Event) => {
      const locked = Boolean((event as CustomEvent<boolean>).detail);
      if (locked) lenis.stop();
      else lenis.start();
    };
    const onScrollTo = (event: Event) => {
      event.preventDefault();
      lenis.scrollTo(Number((event as CustomEvent<number>).detail) || 0);
    };

    window.addEventListener("rr-scroll-lock", onLock);
    window.addEventListener("rr-scroll-to", onScrollTo);
    void document.fonts?.ready.then(refreshTriggers);

    return () => {
      stopViewport();
      window.removeEventListener("rr-scroll-lock", onLock);
      window.removeEventListener("rr-scroll-to", onScrollTo);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const id = window.setTimeout(refreshTriggers, 50);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
