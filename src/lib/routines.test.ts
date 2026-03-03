import { describe, expect, it } from "vitest";
import { STANDING_NO_EQUIPMENT_EXERCISES } from "./exercises";
import {
  buildFiveMinuteCooldownRoutine,
  buildFiveMinuteWarmupRoutine,
  buildStandingIntervalRoutine,
} from "./routines";

describe("buildStandingIntervalRoutine", () => {
  it("starts with walking in place and keeps 30 second intervals", () => {
    const exercises = STANDING_NO_EQUIPMENT_EXERCISES.slice(0, 6);
    const routine = buildStandingIntervalRoutine(exercises);

    expect(routine.intervals[0].label).toBe("Walking in Place");
    expect(routine.intervals[0].type).toBe("walk");
    expect(routine.intervals.every((interval) => interval.durationSeconds === 30)).toBe(true);
  });

  it("uses exercise names without '(work)' suffix and carries descriptions", () => {
    const exercises = STANDING_NO_EQUIPMENT_EXERCISES.slice(0, 2);
    const routine = buildStandingIntervalRoutine(exercises);

    const workIntervals = routine.intervals.filter((interval) => interval.type === "exercise");
    expect(workIntervals[0].label).toBe(exercises[0].name);
    expect(workIntervals[0].label.includes("(work)")).toBe(false);
    expect(workIntervals[0].description).toBe(exercises[0].description);
  });

  it("generates an approximately 30 minute routine", () => {
    const exercises = STANDING_NO_EQUIPMENT_EXERCISES.slice(0, 6);
    const routine = buildStandingIntervalRoutine(exercises);
    const totalSeconds = routine.intervals.reduce((sum, interval) => sum + interval.durationSeconds, 0);

    expect(totalSeconds).toBeGreaterThanOrEqual(29 * 60);
    expect(totalSeconds).toBeLessThanOrEqual(31 * 60);
  });
});

describe("buildFiveMinuteWarmupRoutine", () => {
  it("creates exactly five 60-second exercise-only intervals", () => {
    const exercises = STANDING_NO_EQUIPMENT_EXERCISES.filter((exercise) =>
      [
        "neck-rolls",
        "shoulder-rolls",
        "hip-circles",
        "dynamic-hamstring-scoops",
        "standing-calf-stretch",
      ].includes(exercise.id),
    );
    const routine = buildFiveMinuteWarmupRoutine(exercises);

    expect(routine.name).toBe("5-Minute Warm-Up Routine");
    expect(routine.intervals).toHaveLength(5);
    expect(routine.intervals.every((interval) => interval.durationSeconds === 60)).toBe(true);
    expect(routine.intervals.every((interval) => interval.type === "exercise")).toBe(true);
  });
});

describe("buildFiveMinuteCooldownRoutine", () => {
  it("creates exactly five 60-second exercise-only intervals", () => {
    const exercises = STANDING_NO_EQUIPMENT_EXERCISES.filter((exercise) =>
      [
        "standing-forward-fold-stretch",
        "cross-body-shoulder-stretch",
        "overhead-triceps-stretch",
        "standing-quad-hold-stretch",
        "deep-breathing-arm-sweeps",
      ].includes(exercise.id),
    );
    const routine = buildFiveMinuteCooldownRoutine(exercises);

    expect(routine.name).toBe("5-Minute Cooldown Routine");
    expect(routine.intervals).toHaveLength(5);
    expect(routine.intervals.every((interval) => interval.durationSeconds === 60)).toBe(true);
    expect(routine.intervals.every((interval) => interval.type === "exercise")).toBe(true);
  });
});
