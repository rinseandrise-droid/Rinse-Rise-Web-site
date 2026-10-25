"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { activeStepIndex, headerStackPx, pinEndDistance } from "@/lib/journey-progress";
import { onViewportChange } from "@/lib/observe-viewport";
import { STEPS } from "./journey";
import { WORLD } from "./scene-utils";

gsap.registerPlugin(ScrollTrigger);

const BEATS = 100;
const CX = 800; // centre of the 1600-wide viewBox
const panTo = (x: number) => -(x - CX);

function pick(root: Element, name: string): Element | null {
  return root.querySelector(`[data-sw="${name}"]`);
}

function pickPart(root: Element, shirt: string, part: string): Element | null {
  return root.querySelector(`[data-sw="${shirt}"] [data-part="${part}"]`);
}

/**
 * One master timeline, scrubbed by ScrollTrigger. Positions are in SVG units;
 * easing is linear so reverse-scroll is an exact rewind of the story.
 */
export function playScrollWorld(
  root: HTMLElement,
  pin: HTMLElement,
  options: { compact: boolean }
): () => void {
  const q = (name: string) => pick(root, name);
  const shirtStart = { x: WORLD.hanger.x, y: WORLD.hanger.y + 35 };
  const stepNodes = root.querySelectorAll<HTMLElement>("[data-step]");
  const live = root.querySelector<HTMLElement>("[data-sw-live]");
  let lastStep = -2;

  const syncStage = (progress: number) => {
    root.style.setProperty("--sw-p", progress.toFixed(4));
    const index = activeStepIndex(progress, STEPS);
    if (index === lastStep) return;
    lastStep = index;
    stepNodes.forEach((el, i) => {
      el.dataset.active = i === index ? "true" : "false";
    });
    if (live) live.textContent = index < 0 ? "" : `Stage ${String(index + 1).padStart(2, "0")}: ${STEPS[index].label}`;
  };

  const ctx = gsap.context(() => {
    gsap.set(q("cam-pan"), { x: 0, y: 0 });
    gsap.set(q("cam-zoom"), { scale: 1, transformOrigin: "800px 450px" });
    gsap.set(q("shirt-move"), { x: shirtStart.x, y: shirtStart.y, rotation: 0, scale: 1, transformOrigin: "0px 40px" });
    gsap.set(q("hanger"), { rotation: 0, transformOrigin: "0px -50px" });
    gsap.set(q("washer-door"), { rotation: 0, transformOrigin: "-160px 0px" });
    gsap.set(q("dryer-door"), { rotation: 0, transformOrigin: "-160px 0px" });
    gsap.set(q("washer-rotor"), { rotation: 0, transformOrigin: "0px 0px" });
    gsap.set(q("dryer-rotor"), { rotation: 0, transformOrigin: "0px 0px" });
    gsap.set(q("washer-shirt"), { autoAlpha: 0 });
    gsap.set(q("dryer-shirt"), { autoAlpha: 0 });
    gsap.set(q("washer-water"), { y: 150 });
    gsap.set(q("washer-water-clean"), { autoAlpha: 0 });
    gsap.set([q("washer-foam"), q("washer-bubbles"), q("washer-speed"), q("dryer-heat"), q("dryer-air"), q("steam")], {
      autoAlpha: 0,
    });
    gsap.set(q("iron"), { x: WORLD.board.x + 280, y: WORLD.board.y - 90, rotation: -8 });
    gsap.set(q("qc-sweep"), { x: WORLD.table.x - 420, autoAlpha: 0 });
    gsap.set(q("folded-move"), { x: WORLD.table.x, y: WORLD.table.y - 20, autoAlpha: 0, scale: 1 });
    gsap.set(q("pack"), { autoAlpha: 0, scale: 0.6, transformOrigin: "0px 0px" });
    gsap.set(q("bag-move"), { x: WORLD.pack.x + 520, y: WORLD.pack.y - 40, autoAlpha: 0 });
    gsap.set(pickPart(root, "shirt", "stains"), { autoAlpha: 1 });
    gsap.set(pickPart(root, "shirt", "wrinkles"), { autoAlpha: 1 });
    gsap.set(root.querySelectorAll("[data-caption]"), { autoAlpha: 0, y: 12 });
    gsap.set(root.querySelectorAll("[data-chip]"), { autoAlpha: 0, y: 8 });
    gsap.set(root.querySelector("[data-sw-intro]"), { autoAlpha: 1 });
    gsap.set(root.querySelector("[data-sw-finale]"), { autoAlpha: 0, y: 16 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        start: () => `top ${headerStackPx(document.querySelector("header"))}px`,
        end: pinEndDistance(options.compact),
        pin,
        scrub: 0.4,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        onToggle: (self) => {
          root.classList.toggle("is-active", self.isActive);
        },
        onUpdate: (self) => {
          syncStage(self.progress);
        },
      },
    });

    // 0–8  hanger sway, intro copy
    tl.to(q("hanger"), { rotation: 6, duration: 4 }, 0);
    tl.to(q("hanger"), { rotation: -4, duration: 4 }, 4);
    tl.to(q("shirt-wobble"), { rotation: 3, duration: 4 }, 0);
    tl.to(q("shirt-wobble"), { rotation: -2, duration: 4 }, 4);
    tl.to(root.querySelector("[data-sw-intro]"), { autoAlpha: 0, y: -10, duration: 2 }, 6);

    // 8–16  shirt leaves hanger, travels to washer
    tl.to(q("hanger"), { rotation: 18, duration: 2 }, 8);
    tl.to(q("shirt-move"), { x: WORLD.washer.x - 40, y: WORLD.washer.y - 220, rotation: 18, scale: 0.85, duration: 8 }, 8);
    tl.to(q("cam-pan"), { x: panTo(WORLD.washer.x), duration: 8 }, 8);
    tl.to(q("cam-zoom"), { scale: 1.18, duration: 8 }, 8);

    // 16–22  door opens, shirt enters
    tl.to(q("washer-door"), { rotation: -118, duration: 4 }, 16);
    tl.to(q("shirt-move"), { x: WORLD.washer.x, y: WORLD.washer.y - 20, rotation: 40, scale: 0.32, autoAlpha: 0, duration: 5 }, 17);
    tl.to(q("washer-shirt"), { autoAlpha: 1, duration: 2 }, 20);
    tl.to(q("washer-door"), { rotation: 0, duration: 3 }, 21);

    // 24–32  wash cycle
    tl.to(q("washer-water"), { y: -20, duration: 6 }, 24);
    tl.to(q("washer-rotor"), { rotation: 360, duration: 8 }, 24);
    tl.to(q("washer-bubbles"), { autoAlpha: 1, duration: 3 }, 25);
    tl.to(q("cam-zoom"), { scale: 1.32, duration: 8 }, 24);

    // 32–42  foam / deep clean
    tl.to(q("washer-foam"), { autoAlpha: 1, duration: 3 }, 32);
    tl.to(q("washer-rotor"), { rotation: 720, duration: 10 }, 32);

    // 42–50  rinse
    tl.to(q("washer-foam"), { autoAlpha: 0, duration: 4 }, 42);
    tl.to(q("washer-water-clean"), { autoAlpha: 1, duration: 5 }, 42);
    tl.to(pickPart(root, "washer-shirt", "stains"), { autoAlpha: 0, duration: 6 }, 42);
    tl.to(pickPart(root, "shirt", "stains"), { autoAlpha: 0, duration: 6 }, 42);

    // 50–58  spin
    tl.to(q("washer-bubbles"), { autoAlpha: 0, duration: 2 }, 50);
    tl.to(q("washer-water"), { y: 160, duration: 4 }, 50);
    tl.to(q("washer-speed"), { autoAlpha: 0.9, duration: 1.5 }, 51);
    tl.to(q("washer-rotor"), { rotation: 1440, duration: 7 }, 50);
    tl.to(q("washer-speed"), { autoAlpha: 0, duration: 1.5 }, 56.5);
    tl.to(q("cam-zoom"), { scale: 1.12, duration: 6 }, 52);

    // 58–66  transfer to dryer
    tl.to(q("washer-door"), { rotation: -118, duration: 3 }, 58);
    tl.to(q("shirt-move"), { x: WORLD.washer.x, y: WORLD.washer.y - 10, rotation: -20, scale: 0.34, autoAlpha: 1, duration: 0.4 }, 60);
    tl.to(q("washer-shirt"), { autoAlpha: 0, duration: 1 }, 60);
    tl.to(q("shirt-move"), { x: WORLD.dryer.x, y: WORLD.dryer.y - 210, rotation: -12, scale: 0.8, duration: 6 }, 60.5);
    tl.to(q("cam-pan"), { x: panTo(WORLD.dryer.x), duration: 6 }, 60.5);
    tl.to(q("dryer-door"), { rotation: -118, duration: 3 }, 62);

    // 66–75  dry
    tl.to(q("shirt-move"), { x: WORLD.dryer.x, y: WORLD.dryer.y, scale: 0.32, autoAlpha: 0, duration: 3 }, 65);
    tl.to(q("dryer-shirt"), { autoAlpha: 1, duration: 1.5 }, 66.5);
    tl.to(q("dryer-door"), { rotation: 0, duration: 2.5 }, 67);
    tl.to(q("dryer-rotor"), { rotation: 1080, duration: 8 }, 67);
    tl.to(q("dryer-heat"), { autoAlpha: 1, duration: 2 }, 67);
    tl.to(q("dryer-air"), { autoAlpha: 1, duration: 2 }, 67);
    tl.to(pickPart(root, "dryer-shirt", "wrinkles"), { autoAlpha: 0.35, duration: 6 }, 68);
    tl.to(q("cam-zoom"), { scale: 1.22, duration: 6 }, 67);

    // 75–78  to ironing board
    tl.to(q("dryer-door"), { rotation: -118, duration: 2.5 }, 74.5);
    tl.to(q("dryer-heat"), { autoAlpha: 0, duration: 1.5 }, 75);
    tl.to(q("dryer-air"), { autoAlpha: 0, duration: 1.5 }, 75);
    tl.to(q("shirt-move"), { x: WORLD.dryer.x, y: WORLD.dryer.y - 8, rotation: 8, scale: 0.34, autoAlpha: 1, duration: 0.4 }, 76.2);
    tl.to(q("dryer-shirt"), { autoAlpha: 0, duration: 1 }, 76.2);
    tl.to(q("shirt-move"), { x: WORLD.board.x + 120, y: WORLD.board.y - 130, rotation: 90, scale: 0.72, duration: 5 }, 76.5);
    tl.to(q("cam-pan"), { x: panTo(WORLD.board.x), duration: 5 }, 76.5);
    tl.to(q("cam-zoom"), { scale: 1.08, duration: 5 }, 76.5);
    tl.to(q("dryer-door"), { rotation: 0, duration: 2 }, 77);

    // 78–84  steam press
    tl.to(q("shirt-move"), { x: WORLD.board.x + 120, y: WORLD.board.y - 118, rotation: 90, duration: 1.2 }, 78);
    tl.to(q("steam"), { autoAlpha: 1, duration: 1 }, 78.4);
    tl.to(q("iron"), { x: WORLD.board.x - 80, y: WORLD.board.y - 90, duration: 3 }, 78.6);
    tl.to(q("iron"), { x: WORLD.board.x + 80, y: WORLD.board.y - 90, duration: 2.4 }, 81.6);
    tl.to(pickPart(root, "shirt", "wrinkles"), { autoAlpha: 0, duration: 4 }, 79);
    tl.to(q("steam"), { autoAlpha: 0, duration: 1.2 }, 83.4);

    // 84–88  quality check
    tl.to(q("shirt-move"), { x: WORLD.table.x, y: WORLD.table.y - 170, rotation: 0, scale: 0.78, duration: 4 }, 84);
    tl.to(q("cam-pan"), { x: panTo(WORLD.table.x), duration: 4 }, 84);
    tl.to(q("qc-sweep"), { autoAlpha: 0.9, duration: 0.6 }, 85.4);
    tl.to(q("qc-sweep"), { x: WORLD.table.x + 360, duration: 3 }, 85.6);
    tl.to(q("qc-sweep"), { autoAlpha: 0, duration: 0.6 }, 88.4);

    // 88–93  folding
    tl.to(pickPart(root, "shirt", "sleeve-l"), { x: 70, rotation: 12, transformOrigin: "0px 40px", duration: 1.6 }, 88.8);
    tl.to(pickPart(root, "shirt", "sleeve-r"), { x: -70, rotation: -12, transformOrigin: "0px 40px", duration: 1.6 }, 88.8);
    tl.to(pickPart(root, "shirt", "fold-y"), { scaleY: 0.55, transformOrigin: "0px 0px", duration: 1.8 }, 90.4);
    tl.to(pickPart(root, "shirt", "fold-x"), { scaleX: 0.72, transformOrigin: "0px 0px", duration: 1.4 }, 92);
    tl.to(q("shirt-move"), { autoAlpha: 0, scale: 0.55, duration: 1.2 }, 93);
    tl.to(q("folded-move"), { autoAlpha: 1, duration: 1.2 }, 93);

    // 93–97  packing
    tl.to(q("pack"), { autoAlpha: 1, scale: 1, duration: 2 }, 93.6);
    tl.to(q("folded-move"), { x: WORLD.pack.x, y: WORLD.pack.y - 10, duration: 3.2 }, 94.2);
    tl.to(q("cam-pan"), { x: panTo(WORLD.pack.x), duration: 3.2 }, 94.2);
    tl.to(q("cam-zoom"), { scale: 1, duration: 3.2 }, 94.2);

    // 97–100  delivery
    tl.to(q("bag-move"), { autoAlpha: 1, duration: 1.2 }, 97);
    tl.to(q("folded-move"), { x: WORLD.pack.x + 520, y: WORLD.pack.y + 80, scale: 0.55, duration: 2.2 }, 97.4);
    tl.to(root.querySelector("[data-sw-finale]"), { autoAlpha: 1, y: 0, duration: 2 }, 97.8);

    // Captions + chips (same timeline so reverse-scroll rewinds copy too)
    root.querySelectorAll<HTMLElement>("[data-caption]").forEach((el) => {
      const inn = Number(el.dataset.in);
      const out = Number(el.dataset.out);
      tl.to(el, { autoAlpha: 1, y: 0, duration: 1.1 }, inn);
      tl.to(el, { autoAlpha: 0, y: -10, duration: 0.9 }, out);
    });
    root.querySelectorAll<HTMLElement>("[data-chip]").forEach((el) => {
      const inn = Number(el.dataset.in);
      const out = Number(el.dataset.out);
      tl.to(el, { autoAlpha: 1, y: 0, duration: 0.7 }, inn);
      tl.to(el, { autoAlpha: 0, duration: 0.5 }, out);
    });

    tl.to({}, { duration: 0.01 }, BEATS);
  }, root);

  const stopViewport = onViewportChange(() => {
    ScrollTrigger.refresh();
  }, 100);
  const pinObserver = new ResizeObserver(() => ScrollTrigger.refresh());
  pinObserver.observe(pin);
  void document.fonts?.ready.then(() => ScrollTrigger.refresh());
  requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => {
    stopViewport();
    pinObserver.disconnect();
    root.classList.remove("is-active");
    ctx.revert();
  };
}
