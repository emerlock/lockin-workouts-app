import { describe, expect, it } from "vitest";
import { useWorkoutStore } from "./workoutStore";

describe("workout store seed data", () => {
  it("seeds workouts with descriptions/tags and expected exercise counts", () => {
    const workouts = useWorkoutStore.getState().workouts;

    expect(workouts.length).toBeGreaterThanOrEqual(6);
    for (const workout of workouts) {
      expect(workout.description.length).toBeGreaterThan(0);
      expect(workout.tags.length).toBeGreaterThan(0);
      if (workout.name === "5-Minute Warm-Up Flow" || workout.name === "5-Minute Cooldown Flow") {
        expect(workout.exercises.length).toBe(5);
      } else {
        expect(workout.exercises.length).toBeGreaterThanOrEqual(6);
      }
    }
  });

  it("includes a 5-minute warm-up with 5x60s warm-up-only intervals", () => {
    const warmup = useWorkoutStore
      .getState()
      .workouts.find((workout) => workout.name === "5-Minute Warm-Up Flow");

    expect(warmup).toBeDefined();
    expect(warmup?.exercises.length).toBe(5);
    expect(warmup?.tags.some((tag) => tag.toLowerCase().includes("warm-up"))).toBe(true);
    expect(warmup?.routine.intervals.length).toBe(5);
    expect(warmup?.routine.intervals.every((interval) => interval.durationSeconds === 60)).toBe(true);
    expect(warmup?.routine.intervals.every((interval) => interval.type === "exercise")).toBe(true);
  });

  it("includes a 5-minute cooldown with 5x60s cooldown-only intervals", () => {
    const cooldown = useWorkoutStore
      .getState()
      .workouts.find((workout) => workout.name === "5-Minute Cooldown Flow");

    expect(cooldown).toBeDefined();
    expect(cooldown?.exercises.length).toBe(5);
    expect(cooldown?.tags.some((tag) => tag.toLowerCase().includes("cooldown"))).toBe(true);
    expect(cooldown?.routine.intervals.length).toBe(5);
    expect(cooldown?.routine.intervals.every((interval) => interval.durationSeconds === 60)).toBe(true);
    expect(cooldown?.routine.intervals.every((interval) => interval.type === "exercise")).toBe(true);
  });

  it("keeps bodyweight-focused workouts bodyweight-only", () => {
    const workouts = useWorkoutStore
      .getState()
      .workouts.filter((workout) => workout.name.toLowerCase().includes("bodyweight"));

    expect(workouts.length).toBeGreaterThanOrEqual(3);
    for (const workout of workouts) {
      expect(workout.exercises.every((exercise) => exercise.exerciseType === "bodyweight")).toBe(true);
      expect(workout.tags.some((tag) => tag.toLowerCase().includes("bodyweight"))).toBe(true);
    }
  });
});
