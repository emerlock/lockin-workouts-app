import { create } from "zustand";
import { STANDING_NO_EQUIPMENT_EXERCISES } from "./exercises";
import { buildStandingIntervalRoutine } from "./routines";
import type { Exercise, Workout } from "../types/workout";

type WorkoutState = {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, "id">) => void;
  getWorkoutById: (id: string) => Workout | undefined;
};

const exerciseById = (id: string): Exercise => {
  const exercise = STANDING_NO_EQUIPMENT_EXERCISES.find((entry) => entry.id === id);
  if (!exercise) {
    throw new Error(`Missing exercise id: ${id}`);
  }
  return exercise;
};

const buildSeedWorkout = ({
  id,
  name,
  description,
  tags,
  sets,
  reps,
  exerciseIds,
}: {
  id: string;
  name: string;
  description: string;
  tags: string[];
  sets: number;
  reps: number;
  exerciseIds: string[];
}): Workout => {
  const exercises = exerciseIds.map(exerciseById);
  return {
    id,
    name,
    description,
    tags,
    sets,
    reps,
    exercises,
    routine: buildStandingIntervalRoutine(exercises),
  };
};

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: [
    buildSeedWorkout({
      id: "1",
      name: "Standing Conditioning",
      description:
        "A fast-paced standing cardio session to elevate heart rate and improve stamina with low equipment needs.",
      tags: ["standing", "cardio", "conditioning", "warm-up friendly"],
      sets: 4,
      reps: 12,
      exerciseIds: [
        "jumping-jacks",
        "high-knees",
        "butt-kicks",
        "march-and-reach",
        "speed-skips",
        "standing-cross-punches",
      ],
    }),
    buildSeedWorkout({
      id: "2",
      name: "Lower Body Standing",
      description:
        "Targets quads, glutes, hamstrings, and calves through standing leg patterns and single-leg control.",
      tags: ["standing", "lower body", "glutes", "balance"],
      sets: 3,
      reps: 10,
      exerciseIds: [
        "air-squats",
        "reverse-lunges",
        "lateral-lunges",
        "standing-calf-raises",
        "curtsy-lunges",
        "standing-hip-abductions",
        "standing-hamstring-curls",
      ],
    }),
    buildSeedWorkout({
      id: "3",
      name: "Standing Cardio Mix",
      description:
        "An interval-focused standing workout that blends agility and rhythm for full-body cardio conditioning.",
      tags: ["standing", "cardio", "agility", "full body"],
      sets: 3,
      reps: 12,
      exerciseIds: [
        "jumping-jacks",
        "high-knees",
        "skater-steps",
        "march-and-reach",
        "standing-cross-punches",
        "speed-skips",
      ],
    }),
    buildSeedWorkout({
      id: "4",
      name: "Bodyweight Push and Plank",
      description:
        "Builds upper-body and core endurance with plank mechanics, push strength, and anti-rotation control.",
      tags: ["bodyweight", "push", "plank", "core stability"],
      sets: 3,
      reps: 12,
      exerciseIds: [
        "inchworm-walkouts",
        "plank-shoulder-taps",
        "mountain-climbers",
        "push-ups",
        "forearm-plank-hold",
        "plank-jacks",
      ],
    }),
    buildSeedWorkout({
      id: "5",
      name: "Bodyweight Core Control",
      description:
        "Focused core session emphasizing trunk control, anti-extension strength, and rotational endurance.",
      tags: ["bodyweight", "core", "control", "trunk stability"],
      sets: 4,
      reps: 10,
      exerciseIds: [
        "dead-bugs",
        "bicycle-crunches",
        "lying-leg-raises",
        "hollow-body-hold",
        "glute-bridges",
        "side-plank-dips",
      ],
    }),
    buildSeedWorkout({
      id: "6",
      name: "Bodyweight Posterior and Crawl",
      description:
        "Strengthens posterior chain and shoulder endurance through prone work and crawling locomotion.",
      tags: ["bodyweight", "posterior chain", "crawling", "shoulders"],
      sets: 4,
      reps: 12,
      exerciseIds: [
        "bird-dogs",
        "reverse-snow-angels",
        "superman-holds",
        "prone-swimmers",
        "bear-crawls",
        "crab-toe-touches",
      ],
    }),
  ],
  addWorkout: (workout) =>
    set((state) => ({
      workouts: [...state.workouts, { id: crypto.randomUUID(), ...workout }],
    })),
  getWorkoutById: (id) => get().workouts.find((workout) => workout.id === id),
}));
