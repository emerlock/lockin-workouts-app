import type { Exercise, WorkoutRoutine } from "../types/workout";
import { STANDING_NO_EQUIPMENT_EXERCISES } from "./exercises";

const TARGET_DURATION_SECONDS = 30 * 60;
const INTERVAL_SECONDS = 30;
const WARMUP_INTERVAL_SECONDS = 60;
const DEFAULT_WARMUP_IDS = [
  "neck-rolls",
  "shoulder-rolls",
  "hip-circles",
  "dynamic-hamstring-scoops",
  "standing-calf-stretch",
];
const DEFAULT_COOLDOWN_IDS = [
  "standing-forward-fold-stretch",
  "cross-body-shoulder-stretch",
  "overhead-triceps-stretch",
  "standing-quad-hold-stretch",
  "deep-breathing-arm-sweeps",
];

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

export function buildFiveMinuteWarmupRoutine(exercises: Exercise[]): WorkoutRoutine {
  const selected = exercises.slice(0, 5);
  const intervals: WorkoutRoutine["intervals"] = selected.map((exercise, index) => ({
    id: `${exercise.id}-warmup-${index + 1}`,
    label: exercise.name,
    description: exercise.description,
    type: "exercise",
    durationSeconds: WARMUP_INTERVAL_SECONDS,
  }));

  return {
    name: "5-Minute Warm-Up Routine",
    intervals,
  };
}

export function buildFiveMinuteCooldownRoutine(exercises: Exercise[]): WorkoutRoutine {
  const selected = exercises.slice(0, 5);
  const intervals: WorkoutRoutine["intervals"] = selected.map((exercise, index) => ({
    id: `${exercise.id}-cooldown-${index + 1}`,
    label: exercise.name,
    description: exercise.description,
    type: "exercise",
    durationSeconds: WARMUP_INTERVAL_SECONDS,
  }));

  return {
    name: "5-Minute Cooldown Routine",
    intervals,
  };
}

function findExercise(id: string): Exercise | undefined {
  return STANDING_NO_EQUIPMENT_EXERCISES.find((exercise) => exercise.id === id);
}

export function getDefaultWarmupExercises(): Exercise[] {
  return DEFAULT_WARMUP_IDS.map(findExercise).filter((value): value is Exercise => Boolean(value));
}

export function getDefaultCooldownExercises(): Exercise[] {
  return DEFAULT_COOLDOWN_IDS.map(findExercise).filter((value): value is Exercise => Boolean(value));
}

export function buildDefaultWarmupRoutine(): WorkoutRoutine {
  return buildFiveMinuteWarmupRoutine(getDefaultWarmupExercises());
}

export function buildDefaultCooldownRoutine(): WorkoutRoutine {
  return buildFiveMinuteCooldownRoutine(getDefaultCooldownExercises());
}
