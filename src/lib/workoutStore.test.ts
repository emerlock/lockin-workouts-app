import { describe, expect, it } from "vitest";
import { useWorkoutStore } from "./workoutStore";

describe("workout store seed data", () => {
  it("seeds workouts with description, tags, and at least 6 exercises", () => {
    const workouts = useWorkoutStore.getState().workouts;

    expect(workouts.length).toBeGreaterThanOrEqual(6);
    for (const workout of workouts) {
      expect(workout.description.length).toBeGreaterThan(0);
      expect(workout.tags.length).toBeGreaterThan(0);
      expect(workout.exercises.length).toBeGreaterThanOrEqual(6);
    }
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
