/**
 * Pure progress helpers for the laundry journey. Kept free of GSAP/DOM so
 * stage numbering and reverse-scroll state can be unit-tested.
 */

export const JOURNEY_BEATS = 100;

export interface TimedStep {
  id: string;
  at: number;
}

export interface TimedCaption {
  id: string;
  in: number;
  out: number;
}

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function progressToBeat(progress: number, beats = JOURNEY_BEATS): number {
  return clamp01(progress) * beats;
}

/**
 * Active process step for a 0–1 scroll progress. Returns -1 during the
 * unnumbered intro (before the first step's `at` beat).
 */
export function activeStepIndex(progress: number, steps: readonly TimedStep[]): number {
  if (!steps.length) return -1;
  const beat = progressToBeat(progress);
  if (beat < steps[0].at) return -1;
  let index = 0;
  for (let i = 1; i < steps.length; i++) {
    if (steps[i].at <= beat) index = i;
    else break;
  }
  return index;
}

export function captionIndexAtBeat(beat: number, captions: readonly TimedCaption[]): number {
  if (!Number.isFinite(beat)) return -1;
  return captions.findIndex((c) => beat >= c.in && beat < c.out);
}

export function stageNumbers(count: number): string[] {
  return Array.from({ length: count }, (_, i) => String(i + 1).padStart(2, "0"));
}

export function hasUniqueIds(items: readonly { id: string }[]): boolean {
  const ids = items.map((item) => item.id);
  return new Set(ids).size === ids.length;
}

/** Pin scroll distance: shorter on small screens so the film does not trap. */
export function pinEndDistance(compact: boolean): string {
  return compact ? "+=460%" : "+=740%";
}

export function headerStackPx(header?: Element | null): number {
  if (header instanceof HTMLElement) {
    const height = Math.round(header.getBoundingClientRect().height);
    if (height > 0) return height;
  }
  return 104;
}
