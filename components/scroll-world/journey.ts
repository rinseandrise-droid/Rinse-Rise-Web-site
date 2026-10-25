/**
 * Scroll World timeline map. The master timeline runs from 0 to 100 "beats";
 * scroll progress maps linearly onto it. Tune pacing here.
 *
 *  0  intro — shirt on hanger            58  door opens, shirt to dryer
 *  8  shirt leaves hanger                 66  dry
 * 16  washer door opens, shirt enters     75  shirt to ironing board
 * 24  wash — water, drum, bubbles         78  steam press
 * 32  foam / deep clean                   84  quality check
 * 42  rinse — water clears, stains fade   88  folding
 * 50  spin & extract                      93  packing
 *                                         97  delivery bag → final CTA
 *
 * Numbered process stages (01–08). Intro is unnumbered opening copy.
 */
export const STEPS = [
  { id: "wash", label: "Wash", at: 22 },
  { id: "rinse", label: "Rinse", at: 42 },
  { id: "spin", label: "Spin & Extract", at: 50 },
  { id: "dry", label: "Dry", at: 58 },
  { id: "press", label: "Steam Press", at: 76 },
  { id: "qc", label: "Quality Check", at: 84 },
  { id: "fold", label: "Fold", at: 88 },
  { id: "pack", label: "Pack", at: 93 },
] as const;

export const STEP_BLURBS: Record<(typeof STEPS)[number]["id"], string> = {
  wash: "Cleaned with the right process.",
  rinse: "Dirty water out, clean water in.",
  spin: "A fast, smooth spin draws the water out.",
  dry: "Dried according to the fabric.",
  press: "Steam finished.",
  qc: "Inspected before it moves on.",
  fold: "Folded neatly.",
  pack: "Packed for delivery.",
};

export interface Caption {
  id: string;
  eyebrow?: string;
  title: string;
  body?: string;
  note?: string;
  in: number;
  out: number;
}

export const CAPTIONS: Caption[] = [
  { id: "wash", eyebrow: "01 · Wash", title: "Wash", body: "Every garment starts with the right cleaning process.", in: 23, out: 41 },
  { id: "rinse", eyebrow: "02 · Rinse", title: "Rinse", body: "Thoroughly refreshed. Dirty water out, clean water in.", in: 42.5, out: 49.5 },
  { id: "spin", eyebrow: "03 · Spin & Extract", title: "Spin & extract", body: "A fast, smooth spin draws the water out.", in: 50.5, out: 57.5 },
  {
    id: "dry",
    eyebrow: "04 · Dry",
    title: "Dry",
    body: "Gentle, even drying with controlled heat.",
    note: "Drying method selected according to fabric care requirements.",
    in: 66.5,
    out: 74.5,
  },
  { id: "press", eyebrow: "05 · Steam Press", title: "Steam pressed", body: "Crisp. Clean. Ready. Finished with care.", in: 78, out: 83.5 },
  { id: "qc", eyebrow: "06 · Quality Check", title: "Quality checked", body: "Every piece is inspected before it moves on.", in: 85, out: 88.4 },
  { id: "fold", eyebrow: "07 · Fold", title: "Folded with precision", body: "Sleeves in, edges square, neatly stacked.", in: 88.8, out: 92.8 },
  { id: "pack", eyebrow: "08 · Pack", title: "Packed for you", body: "Ready to return to you.", in: 93.6, out: 97.4 },
];

export interface Chip {
  id: string;
  label: string;
  group: "wash" | "dry" | "qc";
  in: number;
  out: number;
  check?: boolean;
}

export const CHIPS: Chip[] = [
  { id: "deep-clean", label: "Deep clean", group: "wash", in: 26, out: 41 },
  { id: "fabric-care", label: "Fabric care", group: "wash", in: 28.5, out: 41 },
  { id: "freshness", label: "Freshness", group: "wash", in: 31, out: 41 },
  { id: "hygienic", label: "Hygienic wash", group: "wash", in: 33.5, out: 41 },
  { id: "heat", label: "Controlled heat", group: "dry", in: 68.5, out: 74.5 },
  { id: "friendly", label: "Fabric friendly", group: "dry", in: 70, out: 74.5 },
  { id: "clean", label: "Clean", group: "qc", in: 85.6, out: 88.6, check: true },
  { id: "fresh", label: "Fresh", group: "qc", in: 86.2, out: 88.6, check: true },
  { id: "pressed", label: "Pressed", group: "qc", in: 86.8, out: 88.6, check: true },
  { id: "checked", label: "Quality checked", group: "qc", in: 87.4, out: 88.6, check: true },
];
