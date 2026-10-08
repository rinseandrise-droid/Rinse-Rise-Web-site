/** Deterministic pseudo-random numbers so server and client render identical SVG. */
export function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** World layout: each station occupies one 1600-unit-wide "screen" of the scene. */
export const STATION_WIDTH = 1600;

export const WORLD = {
  hanger: { x: 800, y: 150 },
  washer: { x: 2400, y: 500 },
  dryer: { x: 4000, y: 500 },
  board: { x: 5600, y: 600 },
  table: { x: 7200, y: 630 },
  pack: { x: 8800, y: 560 },
} as const;

/** Shirt artwork is drawn with its collar at (0,0) and is ~340 units tall. */
export const SHIRT_HEIGHT = 340;
