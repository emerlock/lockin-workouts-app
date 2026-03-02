import type { Exercise, WorkoutRoutine } from "../types/workout";

const TARGET_DURATION_SECONDS = 30 * 60;
const INTERVAL_SECONDS = 30;

export function buildStandingIntervalRoutine(exercises: Exercise[]): WorkoutRoutine {
  const intervals: WorkoutRoutine["intervals"] = [];

  if (exercises.length === 0) {
    return {
      name: "Standing 30/30 Routine (~30 min)",
      intervals,
    };
  }

  let bestRounds = 1;
  let smallestDiff = Number.POSITIVE_INFINITY;

  for (let rounds = 1; rounds <= 200; rounds += 1) {
    const workBlocks = rounds * exercises.length;
    const totalSeconds = (2 * workBlocks - 1) * INTERVAL_SECONDS;
    const diff = Math.abs(TARGET_DURATION_SECONDS - totalSeconds);

    if (diff < smallestDiff) {
      smallestDiff = diff;
      bestRounds = rounds;
    }
  }

  const orderedExercises: Exercise[] = [];
  for (let round = 0; round < bestRounds; round += 1) {
    orderedExercises.push(...exercises);
  }

  intervals.push({
    id: "warmup-walk",
    label: "Walking in Place",
    description: "Walk in place with tall posture, steady breathing, and relaxed arm swing.",
    type: "walk",
    durationSeconds: INTERVAL_SECONDS,
  });

  orderedExercises.forEach((exercise, index) => {
    intervals.push({
      id: `${exercise.id}-work-${index + 1}`,
      label: exercise.name,
      description: exercise.description,
      type: "exercise",
      durationSeconds: INTERVAL_SECONDS,
    });

    if (index < orderedExercises.length - 1) {
      intervals.push({
        id: `${exercise.id}-walk-${index + 1}`,
        label: "Walking in Place",
        description: "Recover by walking in place and preparing for the next movement.",
        type: "walk",
        durationSeconds: INTERVAL_SECONDS,
      });
    }
  });

  return {
    name: "Standing 30/30 Routine (~30 min)",
    intervals,
  };
}
