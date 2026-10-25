import assert from "node:assert/strict";
import { test } from "node:test";
import {
  activeStepIndex,
  captionIndexAtBeat,
  clamp01,
  hasUniqueIds,
  pinEndDistance,
  progressToBeat,
  stageNumbers,
} from "./journey-progress.ts";
import { CAPTIONS, STEPS } from "../components/scroll-world/journey.ts";

const ORDER = ["wash", "rinse", "spin", "dry", "press", "qc", "fold", "pack"] as const;

test("journey stages are numbered 01–08 without duplicates", () => {
  assert.deepEqual(
    STEPS.map((s) => s.id),
    [...ORDER]
  );
  assert.equal(STEPS.length, 8);
  assert.deepEqual(stageNumbers(STEPS.length), ["01", "02", "03", "04", "05", "06", "07", "08"]);
  assert.equal(hasUniqueIds(STEPS), true);
  assert.equal(hasUniqueIds(CAPTIONS), true);
  assert.deepEqual(
    CAPTIONS.map((c) => c.eyebrow?.slice(0, 2)),
    ["01", "02", "03", "04", "05", "06", "07", "08"]
  );
});

test("clamp01 and progressToBeat handle invalid and boundary values", () => {
  assert.equal(clamp01(-2), 0);
  assert.equal(clamp01(0), 0);
  assert.equal(clamp01(0.5), 0.5);
  assert.equal(clamp01(2), 1);
  assert.equal(clamp01(Number.NaN), 0);
  assert.equal(progressToBeat(0), 0);
  assert.equal(progressToBeat(1), 100);
  assert.equal(progressToBeat(0.22), 22);
  assert.equal(progressToBeat(-1), 0);
  assert.equal(progressToBeat(9), 100);
});

test("active step is none during intro, then follows scroll forward and back", () => {
  assert.equal(activeStepIndex(0, STEPS), -1);
  assert.equal(activeStepIndex(0.1, STEPS), -1);
  assert.equal(STEPS[activeStepIndex(0.22, STEPS)].id, "wash");
  assert.equal(STEPS[activeStepIndex(0.42, STEPS)].id, "rinse");
  assert.equal(STEPS[activeStepIndex(0.5, STEPS)].id, "spin");
  assert.equal(STEPS[activeStepIndex(0.66, STEPS)].id, "dry");
  assert.equal(STEPS[activeStepIndex(0.78, STEPS)].id, "press");
  assert.equal(STEPS[activeStepIndex(0.85, STEPS)].id, "qc");
  assert.equal(STEPS[activeStepIndex(0.9, STEPS)].id, "fold");
  assert.equal(STEPS[activeStepIndex(0.95, STEPS)].id, "pack");
  assert.equal(STEPS[activeStepIndex(1, STEPS)].id, "pack");

  assert.equal(STEPS[activeStepIndex(0.93, STEPS)].id, "pack");
  assert.equal(STEPS[activeStepIndex(0.88, STEPS)].id, "fold");
  assert.equal(STEPS[activeStepIndex(0.43, STEPS)].id, "rinse");
  assert.equal(activeStepIndex(0.05, STEPS), -1);
});

test("captions do not overlap and match the active visual beat", () => {
  const sorted = [...CAPTIONS].sort((a, b) => a.in - b.in);
  for (let i = 1; i < sorted.length; i++) {
    assert.ok(sorted[i].in >= sorted[i - 1].out, `${sorted[i].id} overlaps ${sorted[i - 1].id}`);
  }
  assert.equal(CAPTIONS[captionIndexAtBeat(30, CAPTIONS)].id, "wash");
  assert.equal(CAPTIONS[captionIndexAtBeat(46, CAPTIONS)].id, "rinse");
  assert.equal(CAPTIONS[captionIndexAtBeat(54, CAPTIONS)].id, "spin");
  assert.equal(CAPTIONS[captionIndexAtBeat(70, CAPTIONS)].id, "dry");
  assert.equal(CAPTIONS[captionIndexAtBeat(80, CAPTIONS)].id, "press");
  assert.equal(CAPTIONS[captionIndexAtBeat(86, CAPTIONS)].id, "qc");
  assert.equal(CAPTIONS[captionIndexAtBeat(90, CAPTIONS)].id, "fold");
  assert.equal(CAPTIONS[captionIndexAtBeat(95, CAPTIONS)].id, "pack");
  assert.equal(captionIndexAtBeat(10, CAPTIONS), -1);
  assert.equal(captionIndexAtBeat(Number.NaN, CAPTIONS), -1);
});

test("missing animation data is safe", () => {
  assert.equal(activeStepIndex(0.5, []), -1);
  assert.equal(captionIndexAtBeat(50, []), -1);
  assert.equal(hasUniqueIds([]), true);
});

test("pin distance is shorter on compact viewports", () => {
  assert.equal(pinEndDistance(true), "+=460%");
  assert.equal(pinEndDistance(false), "+=740%");
});
